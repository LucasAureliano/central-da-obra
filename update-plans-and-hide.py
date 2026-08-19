import os
import re

# Disable SponsoredAd
with open('src/components/shared/SponsoredAd.tsx', 'r', encoding='utf-8') as f:
    sponsored = f.read()

# Add const ADS_ENABLED = false;
if 'const ADS_ENABLED' not in sponsored:
    sponsored = sponsored.replace('const isPaidPlan = plan && plan.monthlyPrice > 0 && !plan.id.includes(\'free\');', 'const isPaidPlan = plan && plan.monthlyPrice > 0 && !plan.id.includes(\'free\');\n  const ADS_ENABLED = false; // Temporarily disabled while AdSense is in review')
    sponsored = sponsored.replace('if (!isVisible || isPaidPlan) return null;', 'if (!isVisible || isPaidPlan || !ADS_ENABLED) return null;')

with open('src/components/shared/SponsoredAd.tsx', 'w', encoding='utf-8') as f:
    f.write(sponsored)


# Disable InterstitialAd
with open('src/components/shared/InterstitialAd.tsx', 'r', encoding='utf-8') as f:
    interstitial = f.read()

if 'const ADS_ENABLED' not in interstitial:
    interstitial = interstitial.replace('const isPaidPlan = plan && plan.monthlyPrice > 0 && !plan.id.includes(\'free\');', 'const isPaidPlan = plan && plan.monthlyPrice > 0 && !plan.id.includes(\'free\');\n  const ADS_ENABLED = false; // Temporarily disabled while AdSense is in review')
    interstitial = interstitial.replace('if (isPaidPlan) return null;', 'if (isPaidPlan || !ADS_ENABLED) return null;')
    # Need to make sure we don't return early before hooks, so we put it at the end. Actually if (isPaidPlan) return null; is already at the end before the return statement.
    

with open('src/components/shared/InterstitialAd.tsx', 'w', encoding='utf-8') as f:
    f.write(interstitial)


# Update Plans config
with open('src/config/plans.ts', 'r', encoding='utf-8') as f:
    plans = f.read()

# We can do some targeted regex replaces to add 'Com anúncios' to free and 'Sem anúncios' to others
# Free plans usually have monthlyPrice: 0. Wait, they don't have monthlyPrice explicitly in the features list in the file text, we need to find features arrays.

import ast
# Let's just do a simple string replace for specific feature lines.
plans = plans.replace("'Calculadoras ilimitadas',", "'Calculadoras ilimitadas',\n        'Contém anúncios (Popups e Banners)'")
plans = plans.replace("'Calculadoras ilimitadas'", "'Calculadoras ilimitadas',\n        'Contém anúncios (Popups e Banners)'")

plans = plans.replace("'Suporte por email',", "'Suporte por email',\n        'Livre de anúncios (Ad-free)'")
plans = plans.replace("'Suporte por email'", "'Suporte por email',\n        'Livre de anúncios (Ad-free)'")

plans = plans.replace("'Exportação de relatórios em PDF',", "'Exportação de relatórios em PDF',\n        'Experiência 100% Livre de Anúncios',")
plans = plans.replace("'Exporta\u00e7\u00e3o de relat\u00f3rios em PDF',", "'Exporta\u00e7\u00e3o de relat\u00f3rios em PDF',\n        'Experiência 100% Livre de Anúncios',")

plans = plans.replace("'Funil de vendas e indicadores comerciais'", "'Funil de vendas e indicadores comerciais',\n        'Experiência 100% Livre de Anúncios'")
plans = plans.replace("'Copilot da Obra (IA)'", "'Copilot da Obra (IA)',\n        'Experiência 100% Livre de Anúncios'")
plans = plans.replace("'PDFs com identidade visual'", "'PDFs com identidade visual',\n        'Experiência 100% Livre de Anúncios'")
plans = plans.replace("'Orçamento técnico profissional'", "'Orçamento técnico profissional',\n        'Experiência 100% Livre de Anúncios'")
plans = plans.replace("'Or\u00e7amento t\u00e9cnico profissional'", "'Or\u00e7amento t\u00e9cnico profissional',\n        'Experiência 100% Livre de Anúncios'")
plans = plans.replace("'Dashboards personalizados'", "'Dashboards personalizados',\n        'Experiência 100% Livre de Anúncios'")

# Also update PlansUpsellPopup
with open('src/components/shared/PlansUpsellPopup.tsx', 'r', encoding='utf-8') as f:
    upsell = f.read()

upsell = upsell.replace('remova todos os anúncios', 'remova todos os anúncios para sempre')
with open('src/components/shared/PlansUpsellPopup.tsx', 'w', encoding='utf-8') as f:
    f.write(upsell)

with open('src/config/plans.ts', 'w', encoding='utf-8') as f:
    f.write(plans)

