const fs=require('fs');
(async()=>{
const tabs=await(await fetch('http://127.0.0.1:9223/json')).json();const ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);let id=0;const pending=new Map();const errors=[];ws.onmessage=e=>{let m=JSON.parse(e.data);if(m.id){pending.get(m.id)?.(m);pending.delete(m.id)}if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails)};const send=(method,params={})=>new Promise((resolve,reject)=>{let n=++id;pending.set(n,m=>m.error?reject(m.error):resolve(m.result));ws.send(JSON.stringify({id:n,method,params}))});
await send('Page.enable');await send('Network.enable');await send('Network.setCacheDisabled',{cacheDisabled:true});await send('Runtime.enable');

const results=[];
for(const width of [1440,1000,390]){
await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<500});await send('Page.navigate',{url:'http://127.0.0.1:8765/about.html?restore='+Date.now()});await new Promise(r=>setTimeout(r,3500));
await send('Runtime.evaluate',{expression:`document.querySelectorAll('img').forEach(i=>i.loading='eager')`});await new Promise(r=>setTimeout(r,1500));
const info=await send('Runtime.evaluate',{expression:`JSON.stringify({width:innerWidth,heading:[...document.querySelectorAll('h1')].find(e=>e.getBoundingClientRect().height>0)?.textContent,mission:document.querySelector('.pse-mission-visible-copy')?.textContent,banner:[...document.querySelectorAll('section[data-framer-name="Section Full Image"] img')].filter(i=>i.getBoundingClientRect().width>0).map(i=>({src:i.currentSrc,loaded:!!i.naturalWidth,visibility:getComputedStyle(i).visibility})),broken:[...document.images].filter(i=>!i.naturalWidth).map(i=>i.src),overflow:document.documentElement.scrollWidth>innerWidth})`,returnByValue:true});
const data=JSON.parse(info.result.value);results.push(data);console.log(JSON.stringify(data));
if(!data.heading||data.broken.length||data.overflow||!data.banner.length||data.banner.some(i=>!i.loaded||i.visibility!=='visible'||!i.src.includes('pse-team.jpg')))throw Error('Restored content verification failed');
const shot=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync('.visual-check/about-restored-'+width+'.png',Buffer.from(shot.data,'base64'));
}
fs.writeFileSync('.visual-check/about-restoration-results.json',JSON.stringify({results,errors},null,2));if(errors.length)throw Error(JSON.stringify(errors));await send('Browser.close');
ws.close();
})().catch(e=>{console.error(e);process.exit(1)});
