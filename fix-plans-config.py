import re

with open('src/config/plans.ts', 'r', encoding='utf-8') as f:
    plans = f.read()

plans = plans.replace("maxQuotes: 5", "maxQuotes: 3")
plans = plans.replace("maxClients: 10", "maxClients: 5")
plans = plans.replace("Até 5 orçamentos", "Até 3 orçamentos")
plans = plans.replace("Até 10 clientes", "Até 5 clientes")

with open('src/config/plans.ts', 'w', encoding='utf-8') as f:
    f.write(plans)
