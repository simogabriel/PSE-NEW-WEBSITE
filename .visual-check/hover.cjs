const fs=require('fs');
(async()=>{
const tabs=await(await fetch('http://127.0.0.1:9223/json')).json();const ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);
let id=0;const pending=new Map();let errors=[];
ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){pending.get(m.id)?.(m);pending.delete(m.id)}if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text)};
const send=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,m=>m.error?reject(m.error):resolve(m.result));ws.send(JSON.stringify({id:n,method,params}))});
const evaluate=async expression=>(await send('Runtime.evaluate',{expression,returnByValue:true})).result.value;
await send('Page.enable');await send('Runtime.enable');await send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
const results=[];
for(const page of ['index.html','about.html','solutions.html','team.html','references.html','contact.html','blog.html','team/jane-smith.html']){
await send('Page.navigate',{url:'http://127.0.0.1:8765/'+page});await new Promise(r=>setTimeout(r,2700));
await evaluate(`window.hoverMutations=0;window.hoverObserver=new MutationObserver(m=>window.hoverMutations+=m.length);window.hoverObserver.observe(document.head,{childList:true});window.hoverBefore=[...document.querySelectorAll('link[rel="stylesheet"]')];`);
const points=JSON.parse(await evaluate(`JSON.stringify([...document.querySelectorAll('.pse-nav__links a')].map(a=>{let r=a.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}}))`));
for(const point of points){await send('Input.dispatchMouseEvent',{type:'mouseMoved',...point});await new Promise(r=>setTimeout(r,90));}
const result=JSON.parse(await evaluate(`JSON.stringify({mutations:window.hoverMutations,prefetch:document.querySelectorAll('link[rel="prefetch"]').length,stable:window.hoverBefore.every((l,i)=>document.querySelectorAll('link[rel="stylesheet"]')[i]===l),url:location.pathname})`));
results.push({page,...result});if(result.mutations||result.prefetch||!result.stable||result.url!=='/'+page)throw Error(JSON.stringify(result));console.log(page,'PASS');
}
await evaluate(`document.querySelector('.pse-nav__links a[href$="contact.html"]').click()`);await new Promise(r=>setTimeout(r,1500));if(await evaluate('location.pathname')!=='/contact.html')throw Error('Click navigation failed');
if(errors.length)throw Error(errors.join('\n'));
fs.writeFileSync('.visual-check/hover-results.json',JSON.stringify({results,errors,click:'passed'},null,2));console.log('No hover head mutations, no prefetch, stable stylesheet order; click navigation passed.');await send('Browser.close');
})().catch(e=>{console.error(e);process.exit(1)});
