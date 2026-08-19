import os
import re

components_dir = 'src/components'
for root, dirs, files in os.walk(components_dir):
    for file in files:
        if file.endswith('.tsx'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Replace basic opacity/y transitions with spring
            # We look for <motion.div ... transition={{ duration: X }}> and replace it
            content = re.sub(r'transition=\{\{ duration: 0\.\d+ \}\}', 'transition={{ type: "spring", bounce: 0, duration: 0.4 }}', content)
            content = re.sub(r'transition=\{\{ duration: 0\.\d+, delay: 0\.\d+ \}\}', 'transition={{ type: "spring", bounce: 0, duration: 0.4 }}', content)
            
            # Change any specific modal transitions (e.g. AuthModal, NewWorkModal)
            content = re.sub(r'transition=\{\{ type: ["\']spring["\'], damping: 25, stiffness: 500 \}\}', 'transition={{ type: "spring", bounce: 0, duration: 0.4 }}', content)
            
            # For menu background, apply apple-glass class
            if "className=\"menu-bar" in content or "className={menu-bar" in content:
                pass # Already handled by CSS
            
            with open(path, 'w', encoding='utf-8') as f:
                f.write(content)
