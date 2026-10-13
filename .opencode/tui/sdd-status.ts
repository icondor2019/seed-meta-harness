import type { TuiPlugin } from '@opencode-ai/plugin/tui';
import { status, statusLine } from '../sdd/controller.mjs';

const tui: TuiPlugin = async (api) => {
  // Native UI callback: no command template, prompt, model, or session turn.
  if(!api.command) throw new Error('This OpenCode version lacks native TUI command registration');
  const dispose=api.command.register(()=>[{
    title:'SDD status',value:'sdd.status',description:'Show persisted SDD state',
    slash:{name:'sdd-status'},
    async onSelect(dialog) {
      dialog?.clear();
      try {api.ui.toast({message:statusLine(await status(api.state.path.worktree)),variant:'info',duration:8000});}
      catch(e) {api.ui.toast({message:`SDD: ${e.message}`,variant:'error',duration:8000});}
    },
  }]);
  api.lifecycle.onDispose(dispose);
};
export default {id:'seed.sdd-status',tui};
