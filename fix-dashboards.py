import os
import re

with open('src/components/Dashboard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add import
if 'SponsoredAd' not in content:
    import_stmt = "import { SponsoredAd } from './shared/SponsoredAd';\n"
    content = content.replace("import { ProviderDashboard } from './provider/ProviderDashboard';", "import { ProviderDashboard } from './provider/ProviderDashboard';\n" + import_stmt)

# Add SponsoredAd inside the container div
ad_component = "<SponsoredAd probability={0.4} />\n        "
if '<SponsoredAd' not in content:
    content = content.replace('<div style={{ display: \'flex\', justifyContent: \'space-between\'', ad_component + '<div style={{ display: \'flex\', justifyContent: \'space-between\'')

with open('src/components/Dashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

with open('src/components/dashboard/TechnicalDashboard.tsx', 'r', encoding='utf-8') as f:
    tech = f.read()

if 'SponsoredAd' not in tech:
    tech = tech.replace("import { motion } from 'framer-motion';", "import { motion } from 'framer-motion';\nimport { SponsoredAd } from '../shared/SponsoredAd';")
    tech = tech.replace("{/* KPI Stats (Glassmorphism) */}", "<SponsoredAd probability={0.3} location='tech-dashboard' />\n        {/* KPI Stats (Glassmorphism) */}")

with open('src/components/dashboard/TechnicalDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(tech)

with open('src/components/provider/ProviderDashboard.tsx', 'r', encoding='utf-8') as f:
    prov = f.read()

if 'SponsoredAd' not in prov:
    prov = prov.replace("import { motion } from 'framer-motion';", "import { motion } from 'framer-motion';\nimport { SponsoredAd } from '../shared/SponsoredAd';")
    prov = prov.replace("{/* KPI Grid */}", "<SponsoredAd probability={0.3} location='provider-dashboard' />\n        {/* KPI Grid */}")

with open('src/components/provider/ProviderDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(prov)

