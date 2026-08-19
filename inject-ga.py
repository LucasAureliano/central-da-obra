import os

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

ga_script = '''
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-2QE9PF33L4"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'G-2QE9PF33L4');
    </script>
'''

if 'G-2QE9PF33L4' not in html:
    html = html.replace('</head>', f'{ga_script}</head>')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
