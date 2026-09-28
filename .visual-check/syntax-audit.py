from pathlib import Path
import re,subprocess
files=list(Path('pse-custom').glob('*.js'))+list(Path('pse-i18n').glob('*.js'))+[Path('local-images.js'),Path('images-config.js')]
errors=[]
for f in files:
 r=subprocess.run(['node','--check',str(f)],capture_output=True,text=True)
 if r.returncode:errors.append((str(f),r.stderr))
print('JavaScript syntax:',len(files),'files checked;',len(errors),'errors')
for e in errors:print(e)
