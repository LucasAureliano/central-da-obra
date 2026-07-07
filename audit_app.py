import os

app_path = r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\App.tsx"
content = open(app_path, encoding='utf-8').read()

# Update Header in App.tsx
old_header = """<header 
        className="md:hidden flex items-center justify-between px-5 h-16 shrink-0"
        style={{ backgroundColor: 'var(--bg-base)', borderBottom: '1px solid var(--border-subtle)' }}
      >"""
new_header = """<header 
        className="md:hidden flex items-center justify-between px-5 h-16 shrink-0"
        style={{ 
          backgroundColor: 'var(--bg-glass)', 
          borderBottom: '1px solid var(--border-subtle)',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)'
        }}
      >"""
content = content.replace(old_header, new_header)

# Update main-content padding
content = content.replace('<main className="main-content hide-scrollbar">', '<main className="main-content hide-scrollbar" style={{ paddingTop: 64 }}>')

open(app_path, 'w', encoding='utf-8').write(content)
print("App.tsx Updated")
