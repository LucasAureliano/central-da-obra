import os

css_path = r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\index.css"

with open(css_path, "rb") as f:
    content = f.read()

# Try to decode as utf-8 ignoring errors
text = content.decode("utf-8", errors="ignore")

# Remove the corrupted part: ". h i d e" and everything after it
if ". h i d e" in text:
    text = text.split(". h i d e")[0]

# Make sure it ends correctly (with closing bracket of the media query)
text = text.strip() + "\n\n.hide-scrollbar::-webkit-scrollbar { display: none; }\n"

with open(css_path, "w", encoding="utf-8") as f:
    f.write(text)

print("CSS fixed.")
