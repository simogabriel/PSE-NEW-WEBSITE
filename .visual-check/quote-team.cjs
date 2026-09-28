const fs=require('fs');
(async()=>{
const tabs=await(await fetch('http://127.0.0.1:9223/json')).json();const ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);let id=0;const pending=new Map();ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){pending.get(m.id)(m.result);pending.delete(m.id)}};const send=(method,params={})=>new Promise(r=>{pending.set(++id,r);ws.send(JSON.stringify({id,method,params}))});
await send('Page.enable');
for(const width of [1440,1000,390]){
await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width<500});await send('Page.navigate',{url:'http://127.0.0.1:8765/team.html'});await new Promise(r=>setTimeout(r,3000));
const result=await send('Runtime.evaluate',{expression:`(async()=>{const s=[...document.querySelectorAll('#team-intro-1')].find(e=>e.getBoundingClientRect().width>0);s.scrollIntoView();const p=s.querySelector('[data-framer-name="Image Wrapper"]');const t=s.querySelector('[data-framer-name="Quote Wrap"]');const b=p.getBoundingClientRect(),a=t.getBoundingClientRect();const url=getComputedStyle(p).backgroundImage;const i=new Image();i.src=url.slice(5,-2);await i.decode();return {width:innerWidth,loaded:i.naturalWidth>0,background:url,image:{x:b.x,y:b.y,width:b.width,height:b.height},text:{x:a.x,y:a.y,width:a.width,height:a.height},copy:t.innerText,overflow:document.documentElement.scrollWidth>innerWidth}})()`,awaitPromise:true,returnByValue:true});
const data=result.result.value;console.log(JSON.stringify(data));if(!data?.loaded||data.image.height<100||data.overflow||(width>=810&&data.text.x<data.image.x+data.image.width-1))throw Error('Layout failed');
await new Promise(r=>setTimeout(r,300));const shot=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync('.visual-check/quote-team-'+width+'.png',Buffer.from(shot.data,'base64'));
}
await send('Browser.close');ws.close();
})().catch(e=>{console.error(e);process.exit(1)});
