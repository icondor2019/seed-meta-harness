import test from 'node:test';
import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { authorizePersistence, dispatch } from '../../.opencode/sdd/controller.mjs';
import { fixture } from './helpers.mjs';
const updates=[{id:'K1',content:'Document accepted architecture',files:['knowledge/architecture/system.md']},
 {id:'K2',content:'Update tool usage',files:['knowledge/tools/setup.md']}];
async function proposal(f,candidates=[]) {
 await f.plan();await f.review();await f.acceptImplementation();
 await f.call('prepare_closure',{candidates,reason:'No operational learning',okfUpdates:updates},'archivist');
}
async function approve(f,selected=['K1','K2'],memory=[]) {
 await f.call('request_approval');
 await f.decision('accept','Approve selected OKF and memory proposals',{selected:memory,selectedOkf:selected,reason:'No memory selected',okfReason:'No documentation selected'});
}
async function persist(f,update) {
 const file=path.join(f.root,update.files[0]);
 await fs.mkdir(path.dirname(file),{recursive:true});await fs.writeFile(file,'---\ntype: Reference\n---\nAccepted documentation');
 return {update:update.id,files:update.files,evidence:'Checked sources, YAML, navigation and scope'};
}

test('OKF approval, partial failure, resume and both persistence outcomes gate archival',async t=>{
 const f=await fixture(t);await proposal(f,[{id:'A1',content:'Operational finding'}]);
 await assert.rejects(dispatch(f.root,'knowledge-curator'),/Cannot dispatch/);
 await assert.rejects(authorizePersistence(f.root,'knowledge-curator','okf',updates[0].files[0]),/Approved Knowledge Curator/);
 await approve(f,undefined,['A1']);assert.equal((await f.state()).state,'persisting_knowledge');
 await dispatch(f.root,'knowledge-curator');
 await assert.rejects(dispatch(f.root,'archivist'),/Cannot dispatch/);
 await assert.rejects(f.call('archive'),/Invalid transition/);
 await authorizePersistence(f.root,'knowledge-curator','okf',updates[0].files[0]);
 await assert.rejects(authorizePersistence(f.root,'knowledge-curator','okf','knowledge/unapproved.md'),/approved OKF paths/);
 await assert.rejects(f.call('okf',{okfReceipts:[{update:'K1',files:updates[0].files,evidence:'Not actually written'}]},'knowledge-curator'),/ENOENT/);
 const first=await persist(f,updates[0]);await f.call('okf',{okfReceipts:[first]},'knowledge-curator');
 assert.equal((await f.state()).okf.result,'partial');
 await assert.rejects(authorizePersistence(f.root,'knowledge-curator','okf',updates[0].files[0]),/pending approved/);
 await assert.rejects(f.call('archive'),/Invalid transition/);
 const second=await persist(f,updates[1]);await f.call('okf',{okfReceipts:[first,second]},'knowledge-curator');
 assert.equal((await f.state()).state,'persisting_memory');
 await assert.rejects(f.call('archive'),/Invalid transition/);
 await f.call('memory',{receipts:[{candidate:'A1',observation:'actual-memory-id'}]},'archivist');
 assert.equal((await f.state()).state,'archiving');
 await fs.unlink(path.join(f.root,updates[1].files[0]));
 await assert.rejects(f.call('archive'),/ENOENT/);
 await persist(f,updates[1]);await f.call('archive');
 assert.equal(await fs.readFile(path.join(f.root,'specs/archived/test/okf-update.md'),'utf8'),'arbitrary artifact content');
});

test('explicit empty selections, rejected proposals and foreign receipts do not bypass gates',async t=>{
 const f=await fixture(t);await proposal(f);await f.call('request_approval');
 await assert.rejects(f.decision('accept','Missing OKF selection',{selected:[],selectedOkf:undefined,reason:'None'}),/valid OKF selection/);
 await f.decision('reject','Revise documentation proposal');assert.equal((await f.state()).state,'preparing_closure');
 await f.call('prepare_closure',{candidates:[],reason:'None',okfUpdates:updates},'archivist');await approve(f,['K1']);
 const receipt=await persist(f,updates[1]);
 await assert.rejects(f.call('okf',{okfReceipts:[receipt]},'knowledge-curator'),/Approved OKF update/);
 await assert.rejects(f.call('okf',{okfReceipts:[receipt]},'orchestrator'),/Knowledge Curator required/);
 const approved=await persist(f,updates[0]);await f.call('okf',{okfReceipts:[approved]},'knowledge-curator');
 assert.equal((await f.state()).state,'archiving');
});

test('legacy archive without OKF assessment blocks and can reopen curation without resaving memory',async t=>{
 const f=await fixture(t);await f.plan();await f.review();await f.acceptImplementation();
 const s=await f.state();s.state='archiving';s.memory={result:'persisted',receipts:[{candidate:'old',observation:'saved-id'}]};
 await fs.writeFile(path.join(f.dir,'state.json'),JSON.stringify(s));
 await assert.rejects(f.call('archive'),/OKF receipt/);await f.call('migrate');
 assert.equal((await f.state()).state,'preparing_closure');
 await f.call('prepare_closure',{candidates:[],reason:'Already saved',okfUpdates:[],okfReason:'Inspected accepted change; no documentation impact'},'archivist');
 assert.equal((await f.state()).memory.receipts[0].observation,'saved-id');
 await f.call('archive');
});

test('declining all OKF updates requires a reason and records no-write outcome',async t=>{
 const f=await fixture(t);await proposal(f);await f.call('request_approval');
 await assert.rejects(f.decision('accept','Skip',{selected:[],selectedOkf:[],reason:'No memory',okfReason:undefined}),/empty OKF selection/);
 await approve(f,[]);
 assert.equal((await f.state()).okf.result,'not-needed');
 assert.equal((await f.state()).state,'archiving');
 await assert.rejects(dispatch(f.root,'knowledge-curator'),/Cannot dispatch/);
 await f.call('archive');
});
