from pathlib import Path
for p in Path('.').rglob('*.html'):
 if any(part.startswith('.') for part in p.parts):continue
 s=p.read_text(encoding='utf-8');t=s.replace('scroll-type.js?v=44','scroll-type.js?v=45')
 if s!=t:p.write_text(t,encoding='utf-8',newline='')
