import os
import re

with open('src/components/Menu.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add import
if 'SponsoredAd' not in content:
    content = content.replace("import { motion, AnimatePresence } from 'framer-motion';", "import { motion, AnimatePresence } from 'framer-motion';\nimport { SponsoredAd } from './shared/SponsoredAd';")

# Add component
ad_injection = "        <div style={{ marginTop: 24 }}>\n          <SponsoredAd probability={1.0} location='menu' />\n        </div>\n"
if '<SponsoredAd' not in content:
    content = content.replace("{/* Modals Portal */}", ad_injection + "\n        {/* Modals Portal */}")

with open('src/components/Menu.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

