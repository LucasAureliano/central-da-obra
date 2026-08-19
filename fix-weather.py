import os
import re

# 1. Fix SubscriptionPlans text
with open('src/components/SubscriptionPlans.tsx', 'r', encoding='utf-8') as f:
    plans = f.read()

plans = plans.replace("O Mercado Pago n\\u01dfo est\\u01ad configurado", "As chaves do Stripe n\\u00e3o est\\u00e3o configuradas")
plans = plans.replace("O Mercado Pago não está configurado. Utilize a simulação.", "As chaves do Stripe não estão configuradas. Utilize a simulação.")

with open('src/components/SubscriptionPlans.tsx', 'w', encoding='utf-8') as f:
    f.write(plans)

# 2. Fix App.tsx
with open('src/App.tsx', 'r', encoding='utf-8') as f:
    app = f.read()

app = app.replace("import { WeatherProvider } from './contexts/WeatherContext';\n", "")
app = app.replace("<WeatherProvider>", "")
app = app.replace("</WeatherProvider>", "")

with open('src/App.tsx', 'w', encoding='utf-8') as f:
    f.write(app)

# 3. WorkDiary.tsx
with open('src/components/works/WorkDiary.tsx', 'r', encoding='utf-8') as f:
    diary = f.read()

diary = re.sub(r"import \{ useWeather \} from '../../contexts/WeatherContext';\n?", "", diary)
diary = re.sub(r"const \{ weather, loading: weatherLoading \} = useWeather\(\);\n?", "", diary)
# remove weather UI block
diary = re.sub(r"\{weather && \(\s*<div.*?</p>\s*</div>\s*\)\}", "", diary, flags=re.DOTALL)
diary = re.sub(r"\{weatherLoading && \(\s*<div.*?</p>\s*</div>\s*\)\}", "", diary, flags=re.DOTALL)

with open('src/components/works/WorkDiary.tsx', 'w', encoding='utf-8') as f:
    f.write(diary)

# 4. TechnicalJournal.tsx
with open('src/components/architect/TechnicalJournal.tsx', 'r', encoding='utf-8') as f:
    journal = f.read()

journal = re.sub(r"import \{ useWeather \} from '../../contexts/WeatherContext';\n?", "", journal)
journal = re.sub(r"const \{ weather, loading: weatherLoading \} = useWeather\(\);\n?", "", journal)
journal = re.sub(r"\{weather && \(\s*<div.*?</p>\s*</div>\s*\)\}", "", journal, flags=re.DOTALL)

with open('src/components/architect/TechnicalJournal.tsx', 'w', encoding='utf-8') as f:
    f.write(journal)
