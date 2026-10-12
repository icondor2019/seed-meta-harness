import { promises as fs } from 'node:fs';
import path from 'node:path';
import { exists, lock, write, git, safePath, renameWithRetry, lineCheck } from './io.mjs';

const planning=['exploration.md','proposal.md','design.md','tasks.md'];
const states=['exploring','planning','plan_pending_approval','implementing','ready_for_review',
  'reviewing','changes_pending_approval','preparing_closure','knowledge_pending_approval',
  'persisting_memory','archiving','archived'];
const allowedRoles={explorer:['exploring'],planner:['planning'],builder:['implementing'],
  reviewer:['reviewing'],archivist:['preparing_closure','persisting_memory']};
async function branch(root) { return git(root,['rev-parse','--abbrev-ref','HEAD']); }
async function spec(root,checkBranch=true) {
  const open=path.join(root,'specs/open');
  let entries;
  try {entries=await fs.readdir(open,{withFileTypes:true});}
  catch(e) {if(e.code==='ENOENT') throw Error('No active spec');throw e;}
  const dirs=entries.filter(e=>e.isDirectory());
  if(!dirs.length) throw Error('No active spec');
  if(dirs.length!==1) throw Error('Exactly one active spec required');
  const dir=path.join(open,dirs[0].name);
  const raw=await fs.readFile(path.join(dir,'state.json'),'utf8');
  const s=JSON.parse(raw);
  if(![1,2,3].includes(s.version)||!(s.version===3?states:[...states,'publishing_knowledge','committing']).includes(s.state)||!Number.isInteger(s.revision)||
    s.id!==dirs[0].name||!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s.id)) throw Error('Corrupt workflow state');
  if(checkBranch && s.branch!==await branch(root)) throw Error('Spec belongs to another branch');
  return {dir,s,raw};
}
function summary(s) {
  return {id:s.id,state:s.state,revision:s.revision,version:s.version,
    awaitingUser:s.state.endsWith('_pending_approval')};
}
export async function status(root) {
  try {return summary((await spec(root,false)).s);}
  catch(e) {if(e.message==='No active spec') return {state:'idle'};throw e;}
}
export function statusLine(s) {return s.id?`${s.id}: ${s.state} (rev. ${s.revision})`:'SDD: idle';}
export async function authorizePersistence(root,actor,kind,target) {
  const {s}=await spec(root);
  if(s.version!==3||actor!=='archivist'||!s.implementationApproved) throw Error('Approved Archivist required');
  if(kind==='engram') {
    if(s.state!=='persisting_memory'||!s.selected?.length) throw Error('Explicit candidate selection required');
    const matching=s.candidates.filter(c=>s.selected.includes(c.id)&&c.content===target);
    if(!matching.length) throw Error('Only exact approved candidate content may be persisted');
    if(matching.every(c=>s.memory?.receipts?.some(r=>r.candidate===c.id))) throw Error('Candidate already persisted; reuse receipt');
  } else if(path.resolve(root,target)!==path.join(root,'specs/open',s.id,'memory.md')) {
    throw Error('Archivist writes only its own memory.md');
  }
}
async function required(dir,files) {
  for(const f of files) if(!await exists(path.join(dir,f))) throw Error(`Missing artifact: ${f}`);
}
function paths(root,files,requiredList=true) {
  if(!Array.isArray(files)||(requiredList&&!files.length)||new Set(files).size!==files.length) throw Error('Explicit unique paths required');
  for(const f of files) safePath(root,f);
  return [...files];
}
function clear(s) {
  for(const key of ['pending','implementationApproved','candidates','selected','memory']) delete s[key];
}
function checkDispatch(s,agent) {
  if(s.version!==3) throw Error('Migrate legacy workflow before dispatch');
  if(!allowedRoles[agent]?.includes(s.state)) throw Error(`Cannot dispatch ${agent} from ${s.state}`);
  if(agent==='archivist'&&!s.implementationApproved) throw Error('Human implementation approval required');
  if(s.state==='persisting_memory'&&!s.selected?.length) throw Error('Explicit candidate selection required');
}
export async function dispatch(root,agent) {
  const {s}=await spec(root);checkDispatch(s,agent);return summary(s);
}
export async function handoff(root,agent,note='') {
  await dispatch(root,agent);return {agent,prompt:note};
}

