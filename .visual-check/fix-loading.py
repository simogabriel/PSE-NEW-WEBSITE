from pathlib import Path
import re
for name in ['index','about','solutions','team','contact','references','blog']:
 p=Path(name+'.html');s=p.read_text(encoding='utf-8');end=s.index('</head>');head=s[:end];body=s[end:]
 styles=re.findall(r'<link\b[^>]*rel="stylesheet"[^>]*>',body)
 for tag in styles:body=body.replace(tag,'',1)
 head+='\n'+'\n'.join(styles)+'\n'
 s=head+body
 def defer(m):
  tag=m.group(0)
  if 'site-stability.js' in tag or 'page-ready.js' in tag:return tag
  if ' defer' not in tag and ' async' not in tag:tag=tag.replace('<script','<script defer',1)
  return tag
 s=re.sub(r'<script\b[^>]*\bsrc="[^"]+"[^>]*>',defer,s)
 s=s.replace('site-stability.js?v=4','site-stability.js?v=5')
 p.write_text(s,encoding='utf-8',newline='');print(name,'moved',len(styles),'late stylesheets into head; deferred enhancement scripts')
