from pathlib import Path
import re
files=['index.html','team.html','solutions.html','about.html']
for name in files:
 p=Path(name); text=p.read_text(encoding='utf-8'); counts=[0]
 def section(m):
  block=m.group(0); opening=block[:block.index('>')+1]; asset=None
  if any('id="'+key+'"' in opening for key in ['image','team-intro','team-intro-1','our-mission']): asset='pse-custom/pse-team.jpg'
  if 'id="solve-smarter"' in opening: asset='pse-custom/solutions-hero.jpg'
  if 'data-framer-name="Section Full Image"' in opening: asset='pse-custom/pse-team.jpg'
  if not asset:return block
  def img(m):
   tag=m.group(0)
   # These sections contain the team/background photograph only.
   tag=re.sub(r'\s+(?:srcset|data-framer-original-sizes)="[^"]*"','',tag)
   tag=re.sub(r'\bsrc="[^"]*"','src="'+asset+'"',tag)
   counts[0]+=1
   return tag
  return re.sub(r'<img\b[^>]*>',img,block)
 text=re.sub(r'<section\b[^>]*>.*?</section>',section,text,flags=re.S)
 text=re.sub(r'(pse-custom/swap-images\.js)\?v=\d+',r'\1?v=42',text)
 text=re.sub(r'(pse-custom/about-images\.js)\?v=\d+',r'\1?v=23',text)
 text=re.sub(r'local-images\.js(?:\?v=\d+)?','local-images.js?v=2',text)
 p.write_text(text,encoding='utf-8',newline='')
 print(name,counts[0],'static PSE images')
