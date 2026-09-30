import {mkdir,writeFile} from 'node:fs/promises';
const key=process.env.ADMISSIONS_EXPORT_KEY;
if(!key)throw Error('Set ADMISSIONS_EXPORT_KEY in your local environment; never put it in a URL or a committed file.');
const response=await fetch('https://kabira-international-school.kabiraswebsite.workers.dev/api/admissions/export',{headers:{Authorization:`Bearer ${key}`},signal:AbortSignal.timeout(30000)});
if(!response.ok)throw Error(`Export failed (${response.status}). Check your access key and the deployed backend version.`);
await mkdir('.asset-sources',{recursive:true});
await writeFile('.asset-sources/kabira-admissions.xlsx',Buffer.from(await response.arrayBuffer()));console.log('Saved private export to .asset-sources/kabira-admissions.xlsx');
