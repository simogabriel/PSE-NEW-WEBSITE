const fs=require('fs');
(async()=>{
const tabs=await(await fetch('http://127.0.0.1:9223/json')).json();const ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);let id=0;const pending=new Map();const errors=[];ws.onmessage=e=>{let m=JSON.parse(e.data);if(m.id){pending.get(m.id)?.(m);pending.delete(m.id)}if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails)};const send=(method,params={})=>new Promise((resolve,reject)=>{let n=++id;pending.set(n,m=>m.error?reject(m.error):resolve(m.result));ws.send(JSON.stringify({id:n,method,params}))});
await send('Page.enable');await send('Network.enable');await send('Network.setCacheDisabled',{cacheDisabled:true});await send('Runtime.enable');

for(const width of [1440,390]){
await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<500});
for(const page of ['index','team']){
await send('Page.navigate',{url:'http://127.0.0.1:8765/'+page+'.html?check='+Date.now()});await new Promise(r=>setTimeout(r,2300));
const result=await send('Runtime.evaluate',{expression:page==='team'?`getComputedStyle(document.querySelector('#team-intro'),'::before').backgroundImage`:`getComputedStyle(document.querySelector('#image [data-framer-name="Image Wrapper"]')).backgroundImage`,returnByValue:true});
if(!result.result.value?.includes('/pse-custom/pse-team.jpg?v=2'))throw Error(page+' background mismatch: '+JSON.stringify(result));
const loaded=await send('Runtime.evaluate',{expression:`(async()=>{let i=new Image();i.src='pse-custom/pse-team.jpg?v=2';await i.decode();return i.naturalWidth>0})()`,awaitPromise:true,returnByValue:true});if(!loaded.result.value)throw Error('Background image failed to decode');
console.log(width,page,'PASS: shared background loads');
if(page==='team'){const shot=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync('.visual-check/team-home-background-'+width+'.png',Buffer.from(shot.data,'base64'));}
}
}
if(errors.length)throw Error(JSON.stringify(errors));await send('Browser.close');
ws.close();
})().catch(e=>{console.error(e);process.exit(1)});
