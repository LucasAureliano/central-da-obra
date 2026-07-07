import os

css_path = r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\index.css"

with open(css_path, "r", encoding="utf-8") as f:
    css = f.read()

# Change the primary colors
css = css.replace("--color-primary: #3b82f6;", "--color-primary: #C9A25E;")
css = css.replace("--color-primary-hover: #2563eb;", "--color-primary-hover: #B08B48;")
css = css.replace("--color-primary-light: #eff6ff;", "--color-primary-light: rgba(201, 162, 94, 0.1);")

with open(css_path, "w", encoding="utf-8") as f:
    f.write(css)

print("CSS updated with new gold/champagne color.")
