const fs=require('fs');
(async()=>{
const tabs=await(await fetch('http://127.0.0.1:9223/json')).json();const ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);let id=0;const pending=new Map();const errors=[];ws.onmessage=e=>{let m=JSON.parse(e.data);if(m.id){pending.get(m.id)?.(m);pending.delete(m.id)}if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails)};const send=(method,params={})=>new Promise((resolve,reject)=>{let n=++id;pending.set(n,m=>m.error?reject(m.error):resolve(m.result));ws.send(JSON.stringify({id:n,method,params}))});
await send('Page.enable');await send('Runtime.enable');
await send('Runtime.evaluate',{expression:`[...document.querySelectorAll('section[data-framer-name="Section Our Values"]')].find(e=>e.getBoundingClientRect().height>0).scrollIntoView()`});await new Promise(r=>setTimeout(r,500));const shot=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync('.visual-check/about-values-visible.png',Buffer.from(shot.data,'base64'));ws.close();
})().catch(e=>{console.error(e);process.exit(1)});
