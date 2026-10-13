// Orchestrator interprets free-form approval. The adapter supplies the actual
// parent user message; tool input cannot fabricate the source.
export async function userDecision(client,ctx) {
  const session=await client.session.get({path:{id:ctx.sessionID}});
  if(session.error||!session.data||session.data.parentID) throw Error('Approval requires the user conversation, not a child session');
  let response=await client.session.message({path:{id:ctx.sessionID,messageID:ctx.messageID}});
  if(response.error||!response.data) throw Error('Cannot read current conversation message');
  if(response.data.info.role==='assistant') {
    response=await client.session.message({path:{id:ctx.sessionID,messageID:response.data.info.parentID}});
  }
  if(response.error||response.data?.info.role!=='user') throw Error('User message required');
  const {info,parts}=response.data;
  const text=parts.filter(p=>p.type==='text'&&!p.synthetic&&!p.ignored).map(p=>p.text).join('\n');
  if(!text.trim()) throw Error('Explicit textual user decision required');
  return {role:'user',id:info.id,sessionID:ctx.sessionID,createdAt:info.time.created,text};
}
