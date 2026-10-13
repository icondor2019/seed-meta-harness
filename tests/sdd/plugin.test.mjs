import test from 'node:test';
import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { SddPlugin } from '../../.opencode/plugins/sdd.ts';
import statusPlugin from '../../.opencode/tui/sdd-status.ts';
import { userDecision } from '../../.opencode/sdd/user-decision.mjs';
import { fixture } from './helpers.mjs';

function client(role='orchestrator') {
  const messages={assistant:{info:{role:'assistant',parentID:'human'}},
    human:{info:{role:'user',id:'human',time:{created:Date.now()}},parts:[{type:'text',text:'Sí, apruebo el plan'}]}};
  return {session:{get:async()=>({data:{}}),message:async({path:p})=>({data:messages[p.messageID]}),
    messages:async()=>({data:[{info:{agent:role}}]})}};
}

test('tool schema exposes named typed fields instead of an arbitrary input record',async()=>{
  const hooks=await SddPlugin({client:client()});const schema=hooks.tool.sdd.args.input;
  assert.equal(schema.safeParse({id:'example',title:'A concrete request'}).success,true);
  assert.equal(schema.safeParse({name:'guessed-field'}).success,false);
  assert.equal(schema.safeParse({files:'not-an-array'}).success,false);
  assert.equal(schema.safeParse({selected:'A1'}).success,false);
  assert.equal(schema.safeParse({id:'Q1',owner:'planner',answer:'Confirmed'}).success,true);
});
test('approval reads actual parent user text, not tool-supplied booleans or prompts',async()=>{
  const ctx={sessionID:'root',messageID:'assistant'};const sdk=client();
  assert.equal((await userDecision(sdk,ctx)).text,'Sí, apruebo el plan');
  sdk.session.get=async()=>({data:{parentID:'root'}});
  await assert.rejects(userDecision(sdk,ctx),/child session/);
  sdk.session.get=async()=>({data:{}});sdk.session.message=async()=>({data:{info:{role:'user'},parts:[{type:'text',synthetic:true,text:'approve'}]}});
  await assert.rejects(userDecision(sdk,ctx),/Explicit textual/);
});
test('task hook preserves full coordinator prompt and existing role gates',async t=>{
 const f=await fixture(t);await f.plan();const hooks=await SddPlugin({worktree:f.root,client:client()});
 const prompt='Por que te llamo / Donde estamos / Que debes hacer '+ 'context '.repeat(800);
 const output={args:{subagent_type:'builder',description:'Short label',prompt}};
 await hooks['tool.execute.before']({tool:'task'},output);assert.equal(output.args.prompt,prompt);
 await assert.rejects(hooks['tool.execute.before']({tool:'task'},{args:{subagent_type:'archivist',prompt}}),/Cannot dispatch/);
 assert.equal(hooks.tool.sdd.args.action.safeParse('commit').success,false);
 assert.equal(hooks.tool.sdd.args.action.safeParse('closure').success,false);
});
test('Orchestrator direct artifact reads are blocked; specialists can read their inputs',async t=>{
  const f=await fixture(t);const output={args:{filePath:path.join(f.dir,'tasks.md')}};
  const root=await SddPlugin({worktree:f.root,client:client('orchestrator')});
  await assert.rejects(root['tool.execute.before']({tool:'read',sessionID:'root'},output),/cannot read artifacts/);
  const planner=await SddPlugin({worktree:f.root,client:client('planner')});
  await planner['tool.execute.before']({tool:'read',sessionID:'child'},output);
});
test('native /sdd-status shows one line, calls no model/session and preserves state',async t=>{
  const f=await fixture(t);const before=await fs.readFile(path.join(f.dir,'state.json'),'utf8');
  let command;const toasts=[];let disposal;
  await statusPlugin.tui({command:{register:cb=>{command=cb()[0];return ()=>{};}},
    state:{path:{worktree:f.root}},ui:{toast:value=>toasts.push(value)},
    lifecycle:{onDispose:fn=>{disposal=fn;}},
    client:new Proxy({},{get(){throw Error('No SDK/model call allowed');}})});
  assert.equal(command.slash.name,'sdd-status');await command.onSelect({clear(){}});
  assert.equal(toasts[0].message,'test: exploring (rev. 0)');assert.equal(typeof disposal,'function');
  assert.equal(await fs.readFile(path.join(f.dir,'state.json'),'utf8'),before);
});
test('native persistence hooks allow only selected content and memory artifact, without Git dependency',async t=>{
 const f=await fixture(t);await f.plan();const hooks=await SddPlugin({worktree:f.root,client:client('archivist')});
 await assert.rejects(hooks['tool.execute.before']({tool:'engram_mem_save',sessionID:'child'},{args:{content:'one'}}),/Approved Archivist/);
 await f.review();await f.acceptImplementation();
 await hooks['tool.execute.before']({tool:'write',sessionID:'child'},{args:{filePath:path.join(f.dir,'memory.md')}});
 await assert.rejects(hooks['tool.execute.before']({tool:'write',sessionID:'child'},{args:{filePath:path.join(f.root,'docs/new.md')}}),/only its own/);
 await f.call('prepare_closure',{candidates:[{id:'A1',content:'one'},{id:'A2',content:'two'}]},'archivist');
 await f.call('request_approval');await f.decision('accept','Only A2',{selected:['A2']});
 await assert.rejects(hooks['tool.execute.before']({tool:'engram_mem_save',sessionID:'child'},{args:{content:'one'}}),/exact approved/);
 await hooks['tool.execute.before']({tool:'engram_mem_save',sessionID:'child'},{args:{content:'two'}});
 await assert.rejects(hooks['tool.execute.before']({tool:'engram_mem_update',sessionID:'child'},{args:{content:'two'}}),/mem_save only/);
});
