from pathlib import Path
import re
links=[('index','Accueil','Home'),('about','À propos','About'),('solutions','Solutions','Solutions'),('team','Équipe','Team'),('references','Références','References'),('contact','Contact','Contact')]
for name in ['index','about','solutions','team','references','contact','blog']:
 p=Path(name+'.html');s=p.read_text(encoding='utf-8')
 nav='<header class="pse-nav" data-pse-static-nav="true"><a class="pse-nav__brand" href="index.html" aria-label="PSE Consulting"><img src="pse-custom/pse-logo.png" alt="PSE Consulting"></a><button class="pse-nav__burger" type="button" aria-label="Menu" aria-expanded="false"><span></span></button><ul class="pse-nav__links">'
 for page,fr,en in links:
  active=' class="is-active"' if name==page else ''
  nav+=f'<li><a{active} href="{page}.html" data-fr="{fr}" data-en="{en}">{fr}</a></li>'
 nav+='</ul><div class="pse-nav__right"><button class="pse-nav__theme" type="button" data-pse-theme-toggle aria-label="Toggle colour theme"><span class="pse-nav__theme-sun" aria-hidden="true">?</span><span class="pse-nav__theme-moon" aria-hidden="true">?</span></button><div class="pse-nav__lang" role="group" aria-label="Langue / Language"><button type="button" data-pse-lang="fr" class="is-active" aria-pressed="true">FR</button><button type="button" data-pse-lang="en" aria-pressed="false">EN</button></div></div></header>'
 if 'data-pse-static-nav' not in s:s=re.sub(r'(<body\b[^>]*>)',lambda m:m.group(1)+nav,s,count=1)
 s=re.sub(r'nav\.js\?v=\d+','nav.js?v=54',s)
 s=re.sub(r'page-ready\.js\?v=\d+','page-ready.js?v=7',s)
 s=re.sub(r'enhance\.css\?v=\d+','enhance.css?v=99',s)
 p.write_text(s,encoding='utf-8',newline='')
 print(name,'static navigation saved')
