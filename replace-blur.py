import os
import re

components_dir = 'src/components'
for root, dirs, files in os.walk(components_dir):
    for file in files:
        if file.endswith('.tsx'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Replace blur(10px) with blur(24px) for modals
            # Replace rgba(0,0,0,0.8) with rgba(0,0,0,0.6) for softer shadows behind the stronger blur
            content = content.replace("backdropFilter: 'blur(10px)'", "backdropFilter: 'blur(24px)'")
            content = content.replace("backdropFilter: \"blur(10px)\"", "backdropFilter: 'blur(24px)'")
            content = content.replace("backdrop-filter: blur(10px)", "backdrop-filter: blur(24px)")
            content = content.replace("rgba(0,0,0,0.8)", "rgba(0,0,0,0.6)")
            content = content.replace("rgba(0, 0, 0, 0.8)", "rgba(0, 0, 0, 0.6)")
            
            with open(path, 'w', encoding='utf-8') as f:
                f.write(content)
