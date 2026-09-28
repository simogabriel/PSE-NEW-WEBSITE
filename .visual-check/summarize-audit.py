import json
from pathlib import Path
base=Path('.visual-check')
main=json.loads((base/'main-audit-results.json').read_text(encoding='utf-8'))
updates=json.loads((base/'site-audit.json').read_text(encoding='utf-8'))
main=[r for r in main if r['page'] not in {u['page'] for u in updates}]+updates
(base/'main-audit-results.json').write_text(json.dumps(main,indent=2,ensure_ascii=False),encoding='utf-8')
rows=main+json.loads((base/'detail-audit-results.json').read_text(encoding='utf-8'))
issues=[{k:r[k] for k in ['page','width','overflow','broken','overlaps','errors']} for r in rows if r['overflow'] or r['broken'] or r['overlaps'] or r['errors'] or not r['styles']]
assert not issues,issues
print(len(rows),'page/viewport checks passed across',len({r['page'] for r in rows}),'pages')
print('Main-page DOM readiness:',min(r['domMs'] for r in main),'to',max(r['domMs'] for r in main),'ms (local server, cache disabled)')
