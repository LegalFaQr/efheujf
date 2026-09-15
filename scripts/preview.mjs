import http from 'node:http';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
export async function startPreview(port=4173){
const {default:worker}=await import(pathToFileURL(resolve('dist/server/index.js')));
const server=http.createServer(async(req,res)=>{try{const result=await worker.fetch(new Request(`http://127.0.0.1:${port}${req.url}`,{method:req.method,headers:req.headers}),{});res.writeHead(result.status,Object.fromEntries(result.headers));res.end(Buffer.from(await result.arrayBuffer()));}catch{res.writeHead(500);res.end('Preview request failed');}});
await new Promise(r=>server.listen(port,'127.0.0.1',r));return server;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){await startPreview();console.log('Built Worker preview: http://127.0.0.1:4173');}
