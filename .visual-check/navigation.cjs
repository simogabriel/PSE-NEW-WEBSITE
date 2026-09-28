const fs=require('fs');
(async()=>{
const tabs=await (await fetch('http://127.0.0.1:9223/json')).json();
const ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);
let id=0;const pending=new Map();ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){pending.get(m.id)?.(m);pending.delete(m.id)}};
const send=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,m=>m.error?reject(m.error):resolve(m.result));ws.send(JSON.stringify({id:n,method,params}))});
await send('Page.enable');

await send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
await send('Page.addScriptToEvaluateOnNewDocument',{source:"window.addEventListener('pagereveal', e => { window.__hadTransition = !!e.viewTransition; });"});
await send('Page.navigate',{url:'http://127.0.0.1:8765/index.html'});
await new Promise(r=>setTimeout(r,4000));
for(const target of ['solutions','team','contact']) {
 await send('Runtime.evaluate',{expression: `document.querySelector('.pse-nav__links a[href$="${target}.html"]').click()`});
 for(const delay of [150,800,2600]) {
 await new Promise(r=>setTimeout(r,delay));
 console.log(target,delay,(await send('Runtime.evaluate',{expression:'JSON.stringify({url:location.pathname,ready:document.documentElement.className,transition:window.__hadTransition,opacity:getComputedStyle(document.body).opacity})',returnByValue:true})).result.value);
 const shot=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync('.visual-check/nav-'+target+'-'+delay+'.png',Buffer.from(shot.data,'base64'));
 }
}
ws.close();
})().catch(e=>{console.error(e);process.exit(1)});
