import { tool, type Plugin } from '@opencode-ai/plugin';
import { run, dispatch, authorizePersistence } from '../sdd/controller.mjs';
import { userDecision } from '../sdd/user-decision.mjs';

export const SddPlugin: Plugin = async (project) => ({
  tool: {
    sdd: tool({
      description: 'Deterministic SDD. After clarifying user intent, start with action=create, input={id:"lowercase-kebab-case",title:"User objective"}. Success returns next.agent=explorer; delegate immediately. A rejected call reports its reason without authorizing work. No PR or clean-tree prerequisite. Record explicit conversational user approval with approve.',
      args: {
        action: tool.schema.enum(['create','status','validate','migrate','handoff','report','concern','answer','transition','replan','correct',
          'request_approval','approve','review','prepare_closure','memory','archive']),
        input: tool.schema.object({
          id: tool.schema.string().describe('create: required lowercase-kebab-case spec ID; concern/answer: concern ID').optional(),
          title: tool.schema.string().describe('create: required user objective').optional(),
          to: tool.schema.enum(['planning','plan_pending_approval','ready_for_review','reviewing']).describe('transition: required destination').optional(),
          files: tool.schema.array(tool.schema.string()).describe('transition to ready_for_review: implementation paths').optional(),
          agent: tool.schema.enum(['explorer','planner','builder','reviewer','archivist']).describe('handoff: assigned specialist').optional(),
          note: tool.schema.string().describe('handoff: complete coordinator invocation, preserved verbatim').optional(),
          decision: tool.schema.enum(['accept','reject']).describe('approve: explicit human decision; runtime supplies actual user message').optional(),
          verdict: tool.schema.enum(['pass','changes-required']).describe('review: Reviewer verdict').optional(),
          candidates: tool.schema.array(tool.schema.object({id:tool.schema.string(),content:tool.schema.string()}).strict()).describe('prepare_closure: recommendations with stable IDs and exact Engram content').optional(),
          selected: tool.schema.array(tool.schema.string()).describe('approve knowledge: exact user-selected candidate IDs, including [] when none').optional(),
          reason: tool.schema.string().describe('No candidates/empty selection: rationale').optional(),
          receipts: tool.schema.array(tool.schema.object({candidate:tool.schema.string(),observation:tool.schema.string()}).strict()).describe('memory: real Engram ID per approved candidate; record each success immediately').optional(),
          result: tool.schema.enum(['completed','blocked','interrupted']).describe('optional concern report: outcome').optional(),
          summary: tool.schema.string().max(500).describe('report: brief specialist summary').optional(),
          concerns: tool.schema.array(tool.schema.object({
            id:tool.schema.string(),question:tool.schema.string(),artifact:tool.schema.string(),
            start:tool.schema.number().int(),end:tool.schema.number().int(),
          })).max(5).describe('report: concerns, each excerpt at most 30 lines').optional(),
          owner: tool.schema.enum(['explorer','planner','builder','reviewer','archivist']).describe('concern/answer: reporting specialist; id identifies the concern').optional(),
          answer: tool.schema.string().describe('answer: brief user response').optional(),
        }).strict().optional(),
      },
      async execute(args,ctx) {
        const context=args.action==='approve'?{userMessage:await userDecision(project.client,ctx)}:{};
        return JSON.stringify(await run(ctx.worktree,args.action,args.input??{},ctx.agent,context));
      },
    }),
  },
  'tool.execute.before': async (input,output) => {
    const persistence=/engram.*(?:mem_save|mem_update|mem_delete)/i.test(input.tool);
    if(persistence||['edit','write','apply_patch'].includes(input.tool)) {
      const response=await project.client.session.messages({path:{id:input.sessionID},query:{limit:1}});
      if(response.error||!response.data?.length) throw Error('Cannot identify writer');
      const info=response.data.at(-1).info;const actor=info.agent??info.mode;
      if(persistence) {
        if(!/mem_save$/i.test(input.tool)) throw Error('SDD persists approved candidates with mem_save only');
        await authorizePersistence(project.worktree,actor,'engram',output.args.content);
      }
      else if(actor==='archivist') {
        if(input.tool==='apply_patch') throw Error('Archivist uses write/edit with explicit approved paths');
        await authorizePersistence(project.worktree,actor,'documentation',output.args.filePath??'');
      }
    }
    if(input.tool==='task') {
      const agent=output.args.subagent_type;
      if(['explorer','planner','builder','reviewer','archivist','maintainer'].includes(agent)) {
        try {await dispatch(project.worktree,agent);}
        catch(e) {if(agent==='maintainer'&&e.message==='No active spec') return;throw e;}
      }
    }
    if(input.tool==='read') {
      const target=String(output.args.filePath??'').replaceAll('\\','/');
      if(/(?:^|\/)specs\/(?:open|archived)(?:\/|$)/i.test(target)) {
        const response=await project.client.session.messages({path:{id:input.sessionID},query:{limit:1}});
        if(response.error||!response.data?.length) throw Error('Cannot identify artifact reader');
        const info=response.data.at(-1).info;
        if((info.agent??info.mode)==='orchestrator') throw Error('Orchestrator cannot read artifacts. Use specialist reports; concern permits only an explicitly requested excerpt.');
      }
    }
    if(input.tool==='bash'&&/git\s+(?:push|merge)/i.test(output.args.command??'')) throw Error('Remote integration is not an SDD operation');
  },
});
