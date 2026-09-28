from pathlib import Path
import re
for name in ['index','about','solutions','team','references','contact','blog']:
 p=Path(name+'.html');s=p.read_text(encoding='utf-8')
 s=re.sub(r'(<span class="pse-nav__theme-sun" aria-hidden="true">).*?(</span>)',r'\1&#9728;\2',s)
 s=re.sub(r'(<span class="pse-nav__theme-moon" aria-hidden="true">).*?(</span>)',r'\1&#9790;\2',s)
 p.write_text(s,encoding='utf-8',newline='')
