const fs=require('fs');
(async()=>{
const tabs=await(await fetch('http://127.0.0.1:9223/json')).json();const ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);let id=0;const pending=new Map();const errors=[];ws.onmessage=e=>{let m=JSON.parse(e.data);if(m.id){pending.get(m.id)?.(m);pending.delete(m.id)}if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails)};const send=(method,params={})=>new Promise((resolve,reject)=>{let n=++id;pending.set(n,m=>m.error?reject(m.error):resolve(m.result));ws.send(JSON.stringify({id:n,method,params}))});
await send('Page.enable');await send('Network.enable');await send('Network.setCacheDisabled',{cacheDisabled:true});await send('Runtime.enable');

const results=[];
for(const width of [1440,1000,390]){
await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<500});
await send('Page.navigate',{url:'http://127.0.0.1:8765/about.html?audit='+Date.now()});await new Promise(r=>setTimeout(r,3000));
await send('Runtime.evaluate',{expression:`document.querySelectorAll('img').forEach(i=>i.loading='eager')`});
let height=(await send('Runtime.evaluate',{expression:'document.documentElement.scrollHeight',returnByValue:true})).result.value;
for(let y=0;y<height;y+=750){await send('Runtime.evaluate',{expression:`scrollTo(0,${y})`});await new Promise(r=>setTimeout(r,80));}
await new Promise(r=>setTimeout(r,1200));
const report=await send('Runtime.evaluate',{expression:`JSON.stringify((()=>{
const root=[...document.querySelectorAll('[data-layout-template]')].find(e=>e.getBoundingClientRect().width>0);
const responsiveHidden=e=>{for(let n=e;n&&n!==root;n=n.parentElement)if(n.classList.contains('ssr-variant')&&getComputedStyle(n).display==='none')return true;return false;};
const hidden=e=>{for(let n=e;n;n=n.parentElement){const s=getComputedStyle(n);if(s.display==='none'||s.visibility==='hidden'||Number(s.opacity)<.01)return true;}return !e.getBoundingClientRect().height;};
return {width:innerWidth,overflow:document.documentElement.scrollWidth>innerWidth,sections:[...root.querySelectorAll('section[data-framer-name^="Section"]')].filter(e=>!responsiveHidden(e)).map(e=>({name:e.dataset.framerName,height:e.getBoundingClientRect().height})),missingText:[...root.querySelectorAll('h1,h2,h3,h4,h5,h6,p')].filter(e=>e.textContent.trim()&&!responsiveHidden(e)&&hidden(e)).map(e=>({text:e.textContent.trim().slice(0,110),cls:e.className})),broken:[...document.images].filter(i=>!i.naturalWidth).map(i=>i.src),hiddenImages:[...root.querySelectorAll('img')].filter(e=>!responsiveHidden(e)&&hidden(e)).map(i=>({src:i.src,section:i.closest('[data-framer-name^="Section"]')?.dataset.framerName})),images:document.images.length};})())`,returnByValue:true});
const data=JSON.parse(report.result.value);results.push(data);console.log(JSON.stringify(data));
fs.writeFileSync('.visual-check/about-content-audit.json',JSON.stringify({results,errors},null,2));
}
fs.writeFileSync('.visual-check/about-content-audit.json',JSON.stringify({results,errors},null,2));
ws.close();
})().catch(e=>{console.error(e);process.exit(1)});
