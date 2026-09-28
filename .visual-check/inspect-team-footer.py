from pathlib import Path
import re
s=Path('team.html').read_text(encoding='utf-8')
print('Styles:',re.findall(r'<link[^>]*stylesheet[^>]*>',s))
for m in re.finditer(r'<footer\b.*?</footer>',s,re.S):
 print(m.group(0)[:350], 'length',len(m.group(0)))
 print('PARENT',s[m.start()-240:m.start()])
