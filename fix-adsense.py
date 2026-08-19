import os

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

adsense_script = '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5169145738145346" crossorigin="anonymous"></script>'

if adsense_script not in html:
    html = html.replace('</head>', f'    {adsense_script}\n  </head>')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    app = f.read()

app = app.replace("import { AdSenseInjector } from './components/shared/AdSenseInjector';\n", "")
app = app.replace("<AdSenseInjector />\n        ", "")

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(app)
