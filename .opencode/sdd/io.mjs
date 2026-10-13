import { promises as fs } from 'node:fs';
import path from 'node:path';
import { execFile } from 'node:child_process';
export async function exists(p) {
  try { return (await fs.stat(p)).isFile(); } catch(e) { if(e.code === 'ENOENT') return false; throw e; }
}
export async function lock(root, fn) {
  const p = path.join(root, '.sdd.lock');
  const h = await fs.open(p, 'wx');
  try { return await fn(); } finally { await h.close(); await fs.unlink(p); }
}
export async function write(p, value) {
  const tmp = `${p}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(value, null, 2) + '\n');
  await fs.rename(tmp, p);
}
export function git(root, args) {
  if (!['rev-parse'].includes(args[0])) throw Error('Forbidden Git operation');
  return new Promise((resolve,reject) => execFile('git',args,{cwd:root,maxBuffer:10*1024*1024},(e,out,err)=>e?reject(Error(err || e.message)):resolve(out.trim())));
}
export function safePath(root, relative) {
  if (typeof relative!=='string' || !relative || /[:\0]/.test(relative) || relative==='.sdd.lock' || path.isAbsolute(relative) || relative.includes('\\') || relative.split('/').some(s=>s==='..'||s==='.'||s.toLowerCase()==='.git'||!s) || relative.toLowerCase().startsWith('specs/')) throw Error('Unsafe implementation path');
  const p = path.resolve(root, relative);
  if (!p.startsWith(path.resolve(root)+path.sep)) throw Error('Path escapes project');
  return p;
}
export async function renameWithRetry(src,dest) {
  for(let i=0;;i++) { try { await fs.rename(src,dest); return; } catch(e) { if(i===4 || !['EPERM','EACCES','EBUSY'].includes(e.code)) throw e; await new Promise(r=>setTimeout(r,100)); } }
}
export async function lineCheck(root) {
  async function walk(dir) {
    for(const ent of await fs.readdir(dir,{withFileTypes:true})) {
      if(['.git','node_modules','.opencode_test','.codegraph'].includes(ent.name)) continue;
      const p=path.join(dir,ent.name);
      if(ent.isSymbolicLink()) continue;
      if(ent.isDirectory()) await walk(p);
      else if(ent.name.endsWith('.md')) {
        const text=await fs.readFile(p,'utf8');
        const lines=text.replace(/\r\n/g,'\n').split('\n');
        if(lines.at(-1)==='') lines.pop();
        if(lines.length>400) throw Error(`Markdown exceeds 400 lines: ${p}`);
      }
    }
  }
  await walk(root);
}
