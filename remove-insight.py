import os

with open('src/hooks/useInsights.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the specific block with empty string or comment it out
import re
pattern = r"// --- SMART WEATHER INSIGHT ---.*?if \(activeWork\?\.address\) \{.*?\};\n      \}"
content = re.sub(pattern, "", content, flags=re.DOTALL)

with open('src/hooks/useInsights.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
