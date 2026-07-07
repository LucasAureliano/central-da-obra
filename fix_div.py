import os

dash_path = r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\components\Dashboard.tsx"
content = open(dash_path, encoding='utf-8').read()

# I need to balance the divs. 
# There's a </div> missing for the root div.
content = content.replace("    </div>\n  );\n}\n", "    </div>\n    </div>\n  );\n}\n")

open(dash_path, 'w', encoding='utf-8').write(content)
print("Div fixed")
