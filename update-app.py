import os
import re

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    app = f.read()

# Add import
if 'PlansUpsellPopup' not in app:
    app = app.replace("import { InterstitialAd } from './components/shared/InterstitialAd';", "import { InterstitialAd } from './components/shared/InterstitialAd';\nimport { PlansUpsellPopup } from './components/shared/PlansUpsellPopup';")

# Add component injection
if '<PlansUpsellPopup' not in app:
    app = app.replace("<InterstitialAd />", "<InterstitialAd />\n        <PlansUpsellPopup onGoToPlans={() => handleMenuSelect('planos')} />")

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(app)

