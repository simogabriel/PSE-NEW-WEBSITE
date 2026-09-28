from pathlib import Path
import re
versions={'antigravity.js':46,'solutions-technology-hero.css':40,'contact-technology-hero.css':40,'references-page.css':21,'blog-newsroom-technology-hero.css':40}
for p in Path('.').rglob('*.html'):
 if any(x.startswith('.') for x in p.parts):continue
 s=p.read_text(encoding='utf-8');old=s
 for f,v in versions.items():s=re.sub(re.escape(f)+r'\?v=\d+',f+'?v='+str(v),s)
 if s!=old:p.write_text(s,encoding='utf-8',newline='')
