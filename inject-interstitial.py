import os

with open('src/App.tsx', 'r', encoding='utf-8') as f:
    app = f.read()

if 'InterstitialAd' not in app:
    app = app.replace("import { Menu } from './components/Menu';", "import { Menu } from './components/Menu';\nimport { InterstitialAd } from './components/shared/InterstitialAd';")
    app = app.replace("<AppInstallBanner />", "<AppInstallBanner />\n        <InterstitialAd />")

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(app)
