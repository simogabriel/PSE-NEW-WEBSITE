from pathlib import Path
import re,hashlib,posixpath,json
root=Path('.');assetdir=root/'pse-custom'/'styles';assetdir.mkdir(exist_ok=True)
images=['solutions-technology-hero-v2','contact-technology-hero','references-tablet-tech-hero-v2','blog-newsroom-technology-hero']
files=[p for p in root.rglob('*') if p.is_file() and p.suffix in ['.html','.css','.js'] and not any(x.startswith('.') for x in p.parts)]
results=[]
for p in files:
 s=p.read_text(encoding='utf-8');old=s
 for name in images:s=s.replace(name+'.png',name+'.webp')
 if p.suffix=='.html':
  parent=p.parent.as_posix()
  def style(m):
   css=m.group(1)
   if len(css)<1000:return m.group(0)
   def url(u):
    val=u.group(1).strip();quote=val[0] if val[:1] in ['"',"'"] else '';v=val[1:-1] if quote else val
    if re.match(r'(?:[a-zA-Z][\w+.-]*:|/|#)',v):return u.group(0)
    resolved=posixpath.normpath(posixpath.join(parent,v))
    v=posixpath.relpath(resolved,'pse-custom/styles')
    return 'url('+quote+v+quote+')'
   css=re.sub(r'url\(([^)]*)\)',url,css)
   # Remove formatting whitespace between CSS rules, preserving values and strings.
   css=re.sub(r'\}\s+','}',css)
   name='template-'+hashlib.sha256(css.encode()).hexdigest()[:12]+'.css'
   (assetdir/name).write_text(css,encoding='utf-8',newline='')
   href=posixpath.relpath('pse-custom/styles/'+name,parent)
   return '<link rel="stylesheet" href="'+href+'">'
  s=re.sub(r'<style\b(?![^>]*\bid=)[^>]*>\s*([\s\S]*?)</style>',style,s)
  if s!=old:results.append({'file':str(p),'before':len(old.encode()),'after':len(s.encode())})
 if s!=old:p.write_text(s,encoding='utf-8',newline='')
Path('.visual-check/html-optimization.json').write_text(json.dumps(results,indent=2),encoding='utf-8')
print('HTML optimized:',len(results),'pages; HTML bytes before:',sum(r['before'] for r in results),'after:',sum(r['after'] for r in results))
print('Reusable CSS files:',len(list(assetdir.glob('*.css'))))
