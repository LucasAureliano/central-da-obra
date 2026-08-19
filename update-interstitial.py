import os
import re

with open('src/components/shared/InterstitialAd.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Change initialTimer 60000 to 180000 (3 minutes)
content = re.sub(r'setTimeout\(\(\) => \{\n\s*triggerAd\(\);\n\s*\}, 60000\); // 1 minute', 'setTimeout(() => {\n      triggerAd();\n    }, 180000); // 3 minutes', content)

with open('src/components/shared/InterstitialAd.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
