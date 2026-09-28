const fs=require('fs');
(async()=>{
 const tabs=await(await fetch('http://127.0.0.1:9223/json')).json();
 const ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);
 await new Promise(r=>ws.onopen=r);
 let id=0;const pending=new Map();let errors=[];
 ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){pending.get(m.id)?.(m);pending.delete(m.id)}if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text+': '+(m.params.exceptionDetails.exception?.description||''));};
 const send=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,m=>m.error?reject(m.error):resolve(m.result));ws.send(JSON.stringify({id:n,method,params}))});
 const evaluate=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true});if(r.exceptionDetails)throw Error(JSON.stringify(r.exceptionDetails));return r.result.value;};
 await send('Page.enable');await send('Runtime.enable');
 const pages=[...fs.readdirSync('.').filter(p=>p.endsWith('.html')),...['team','blog'].flatMap(d=>fs.readdirSync(d).filter(p=>p.endsWith('.html')).map(p=>d+'/'+p))];
 const results=[];
 for(const page of pages){
 errors=[];await send('Page.navigate',{url:'http://127.0.0.1:8765/'+page});
 await new Promise(r=>setTimeout(r,1800));
 const state=await evaluate(`JSON.stringify({url:location.pathname,ready:document.readyState,visible:getComputedStyle(document.body).opacity,pointer:getComputedStyle(document.body).pointerEvents,nav:document.querySelectorAll('.pse-nav').length,guard:document.querySelectorAll('script[src*="site-stability.js"]').length,transition:[...document.querySelectorAll('style')].some(s=>s.textContent.includes('pse-hold-page'))})`);
 results.push({page,...JSON.parse(state),errors:[...errors]});
 console.log(JSON.stringify(results.at(-1)));
 if(['index.html','contact.html'].includes(page)){const shot=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync('.visual-check/stability-'+page+'.png',Buffer.from(shot.data,'base64'));}
 if(page==='contact.html')console.log('FORM',await evaluate(`JSON.stringify([...document.forms].map(f=>({opacity:getComputedStyle(f).opacity,note:!!f.querySelector('[data-pse-email-note]')})))`));
 }
 const clicks=await evaluate(`JSON.stringify((()=>{let rows=[];for(const attrs of [{href:'about.html'},{href:'about.html',target:'_blank'},{href:'about.html',download:'file.html'},{href:'../team/jane-smith.html'}]){let a=document.createElement('a');Object.entries(attrs).forEach(([k,v])=>a.setAttribute(k,v));document.body.append(a);let reached=false;a.addEventListener('click',()=>{reached=true});let e=new MouseEvent('click',{bubbles:true,cancelable:true,ctrlKey:true});a.dispatchEvent(e);rows.push({attrs,canceled:e.defaultPrevented,reached});a.remove()}return rows})())`);
 console.log('LINK SEMANTICS',clicks);
 fs.writeFileSync('.visual-check/stability-results.json',JSON.stringify({results,clicks:JSON.parse(clicks)},null,2));
 await send('Page.navigate',{url:'http://127.0.0.1:8765/index.html'});await new Promise(r=>setTimeout(r,1500));
 await evaluate(`document.querySelector('.pse-nav__links a[href$="about.html"]').click()`);await new Promise(r=>setTimeout(r,1500));
 if(await evaluate('location.pathname')!=='/about.html')throw Error('Navigation failed');
 const history=await send('Page.getNavigationHistory');await send('Page.navigateToHistoryEntry',{entryId:history.entries[history.currentIndex-1].id});await new Promise(r=>setTimeout(r,1000));
 console.log('BACK',await evaluate('location.pathname'));
 await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
 await evaluate(`document.querySelector('.pse-nav__burger').click()`);
 console.log('MOBILE MENU',await evaluate(`document.querySelector('.pse-nav__burger').getAttribute('aria-expanded')`));
 await send('Browser.close');
})().catch(e=>{console.error(e);process.exit(1)});
