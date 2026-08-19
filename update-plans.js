const fs = require('fs');

let plans = fs.readFileSync('src/config/plans.ts', 'utf-8');

plans = plans.replace(/'Calculadoras ilimitadas',/g, "'Calculadoras ilimitadas',\n        'Contém anúncios (Popups e Banners)',");
plans = plans.replace(/'Calculadoras ilimitadas'\n/g, "'Calculadoras ilimitadas',\n        'Contém anúncios (Popups e Banners)'\n");

plans = plans.replace(/'Suporte por email',/g, "'Suporte por email',\n        'Livre de anúncios (Ad-free)',");
plans = plans.replace(/'Suporte por email'\n/g, "'Suporte por email',\n        'Livre de anúncios (Ad-free)'\n");

plans = plans.replace(/'Exportação de relatórios em PDF',/g, "'Exportação de relatórios em PDF',\n        'Experiência 100% Livre de Anúncios',");
plans = plans.replace(/'Funil de vendas e indicadores comerciais'\n/g, "'Funil de vendas e indicadores comerciais',\n        'Experiência 100% Livre de Anúncios'\n");
plans = plans.replace(/'Copilot da Obra \(IA\)'\n/g, "'Copilot da Obra (IA)',\n        'Experiência 100% Livre de Anúncios'\n");
plans = plans.replace(/'PDFs com identidade visual'\n/g, "'PDFs com identidade visual',\n        'Experiência 100% Livre de Anúncios'\n");
plans = plans.replace(/'Orçamento técnico profissional'\n/g, "'Orçamento técnico profissional',\n        'Experiência 100% Livre de Anúncios'\n");
plans = plans.replace(/'Dashboards personalizados'\n/g, "'Dashboards personalizados',\n        'Experiência 100% Livre de Anúncios'\n");
plans = plans.replace(/'Gantt e Centro de Operações'\n/g, "'Gantt e Centro de Operações',\n        'Experiência 100% Livre de Anúncios'\n");

fs.writeFileSync('src/config/plans.ts', plans, 'utf-8');

let upsell = fs.readFileSync('src/components/shared/PlansUpsellPopup.tsx', 'utf-8');
upsell = upsell.replace('remova todos os anúncios', 'remova todos os anúncios para sempre');
fs.writeFileSync('src/components/shared/PlansUpsellPopup.tsx', upsell, 'utf-8');

