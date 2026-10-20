// Fresh installs only. Existing installations must apply only pending migrations.
import {readFile,mkdir,writeFile} from 'node:fs/promises';
const files=['20261020_loyalty.sql','20261020_loyalty_management.sql'];
const sections=await Promise.all(files.map(async name=>{
 const sql=await readFile(new URL(`../supabase/migrations/${name}`,import.meta.url),'utf8');
 if(!/^begin;\s/i.test(sql)||!/[\s]commit;\s*$/i.test(sql))throw new Error(`Unexpected transaction boundaries in ${name}`);
 return `-- ${name}\n${sql.replace(/^begin;\s*/i,'').replace(/\s*commit;\s*$/i,'')}`;
}));
await mkdir(new URL('../tmp/loyalty/',import.meta.url),{recursive:true});
const target=new URL('../tmp/loyalty/dokunuver-sadakat-ilk-kurulum.sql',import.meta.url);
await writeFile(target,'-- Yalnız sıfırdan kurulum içindir. Uygulanmış migration dosyalarını tekrar çalıştırmayın.\nbegin;\n'+sections.join('\n\n')+'\ncommit;\n');
console.log(target.pathname);
