import os
path = r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\index.css"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');", "")
content = "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');\n" + content

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
