import os

path = 'src/App.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add routing for connect
replacement = '''  const handleMenuSelect = (title: string) => {
    if (title === 'connect') {
      setActiveTab('connect');
      return;
    }'''

if "title === 'connect'" not in content:
    content = content.replace("  const handleMenuSelect = (title: string) => {", replacement)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

