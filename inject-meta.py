import os

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

meta_tag = '<meta name="google-adsense-account" content="ca-pub-5169145738145346">'

if meta_tag not in html:
    html = html.replace('<head>', f'<head>\n    {meta_tag}')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

