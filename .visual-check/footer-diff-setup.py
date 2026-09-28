from pathlib import Path
p=Path('.visual-check/footer-match.cjs');s=p.read_text(encoding='utf-8');s=s.replace('[1440,1000,390]','[1440]')
a=s.index('expression:`(()=>{window.scrollTo');b=s.index('`,returnByValue:true',a)
s=s[:a]+'''expression:`(()=>{const f=[...document.querySelectorAll('footer')].find(e=>e.getBoundingClientRect().width>0);return {nodes:[f,...f.querySelectorAll('div,p,h2,a')].map(e=>{const s=getComputedStyle(e);return {cls:e.className,tag:e.tagName,display:s.display,whiteSpace:s.whiteSpace,margin:s.margin,padding:s.padding,font:s.font,line:s.lineHeight,width:s.width,height:s.height,box:s.boxSizing}})}})()'''+s[b:]
s=s.replace("'.visual-check/footer-match.json'","'.visual-check/footer-style-diff.json'")
Path('.visual-check/footer-style-diff.cjs').write_text(s,encoding='utf-8')
