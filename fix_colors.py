import os

src_dir = r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src"

for root, _, files in os.walk(src_dir):
    for f in files:
        if f.endswith(('.tsx', '.ts', '.css')):
            path = os.path.join(root, f)
            with open(path, "r", encoding="utf-8") as file:
                content = file.read()
            
            new_content = content.replace("--color-text-muted", "--text-muted")
            new_content = new_content.replace("--color-text", "--text-main")
            
            if new_content != content:
                with open(path, "w", encoding="utf-8") as file:
                    file.write(new_content)
                print(f"Updated colors in {f}")

print("Done")
