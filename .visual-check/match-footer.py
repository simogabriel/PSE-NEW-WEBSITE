from pathlib import Path
import re
team=Path('team.html').read_text(encoding='utf-8')
footers=re.findall(r'<footer\b.*?</footer>',team,re.S)
assert len(footers)==3
markup='<div id="pse-reference-footer">'+''.join('<div class="pse-footer-variant pse-footer-variant--'+name+'">'+footer+'</div>' for name,footer in zip(['desktop','tablet','mobile'],footers))+'</div>'
p=Path('references.html');s=p.read_text(encoding='utf-8')
s=re.sub(r'<footer\b.*?</footer>',lambda m:markup,s,count=1,flags=re.S)
s=s.replace('//direct link with the footer from the javascript','')
s=s.replace('</head>','<link rel="stylesheet" href="pse-custom/references-team-footer.css?v=1">\n</head>')
p.write_text(s,encoding='utf-8',newline='')
f=Path('pse-custom/references-team-footer.css')
f.write_text(f.read_text(encoding='utf-8')+'''
#pse-reference-footer { width:100%; }
#pse-reference-footer .pse-footer-variant { display:none; }
@media(min-width:1200px) { #pse-reference-footer .pse-footer-variant--desktop { display:block; } }
@media(min-width:810px) and (max-width:1199px) { #pse-reference-footer .pse-footer-variant--tablet { display:block; } }
@media(max-width:809px) { #pse-reference-footer .pse-footer-variant--mobile { display:block; } }
''',encoding='utf-8',newline='')
print('Copied all three Team footer variants; styles scoped to References footer.')
