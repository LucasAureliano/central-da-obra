import re

css_path = r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\index.css"

with open(css_path, "rb") as f:
    content = f.read()

# We know the last valid part is the @media query closing brace.
# Let's find the exact string to cut off at.
marker = b"max-width: var(--device-width);\r\n  }\r\n}"
if marker not in content:
    marker = b"max-width: var(--device-width);\n  }\n}"

idx = content.find(marker)
if idx != -1:
    clean_content = content[:idx + len(marker)]
else:
    clean_content = content

clean_content += b"\n\n.hide-scrollbar::-webkit-scrollbar { display: none; }\n"

with open(css_path, "wb") as f:
    f.write(clean_content)

print("CSS fixed definitively.")
