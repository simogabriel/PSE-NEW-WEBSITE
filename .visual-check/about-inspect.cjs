const fs=require('fs');
(async()=>{
const tabs=await(await fetch('http://127.0.0.1:9223/json')).json();const ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);let id=0;const pending=new Map();const errors=[];ws.onmessage=e=>{let m=JSON.parse(e.data);if(m.id){pending.get(m.id)?.(m);pending.delete(m.id)}if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails)};const send=(method,params={})=>new Promise((resolve,reject)=>{let n=++id;pending.set(n,m=>m.error?reject(m.error):resolve(m.result));ws.send(JSON.stringify({id:n,method,params}))});
await send('Page.enable');await send('Runtime.enable');
const r=await send('Runtime.evaluate',{expression:`JSON.stringify([...document.querySelectorAll('section[data-framer-name="Section About Header"]')].map(n=>{let a=[];while(n){a.push({tag:n.tagName,cls:n.className,display:getComputedStyle(n).display,r:n.getBoundingClientRect().toJSON()});n=n.parentElement}return a}))`,returnByValue:true});console.log(r.result.value);ws.close();
})().catch(e=>{console.error(e);process.exit(1)});
