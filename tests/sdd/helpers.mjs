import { promises as fs } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { run } from '../../.opencode/sdd/controller.mjs';
let id=0;
export const git=(root,...args)=>execFileSync('git',args,{cwd:root,encoding:'utf8'}).trim();
export async function fixture(t) {
  const root=await fs.mkdtemp(path.join(os.tmpdir(),'mhsdd-'));
  t.after(()=>{
    assert.equal(path.dirname(path.resolve(root)),path.resolve(os.tmpdir()));
    assert.ok(path.basename(root).startsWith('mhsdd-'));
    return fs.rm(root,{recursive:true,force:true});
  });
  git(root,'init','-b','codex/test');git(root,'config','user.email','test@example.invalid');git(root,'config','user.name','Test');
  await fs.writeFile(path.join(root,'base.txt'),'base');git(root,'add','.');git(root,'commit','-m','initial');
  const call=(action,args={},actor='orchestrator',context={})=>run(root,action,
    action==='prepare_closure'?{okfUpdates:[],okfReason:'Fixture has no documentation changes',...args}:args,actor,context);
  await call('create',{id:'test',title:'Test workflow'});
  const dir=path.join(root,'specs/open/test');
  const put=(file,text='arbitrary artifact content')=>fs.writeFile(path.join(dir,file),text);
  const state=async()=>JSON.parse(await fs.readFile(path.join(dir,'state.json'),'utf8'));
  async function decision(value='accept',text='Sí, apruebo',extra={}) {
    return call('approve',{decision:value,selectedOkf:[],...extra},'orchestrator',{userMessage:{role:'user',id:`user-${++id}`,sessionID:'session',createdAt:Date.now(),text}});
  }
  async function plan() {
    await put('exploration.md');await call('transition',{to:'planning'});
    for(const file of ['proposal.md','design.md','tasks.md']) await put(file);
    await call('transition',{to:'plan_pending_approval'});await call('request_approval');await decision();
  }
  async function review(files=['new.txt']) {
    if(files.includes('new.txt')) await fs.writeFile(path.join(root,'new.txt'),'new');
    await put('implementation.md');await put('review.md');await put('memory.md');await put('okf-update.md');
    await call('transition',{to:'ready_for_review',files});await call('transition',{to:'reviewing'});
    await call('review',{verdict:'pass'},'reviewer');
  }
  async function acceptImplementation() {await call('request_approval');await decision();}
  async function noKnowledge() {
    return call('prepare_closure',{candidates:[],reason:'No reusable learning'},'archivist');
  }
  return {root,dir,call,put,state,decision,plan,review,acceptImplementation,noKnowledge};
}
