from pathlib import Path
p=Path('.visual-check/navigation-loading.cjs')
s=p.read_text(encoding='utf-8')
s=s.replace('await new Promise(r=>setTimeout(r,900));const r=', '''for(let attempt=0;attempt<50;attempt++){await new Promise(r=>setTimeout(r,100));const state=await send('Runtime.evaluate',{expression:'!!document.querySelector(".pse-nav") && [...document.querySelectorAll("link[rel=stylesheet]")].every(e=>!!e.sheet) && performance.getEntriesByType("navigation")[0].domContentLoadedEventEnd>0',returnByValue:true});if(state.result?.value)break;}const r=''')
p.write_text(s,encoding='utf-8')
