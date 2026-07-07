import os

css_path = r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\index.css"

with open(css_path, "rb") as f:
    content = f.read()

# find the last closing brace
last_brace = content.rfind(b'}')

if last_brace != -1:
    clean_content = content[:last_brace+1]
else:
    clean_content = content

clean_content += b"\n\n.hide-scrollbar::-webkit-scrollbar { display: none; }\n"

with open(css_path, "wb") as f:
    f.write(clean_content)

print("CSS fixed for real.")
