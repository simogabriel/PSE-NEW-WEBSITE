from html.parser import HTMLParser
from pathlib import Path
class P(HTMLParser):
 def handle_starttag(self,t,a):
  d=dict(a)
  if t=='body':print('BODY')
  if t=='script' and d.get('src'):print('SCRIPT',d)
for f in ['index.html','about.html','team.html','contact.html','references.html']:
 print(f);P().feed(Path(f).read_text(encoding='utf-8'))
