from html.parser import HTMLParser
from pathlib import Path
import re
class Slots(HTMLParser):
 def __init__(self,text,page):
  super().__init__(convert_charrefs=False);self.text=text;self.page=page;self.stack=[];self.ranges=[];self.lines=[0]
  for m in re.finditer('\n',text):self.lines.append(m.end())
  self.feed(text)
 def pos(self):
  line,col=self.getpos();return self.lines[line-1]+col
 def handle_starttag(self,tag,attrs):
  a=dict(attrs);active=any(x[1] for x in self.stack) or a.get('data-framer-name')==('Section Our Team' if self.page=='team' else 'Section Our Values')
  target=active and a.get('data-framer-name')==('Team Content' if self.page=='team' else 'Content Wrap')
  if tag not in ['img','br','hr','meta','link','input','source','wbr','area','base','embed','param','track','col']:
   self.stack.append((tag,active,target,self.pos()+len(self.get_starttag_text())))
 def handle_endtag(self,tag):
  for i in range(len(self.stack)-1,-1,-1):
   if self.stack[i][0]==tag:
    item=self.stack[i];self.stack=self.stack[:i]
    if item[2]:self.ranges.append((item[3],self.pos()))
    break
for page in ['team','about']:
 p=Path(page+'.html');s=p.read_text(encoding='utf-8');parser=Slots(s,page)
 assert len(parser.ranges)==3,(page,parser.ranges)
 content=Path('.visual-check/'+page+'-static-content.html').read_text(encoding='utf-8').replace('http://127.0.0.1:8765/','')
 for start,end in sorted(parser.ranges,reverse=True):s=s[:start]+content+s[end:]
 s=s.replace('team-grid.js?v=51','team-grid.js?v=52').replace('parchemins.js?v=46','parchemins.js?v=47')
 p.write_text(s,encoding='utf-8',newline='');print(page,'embedded PSE content in',len(parser.ranges),'variants')
