import os

app_path = r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\App.tsx"
content = open(app_path, encoding='utf-8').read()

# Replace useEffect for theme
old_use_effect = """  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);"""

new_use_effect = """  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };"""

content = content.replace(old_use_effect, new_use_effect)

# Update Menu to use toggleTheme and pass theme
content = content.replace("<Menu theme=\"dark\" onToggleTheme={() => {}} />", "<Menu theme={theme} onToggleTheme={toggleTheme} />")

# Update CustomLogo everywhere in App.tsx
content = content.replace("<CustomLogo />", "<CustomLogo theme={theme} />")

open(app_path, 'w', encoding='utf-8').write(content)
print("App.tsx updated for theme toggle")
