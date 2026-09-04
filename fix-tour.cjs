const fs = require('fs');

// 1. Fix PlansUpsellPopup
let upsell = fs.readFileSync('src/components/shared/PlansUpsellPopup.tsx', 'utf8');
upsell = upsell.replace(/setTimeout\(\(\) => \{\s*setIsVisible\(true\);\s*sessionStorage\.setItem\('plans_popup_shown', 'true'\);\s*\}, 2000\);/g, "setTimeout(() => {\n      setIsVisible(true);\n      sessionStorage.setItem('plans_popup_shown', 'true');\n    }, 20000);");
fs.writeFileSync('src/components/shared/PlansUpsellPopup.tsx', upsell, 'utf8');

// 2. Fix InteractiveTour & Add premium options
let tour = fs.readFileSync('src/components/onboarding/InteractiveTour.tsx', 'utf8');

tour = tour.replace("doneBtnText: 'Comear',", "doneBtnText: 'Começar',");
tour = tour.replace("nextBtnText: 'Avanar',", "nextBtnText: 'Avançar',");
tour = tour.replace("description: 'Este Ǹ o seu painel central. Aqui vocǦ tem uma visǜo geral de tudo.',", "description: 'Este é o seu painel central. Aqui você tem uma visão geral de tudo.',");
tour = tour.replace("description: 'Gerencie todas as suas obras, oramentos e clientes neste menu.',", "description: 'Gerencie todas as suas obras, orçamentos e clientes neste menu.',");
tour = tour.replace("title: 'InteligǦncia Artificial',", "title: 'Inteligência Artificial',");
tour = tour.replace("description: 'Nossa IA foi treinada com normas da ABNT para responder dǧvidas tǸcnicas e orar plantas.',", "description: 'Nossa IA foi treinada com normas da ABNT para responder dúvidas técnicas e orçar plantas.',");
tour = tour.replace("description: 'Descubra a quantidade exata de materiais para cada etapa, evitando desperdcio.',", "description: 'Descubra a quantidade exata de materiais para cada etapa, evitando desperdício.',");
tour = tour.replace("description: 'VocǦ estǭ preparado para usar a plataforma. Explore as ferramentas e ganhe produtividade!',", "description: 'Você está preparado para usar a plataforma. Explore as ferramentas e ganhe produtividade!',");

tour = tour.replace("smoothScroll: true,", "smoothScroll: true,\n        overlayColor: 'rgba(0,0,0,0.7)',\n        stagePadding: 8,\n        stageRadius: 16,\n        popoverClass: 'premium-tour-popover',");
tour = tour.replace("setTimeout(() => {", "setTimeout(() => {");
tour = tour.replace("}, 500);", "}, 800);");

fs.writeFileSync('src/components/onboarding/InteractiveTour.tsx', tour, 'utf8');

// 3. Add Premium Tour CSS to global CSS
let css = fs.readFileSync('src/index.css', 'utf8');
if (!css.includes('.premium-tour-popover')) {
  css += "\n\n/* Premium Tour Popover */\n.premium-tour-popover {\n  background: var(--bg-surface-solid) !important;\n  color: var(--text-main) !important;\n  border-radius: 16px !important;\n  border: 1px solid var(--border-subtle) !important;\n  box-shadow: 0 12px 32px rgba(0,0,0,0.15) !important;\n  font-family: 'Inter', sans-serif !important;\n}\n.premium-tour-popover .driver-popover-title {\n  font-weight: 800 !important;\n  color: var(--text-main) !important;\n  font-size: 18px !important;\n}\n.premium-tour-popover .driver-popover-description {\n  color: var(--text-muted) !important;\n  font-size: 14px !important;\n  line-height: 1.5 !important;\n}\n.premium-tour-popover .driver-popover-next-btn, .premium-tour-popover .driver-popover-prev-btn {\n  border-radius: 8px !important;\n  background: var(--color-primary) !important;\n  color: #fff !important;\n  text-shadow: none !important;\n  border: none !important;\n  font-weight: 600 !important;\n}\n.premium-tour-popover .driver-popover-prev-btn {\n  background: var(--bg-elevated) !important;\n  color: var(--text-main) !important;\n}";
  fs.writeFileSync('src/index.css', css, 'utf8');
}
