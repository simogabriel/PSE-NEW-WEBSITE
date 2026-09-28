from pathlib import Path
import re
for p in Path('.').glob('*.html'):
 s=p.read_text(encoding='utf-8');t=s
 for f,v in [('contact-info.js',31),('references-page.css',20),('translations.js',63)]:
  s=re.sub(re.escape(f)+r'\?v=\d+',f+'?v='+str(v),s)
 if s!=t:p.write_text(s,encoding='utf-8',newline='')
