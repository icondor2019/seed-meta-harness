import test from 'node:test';
import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { run, dispatch, handoff, status, statusLine, authorizePersistence } from '../../.opencode/sdd/controller.mjs';
import { lock, lineCheck } from '../../.opencode/sdd/io.mjs';
import { fixture, git } from './helpers.mjs';
const candidates=[{id:'A1',content:'First reusable learning'},{id:'A2',content:'Second reusable learning'}];
async function ready(f) {await f.plan();await f.review();await f.acceptImplementation();}
async function selected(f,ids=['A2']) {
  await ready(f);await f.call('prepare_closure',{candidates},'archivist');
  await f.call('request_approval');await f.decision('accept','Approve chosen candidates',{selected:ids,reason:'No candidates needed'});
}

test('complete cycle without reports, commits, hashes or Git changes; archive belongs to Orchestrator',async t=>{
 const f=await fixture(t);const head=git(f.root,'rev-parse','HEAD');
 await fs.writeFile(path.join(f.root,'base.txt'),'unrelated staged');git(f.root,'add','base.txt');
 const index=git(f.root,'diff','--cached');await ready(f);
 await f.noKnowledge();assert.equal((await f.state()).state,'archiving');
 await assert.rejects(f.call('archive',{},'archivist'),/Orchestrator/);
 const result=await f.call('archive');assert.equal(result.state,'archived');
 assert.equal(git(f.root,'rev-parse','HEAD'),head);assert.equal(git(f.root,'diff','--cached'),index);
 assert.equal((await status(f.root)).state,'idle');
 const stored=JSON.parse(await fs.readFile(path.join(f.root,'specs/archived/test/state.json'),'utf8'));
 assert.equal(stored.version,3);assert.equal(stored.commit,undefined);assert.equal(stored.reports,undefined);
});
test('partial approval persists only exact selected candidates; no human approval means no persistence',async t=>{
 const f=await fixture(t);await ready(f);
 await assert.rejects(authorizePersistence(f.root,'archivist','engram',candidates[0].content),/selection/);
 await f.call('prepare_closure',{candidates},'archivist');
 await assert.rejects(dispatch(f.root,'archivist'),/Cannot dispatch/);
 await f.call('request_approval');await assert.rejects(f.decision(),/selection/);
 await f.decision('accept','Only A2',{selected:['A2']});
 assert.deepEqual((await f.state()).selected,['A2']);
 await assert.rejects(authorizePersistence(f.root,'archivist','engram',candidates[0].content),/exact approved/);
 await assert.rejects(authorizePersistence(f.root,'archivist','engram','Changed content'),/exact approved/);
 await authorizePersistence(f.root,'archivist','engram',candidates[1].content);
 await assert.rejects(f.call('memory',{receipts:[{candidate:'A1',observation:'1'}]},'archivist'),/Approved candidate/);
 await f.call('memory',{receipts:[{candidate:'A2',observation:'2'}]},'archivist');
 assert.equal((await f.state()).state,'archiving');await f.call('archive');
});
test('incremental receipts survive restart and failures; only pending saves are authorized',async t=>{
 const f=await fixture(t);await selected(f,['A1','A2']);
 await f.call('memory',{receipts:[{candidate:'A1',observation:'101'}]},'archivist');
 assert.equal((await f.state()).memory.result,'partial');
 await assert.rejects(authorizePersistence(f.root,'archivist','engram',candidates[0].content),/already persisted/);
 const before=await f.state();
 await assert.rejects(f.call('memory',{receipts:[{candidate:'A2',observation:'101'}]},'archivist'),/already assigned/);
 assert.deepEqual(await f.state(),before);await assert.rejects(f.call('archive'),/Invalid transition/);
 await authorizePersistence(f.root,'archivist','engram',candidates[1].content);
 await run(f.root,'memory',{receipts:[{candidate:'A1',observation:'101'}]},'archivist');
 assert.equal((await f.state()).memory.receipts.length,1);
 await f.call('memory',{receipts:[{candidate:'A2',observation:'102'}]},'archivist');
 assert.equal((await f.state()).state,'archiving');
});
test('empty proposals and empty user selections close without memory writes',async t=>{
 const f=await fixture(t);await ready(f);await f.call('prepare_closure',{candidates},'archivist');
 await f.call('request_approval');await f.decision('accept','None',{selected:[],reason:'No lasting value'});
 assert.equal((await f.state()).memory.result,'not-needed');
 await assert.rejects(dispatch(f.root,'archivist'),/Cannot dispatch/);await f.call('archive');
});
test('final rejection and knowledge rejection return to the owner with renewed gates',async t=>{
 const f=await fixture(t);await f.plan();await f.review();await f.call('request_approval');await f.decision('reject','Change label');
 assert.equal((await f.state()).state,'implementing');await assert.rejects(dispatch(f.root,'archivist'),/Cannot dispatch/);
 await f.review();await f.acceptImplementation();await f.call('prepare_closure',{candidates},'archivist');
 await f.call('request_approval');await f.decision('reject','Revise proposal');
 assert.equal((await f.state()).state,'preparing_closure');assert.equal((await f.state()).implementationApproved,true);
 await assert.rejects(authorizePersistence(f.root,'archivist','engram',candidates[0].content),/selection/);
});
test('design frontend no-applicable line satisfies existence; missing design blocks planning',async t=>{
 const f=await fixture(t);await f.put('exploration.md');await f.call('transition',{to:'planning'});
 await f.put('proposal.md');await f.put('tasks.md');
 await assert.rejects(f.call('transition',{to:'plan_pending_approval'}),/design.md/);
 await f.put('design.md','No aplica: este cambio no incluye UI/frontend');
 await f.call('transition',{to:'plan_pending_approval'});await f.call('request_approval');await f.decision();
});
test('handoff preserves full context verbatim and never reads artifact narratives',async t=>{
 const f=await fixture(t);const prompt='Why called / context / task '+ 'x'.repeat(4000);
 await f.put('memory.md','False historical state: committing');
 assert.equal((await handoff(f.root,'explorer',prompt)).prompt,prompt);
 await assert.rejects(handoff(f.root,'archivist',prompt),/Cannot dispatch/);
 await ready(f);assert.equal((await handoff(f.root,'archivist',prompt)).prompt,prompt);
});
test('optional concerns still provide bounded excerpts and user answers',async t=>{
 const f=await fixture(t);await f.put('exploration.md');await f.call('transition',{to:'planning'});
 await f.put('proposal.md','line1\nline2\nline3');
 await f.call('report',{result:'blocked',summary:'Need scope',concerns:[{id:'Q1',question:'Scope?',artifact:'proposal.md',start:2,end:2}]},'planner');
 assert.equal((await f.call('concern',{owner:'planner',id:'Q1'})).excerpt,'line2');
 await f.call('answer',{owner:'planner',id:'Q1',answer:'Only current component'});
 assert.equal((await f.state()).answers[0].answer,'Only current component');
});
test('status reads only metadata even with lock and wrong branch',async t=>{
 const f=await fixture(t);const original=fs.readFile.bind(fs);const reads=[];
 t.mock.method(fs,'readFile',async(p,...args)=>{reads.push(String(p));return original(p,...args);});
 await lock(f.root,async()=>assert.equal(statusLine(await status(f.root)),'test: exploring (rev. 0)'));
 assert.deepEqual(reads,[path.join(f.dir,'state.json')]);git(f.root,'switch','-c','codex/other');
 assert.equal((await status(f.root)).state,'exploring');
});
test('legacy migration backs up exact metadata and requires fresh explicit selection',async t=>{
 const f=await fixture(t);const state={...await f.state(),version:2,state:'publishing_knowledge',implementationApproved:true,commit:'old-sha',knowledgeApproved:true,approvals:[{decision:'accept'}]};
 const raw=JSON.stringify(state);await fs.writeFile(path.join(f.dir,'state.json'),raw);
 await f.call('migrate');assert.equal((await f.state()).state,'preparing_closure');assert.equal((await f.state()).commit,undefined);
 assert.equal(await fs.readFile(path.join(f.dir,'state.v2.backup.json'),'utf8'),raw);
 const migrated=await f.state();await f.call('migrate');assert.deepEqual(await f.state(),migrated);
 await assert.rejects(authorizePersistence(f.root,'archivist','engram','old'),/selection/);
});
test('legacy persisted memories are preserved and never queued again',async t=>{
 const f=await fixture(t);const legacy={...await f.state(),version:1,state:'archiving',approvals:[{stage:'changes_pending_approval',decision:'accept'}],memory:{result:'persisted',observations:['134']},commit:'old'};
 await fs.writeFile(path.join(f.dir,'state.json'),JSON.stringify(legacy));await f.call('migrate');
 assert.equal((await f.state()).state,'archiving');assert.deepEqual((await f.state()).memory.observations,['134']);
 await assert.rejects(dispatch(f.root,'archivist'),/Cannot dispatch/);
});
test('legacy explicit selection and partial receipts resume only pending candidates',async t=>{
 const f=await fixture(t);const legacy={...await f.state(),version:2,state:'committing',implementationApproved:true,candidates,
 approvals:[{stage:'knowledge_pending_approval',decision:'accept',selected:['A1','A2']}],memory:{result:'partial',receipts:[{candidate:'A1',observation:'9'}]}};
 await fs.writeFile(path.join(f.dir,'state.json'),JSON.stringify(legacy));await f.call('migrate');
 assert.equal((await f.state()).state,'persisting_memory');assert.deepEqual((await f.state()).selected,['A1','A2']);
 await assert.rejects(authorizePersistence(f.root,'archivist','engram',candidates[0].content),/already persisted/);
 await authorizePersistence(f.root,'archivist','engram',candidates[1].content);
});
test('exclusive lock blocks mutations and invalid creation leaves no spec',async t=>{
 const f=await fixture(t);const before=await f.state();
 await lock(f.root,async()=>assert.rejects(f.call('validate'),e=>e.code==='EEXIST'));
 assert.deepEqual(await f.state(),before);
 await assert.rejects(f.call('create',{id:'other',title:'Other'}),/Active spec/);
 await fs.unlink(path.join(f.dir,'state.json'));await fs.rmdir(f.dir);
 await assert.rejects(f.call('create',{id:'BAD',title:'Bad'}),/Invalid spec id/);
 assert.deepEqual(await fs.readdir(path.dirname(f.dir)),[]);
 git(f.root,'switch','-c','main');await assert.rejects(f.call('create',{id:'new',title:'New'}),/Feature branch/);
 git(f.root,'switch','codex/test');const created=await f.call('create',{id:'new',title:'New'});
 assert.deepEqual(created.next,{action:'delegate',agent:'explorer',spec:'new'});
});
test('archive collision and write failure retain source and state',async t=>{
 const f=await fixture(t);await ready(f);await f.noKnowledge();
 const destination=path.join(f.root,'specs/archived/test');await fs.mkdir(destination,{recursive:true});
 await assert.rejects(f.call('archive'),/Archive collision/);assert.equal((await f.state()).state,'archiving');
 await fs.rmdir(destination);const original=fs.writeFile.bind(fs);
 t.mock.method(fs,'writeFile',async(p,...args)=>{if(String(p).includes('archived')&&String(p).endsWith('state.json.tmp')) throw Object.assign(Error('denied'),{code:'EACCES'});return original(p,...args);});
 await assert.rejects(f.call('archive'),/denied/);assert.equal((await f.state()).state,'archiving');
});
test('invalid roles, paths, old approvals and removed operations fail without advancement',async t=>{
 const f=await fixture(t);await assert.rejects(f.call('commit'),/Unknown action/);await assert.rejects(f.call('closure'),/Unknown action/);
 await assert.rejects(f.call('transition',{to:'reviewing'}),/Transition not allowed/);await f.plan();await f.review();await f.call('request_approval');
 await assert.rejects(f.call('approve',{decision:'accept'}),/Explicit user message/);
 await assert.rejects(f.call('approve',{decision:'accept'},'orchestrator',{userMessage:{role:'user',id:'old',sessionID:'s',createdAt:0,text:'yes'}}),/Explicit user message/);
 assert.equal((await f.state()).state,'changes_pending_approval');
});
test('line limits, corrupt state and access failures do not advance workflow',async t=>{
 const f=await fixture(t);await f.put('exploration.md','x\n'.repeat(401));await assert.rejects(f.call('transition',{to:'planning'}),/400/);
 assert.equal((await f.state()).state,'exploring');await f.put('exploration.md','ok');
 const read=fs.readFile.bind(fs);t.mock.method(fs,'readFile',async(p,...args)=>{if(String(p).endsWith('state.json')) throw Object.assign(Error('denied'),{code:'EACCES'});return read(p,...args);});
 await assert.rejects(status(f.root),/denied/);t.mock.restoreAll();await fs.writeFile(path.join(f.dir,'state.json'),'{bad');await assert.rejects(status(f.root),SyntaxError);
});
