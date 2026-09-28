const fs=require('fs');
(async()=>{
const tabs=await (await fetch('http://127.0.0.1:9223/json')).json();
const ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);
let id=0;const pending=new Map();ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){pending.get(m.id)?.(m);pending.delete(m.id)}};
const send=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,m=>m.error?reject(m.error):resolve(m.result));ws.send(JSON.stringify({id:n,method,params}))});
await send('Page.enable');
for(const width of [390]){
await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<500});
for(const page of ['references']){
await send('Page.navigate',{url:`http://127.0.0.1:8765/${page}.html`});
await new Promise(r=>setTimeout(r,4500));
const info=await send('Runtime.evaluate',{expression:`JSON.stringify({ready:document.documentElement.className,width:innerWidth,scroll:document.documentElement.scrollWidth,broken:[...document.images].filter(i=>!i.naturalWidth&&i.getBoundingClientRect().width>0).map(i=>i.getAttribute('src'))})`,returnByValue:true});
console.log(width,page,info.result.value);console.log((await send('Runtime.evaluate',{expression: `JSON.stringify({css:[...document.querySelectorAll('link[rel=stylesheet]')].map(x=>x.href),media:(()=>{let c=getComputedStyle(document.querySelector('.ref-card__media'));return {flex:c.flex,width:c.width,minWidth:c.minWidth,box:c.boxSizing}})()})`,returnByValue:true})).result.value);console.log((await send('Runtime.evaluate',{expression: `JSON.stringify([...document.querySelectorAll('body *')].filter(e=>{let r=e.getBoundingClientRect();return r.width>0&&r.right>395}).map(e=>({tag:e.tagName,cls:e.className,width:e.getBoundingClientRect().width,right:e.getBoundingClientRect().right})).slice(0,25))`,returnByValue:true})).result.value);
const shot=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(`.visual-check/${page}-${width}.png`,Buffer.from(shot.data,'base64'));
}
}ws.close();
})().catch(e=>{console.error(e);process.exit(1)});

