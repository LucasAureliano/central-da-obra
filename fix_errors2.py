import os
import re

works_path = r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\components\Works.tsx"
app_path = r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\App.tsx"

with open(works_path, "r", encoding="utf-8") as f:
    content = f.read()

# Remove unused imports and props
content = content.replace("ArrowLeft, Plus, MapPin, Check, ShoppingCart", "ArrowLeft, Plus, MapPin, Check")
content = re.sub(r"\s*shoppingList:\s*any\[\];", "", content)
content = re.sub(r"\s*financialLedger:\s*any\[\];", "", content)
content = re.sub(r"\s*onAddShoppingItem:\s*\(name: string, quantity: string\) => void;", "", content)
content = content.replace("  shoppingList,\n", "")
content = content.replace("  financialLedger,\n", "")
content = content.replace("  onAddShoppingItem\n", "")
content = content.replace("  onAddShoppingItem,\n", "")

with open(works_path, "w", encoding="utf-8") as f:
    f.write(content)

with open(app_path, "r", encoding="utf-8") as f:
    app_ts = f.read()

app_ts = re.sub(r"\s*shoppingList=\{viewList\}", "", app_ts)
app_ts = re.sub(r"\s*financialLedger=\{viewLedger\}", "", app_ts)
app_ts = re.sub(r"\s*onAddShoppingItem=\{handleAddShoppingItem\}", "", app_ts)

with open(app_path, "w", encoding="utf-8") as f:
    f.write(app_ts)

print("Works and App TS errors fixed.")
