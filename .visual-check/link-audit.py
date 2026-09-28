import json
from pathlib import Path
from urllib.parse import urlparse,unquote
rows=json.loads(Path('.visual-check/main-audit-results.json').read_text(encoding='utf-8'))
links=set(u for r in rows for u in r['links']);missing=[]
for u in links:
 path=unquote(urlparse(u).path).lstrip('/')
 if not Path(path or 'index.html').exists():missing.append(path)
print('Visible local link targets:',len(links),'Missing:',missing)
