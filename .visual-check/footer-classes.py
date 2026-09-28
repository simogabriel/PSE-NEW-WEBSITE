from pathlib import Path
from html.parser import HTMLParser
import re
s=re.search(r'<footer\b.*?</footer>',Path('team.html').read_text(encoding='utf-8'),re.S).group()
class P(HTMLParser):
 def handle_starttag(self,t,a):
  d=dict(a)
  if t in ['a','svg','use','div','h2']: print(t,d.get('class',''),d.get('href',''),d.get('data-framer-name',''))
P().feed(s)