export async function run(root,action,args={},actor='orchestrator',context={}) {
  // Status only reads state.json. No Git, lock, artifacts, model or transition.
  if(action==='status') return status(root);
  return lock(root,async()=>{
    if(action==='create') {
      if(actor!=='orchestrator') throw Error('Orchestrator required');
      if(typeof args.id!=='string'||!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(args.id)) throw Error('Invalid spec id');
      if(typeof args.title!=='string'||!args.title.trim()) throw Error('Spec title required');
      const b=await branch(root);
      if(['main','master','HEAD'].includes(b)) throw Error('Feature branch required');
      const open=path.join(root,'specs/open');await fs.mkdir(open,{recursive:true});
      if((await fs.readdir(open,{withFileTypes:true})).some(e=>e.isDirectory())) throw Error('Active spec already exists');
      const dir=path.join(open,args.id);await fs.mkdir(dir);
      const s={version:3,id:args.id,title:args.title,branch:b,state:'exploring',revision:0};
      await write(path.join(dir,'state.json'),s);
      return {...summary(s),next:{action:'delegate',agent:'explorer',spec:s.id}};
    }
    const {dir,s,raw}=await spec(root);
    const save=async()=>{s.revision++;await write(path.join(dir,'state.json'),s);return summary(s);};
    const at=(...allowed)=>{if(!allowed.includes(s.state)) throw Error(`Invalid transition from ${s.state}`);};
    if(action==='migrate') {
      if(actor!=='orchestrator') throw Error('Orchestrator required');
      if(s.version===3) return summary(s);
      const backup=path.join(dir,`state.v${s.version}.backup.json`);
      try {await fs.writeFile(backup,raw,{flag:'wx'});}
      catch(e) {if(e.code!=='EEXIST'||await fs.readFile(backup,'utf8')!==raw) throw e;}
      const late=['preparing_closure','knowledge_pending_approval','publishing_knowledge','committing','archiving'];
      const approved=s.implementationApproved===true||s.approvals?.findLast(a=>a.stage==='changes_pending_approval')?.decision==='accept';
      if(s.memory) s.legacyMemory=s.memory;
      const persisted=s.memory?.result==='persisted'&&s.memory.observations?.length;
      const unnecessary=s.memory?.result==='not-needed'&&s.memory.reason?.trim();
      const selection=s.approvals?.findLast(a=>a.stage==='knowledge_pending_approval'&&a.decision==='accept')?.selected;
      const explicit=Array.isArray(s.candidates)&&s.candidates.length&&s.candidates.every(c=>typeof c.id==='string'&&typeof c.content==='string')&&
        Array.isArray(selection)&&new Set(selection).size===selection.length&&selection.every(id=>s.candidates.some(c=>c.id===id));
      let retainedCandidates,retainedSelection;
      if(late.includes(s.state)) {
        if(!approved) {s.state='changes_pending_approval';delete s.implementationApproved;delete s.memory;}
        else if(persisted) {s.implementationApproved=true;s.state='archiving';s.memory={result:'persisted',observations:[...s.memory.observations],legacy:true};}
        else if(unnecessary) {s.implementationApproved=true;s.state='archiving';s.memory={result:'not-needed',reason:s.memory.reason};}
        else if(explicit&&selection.length) {
          retainedCandidates=s.candidates;retainedSelection=selection;
          s.implementationApproved=true;s.state='persisting_memory';
          if(s.memory?.receipts?.length) s.memory={result:'partial',receipts:s.memory.receipts.filter(r=>selection.includes(r.candidate))};
          else delete s.memory;
        }
        else {s.implementationApproved=true;s.state='preparing_closure';delete s.memory;}
      }
      for(const key of ['plan','reviewSnapshot','reviewHash','accepted','pending','commitIntent','commit','documentation','documentationFiles','knowledge','knowledgeApproved','selected','candidates']) delete s[key];
      if(retainedCandidates) {s.candidates=retainedCandidates;s.selected=retainedSelection;}
      s.version=3;return save();
    }
    if(s.version!==3) throw Error('Migrate legacy workflow first');
    if(action==='handoff') {
      if(actor!=='orchestrator') throw Error('Orchestrator required');
      return handoff(root,args.agent,args.note);
    }
    if(action==='report') {
      if(!allowedRoles[actor]) throw Error('Specialist required');
      await dispatch(root,actor);
      if(!['completed','blocked','interrupted'].includes(args.result)||typeof args.summary!=='string'||args.summary.length>500) throw Error('Brief specialist report required');
      if(!Array.isArray(args.concerns??[])||(args.concerns??[]).length>5) throw Error('At most five concerns');
      for(const c of args.concerns??[]) {
        if(!c.id||typeof c.question!=='string'||c.question.length>600||!/^[-a-z0-9]+\.md$/.test(c.artifact)) throw Error('Concern id, question and local artifact required');
        if(!Number.isInteger(c.start)||!Number.isInteger(c.end)||c.start<1||c.end<c.start||c.end-c.start>29) throw Error('Concern excerpt is limited to 30 lines');
      }
      s.reports??={};s.reports[actor]={result:args.result,summary:args.summary,concerns:args.concerns??[]};
      await save();return s.reports[actor];
    }
    if(action==='concern'||action==='answer') {
      if(actor!=='orchestrator') throw Error('Orchestrator required');
      const concern=s.reports?.[args.owner]?.concerns.find(c=>c.id===args.id);
      if(!concern) throw Error('Explicit specialist concern required');
      if(action==='concern') {
        const lines=(await fs.readFile(path.join(dir,concern.artifact),'utf8')).split(/\r?\n/);
        return {...concern,excerpt:lines.slice(concern.start-1,concern.end).join('\n')};
      }
      if(typeof args.answer!=='string'||!args.answer.trim()||args.answer.length>1000) throw Error('Brief user answer required');
      s.answers??=[];s.answers=s.answers.filter(a=>a.owner!==args.owner||a.id!==args.id);
      s.answers.push({owner:args.owner,id:args.id,answer:args.answer});return save();
    }
    if(action==='validate') {
      const files=s.state==='exploring'?[]:s.state==='planning'?['exploration.md']:planning;
      await required(dir,files);await lineCheck(root);return summary(s);
    }
    if(action==='review') {
      if(actor!=='reviewer') throw Error('Reviewer required');
      at('reviewing');await required(dir,[...planning,'implementation.md','review.md']);
      if(!['pass','changes-required'].includes(args.verdict)) throw Error('Invalid verdict');
      s.review=args.verdict;clear(s);
      s.state=args.verdict==='pass'?'changes_pending_approval':'implementing';return save();
    }
    if(action==='prepare_closure') {
      if(actor!=='archivist') throw Error('Archivist required');
      at('preparing_closure');await required(dir,['memory.md']);
      if(!s.implementationApproved) throw Error('Human implementation approval required');
      if(!Array.isArray(args.candidates)||new Set(args.candidates.map(c=>c.id)).size!==args.candidates.length||
        args.candidates.some(c=>typeof c.id!=='string'||!c.id.trim()||typeof c.content!=='string'||!c.content.trim())) throw Error('Unique candidate IDs and explicit content required');
      s.candidates=args.candidates.map(c=>({id:c.id,content:c.content}));
      if(s.candidates.length) s.state='knowledge_pending_approval';
      else {
        if(!args.reason?.trim()) throw Error('Reason required');
        s.selected=[];s.memory={result:'not-needed',reason:args.reason};s.state='archiving';
      }
      return save();
    }
    if(action==='memory') {
      if(actor!=='archivist') throw Error('Archivist required');
      at('persisting_memory');await required(dir,['memory.md']);
      if(!Array.isArray(args.receipts)||!args.receipts.length) throw Error('Candidate/observation receipts required');
      const receipts=[...(s.memory?.receipts??[])];
      for(const r of args.receipts) {
        if(!s.selected.includes(r.candidate)||typeof r.observation!=='string'||!r.observation.trim()) throw Error('Approved candidate and actual observation ID required');
        const existing=receipts.find(x=>x.candidate===r.candidate);
        if(existing) {if(existing.observation!==r.observation) throw Error('Conflicting receipt');continue;}
        if(receipts.some(x=>x.observation===r.observation)) throw Error('Observation already assigned');
        receipts.push({candidate:r.candidate,observation:r.observation});
      }
      const complete=s.selected.every(id=>receipts.some(r=>r.candidate===id));
      s.memory={result:complete?'persisted':'partial',receipts};
      if(complete) s.state='archiving';return save();
    }
    if(action==='archive') {
      if(actor!=='orchestrator') throw Error('Orchestrator required');
      at('archiving');if(!['persisted','not-needed'].includes(s.memory?.result)) throw Error('Memory receipt required');
      await required(dir,[...planning,'implementation.md','review.md','memory.md']);await lineCheck(root);
      const dest=path.join(root,'specs/archived',s.id);await fs.mkdir(path.dirname(dest),{recursive:true});
      try {await fs.lstat(dest);throw Error('Archive collision');} catch(e) {if(e.code!=='ENOENT') throw e;}
      await renameWithRetry(dir,dest);s.state='archived';s.revision++;
      try {await write(path.join(dest,'state.json'),s);} catch(e) {await renameWithRetry(dest,dir);throw e;}
      return summary(s);
    }
    if(actor!=='orchestrator') throw Error('Orchestrator required');
    if(action==='replan'||action==='correct') {
      at('planning','plan_pending_approval','implementing','ready_for_review','reviewing',
        'changes_pending_approval','preparing_closure','knowledge_pending_approval');
      clear(s);delete s.review;
      s.state=action==='replan'?'planning':'implementing';return save();
    }
    if(action==='transition') {
      const edges={exploring:'planning',planning:'plan_pending_approval',implementing:'ready_for_review',ready_for_review:'reviewing'};
      if(edges[s.state]!==args.to) throw Error('Transition not allowed');
      if(s.state==='exploring') await required(dir,['exploration.md']);
      if(s.state==='planning') await required(dir,planning);
      if(s.state==='implementing') {
        await required(dir,[...planning,'implementation.md']);s.files=paths(root,args.files);
      }
      await lineCheck(root);s.state=args.to;return save();
    }
    if(action==='request_approval') {
      at('plan_pending_approval','changes_pending_approval','knowledge_pending_approval');
      await required(dir,planning);
      if(s.state==='changes_pending_approval') await required(dir,['implementation.md','review.md']);
      s.pending??={stage:s.state,requestedAt:Date.now()};return save();
    }
    if(action==='approve') {
      at('plan_pending_approval','changes_pending_approval','knowledge_pending_approval');
      if(!['accept','reject'].includes(args.decision)) throw Error('Invalid decision');
      const message=context.userMessage;
      if(!s.pending||s.pending.stage!==s.state) throw Error('Request approval first');
      if(!message||message.role!=='user'||!message.id||!message.sessionID||!message.text?.trim()||!Number.isFinite(message.createdAt)||message.createdAt<s.pending.requestedAt) throw Error('Explicit user message after approval request required');
      if(s.approvals?.some(a=>a.messageID===message.id&&a.sessionID===message.sessionID)) throw Error('User decision already recorded');
      const stage=s.state;
      let selected;
      if(stage==='knowledge_pending_approval'&&args.decision==='accept') {
        selected=args.selected;
        if(!Array.isArray(selected)||new Set(selected).size!==selected.length||selected.some(id=>!s.candidates.some(c=>c.id===id))) throw Error('Explicit valid candidate selection required');
        if(!selected.length&&!args.reason?.trim()) throw Error('Reason required for empty selection');
      }
      s.approvals??=[];s.approvals.push({stage,decision:args.decision,source:'user-text',...(selected?{selected:[...selected]}:{}),messageID:message.id,sessionID:message.sessionID,at:new Date().toISOString()});
      delete s.pending;
      if(args.decision==='reject') {
        clear(s);s.state=stage==='plan_pending_approval'?'planning':stage==='knowledge_pending_approval'?'preparing_closure':'implementing';
        if(stage==='knowledge_pending_approval') s.implementationApproved=true;
        s.feedback={owner:stage==='plan_pending_approval'?'planner':stage==='knowledge_pending_approval'?'archivist':'builder',text:message.text.slice(0,1000)};
      } else if(stage==='plan_pending_approval') s.state='implementing';
      else if(stage==='changes_pending_approval') {s.implementationApproved=true;s.state='preparing_closure';}
      else {s.selected=[...selected];s.state=selected.length?'persisting_memory':'archiving';if(!selected.length) s.memory={result:'not-needed',reason:args.reason};}
      return save();
    }
    throw Error('Unknown action');
  });
}
