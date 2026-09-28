from pathlib import Path
from html.parser import HTMLParser
class Check(HTMLParser):
 def __init__(self,p):super().__init__();self.p=p
 def handle_starttag(self,t,a):
  a=dict(a)
  if t=='link' and a.get('rel')=='stylesheet' and 'pse-custom/styles/' in a.get('href',''):
   assert (self.p.parent/a['href']).is_file(),(self.p,a)
count=0
for p in Path('.').rglob('*.html'):
 if any(x.startswith('.') for x in p.parts):continue
 Check(p).feed(p.read_text(encoding='utf-8'));count+=1
print('Extracted stylesheet references checked on',count,'HTML files')
