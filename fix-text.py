import os
import re

with open('src/components/SubscriptionPlans.tsx', 'r', encoding='utf-8') as f:
    plans = f.read()

plans = re.sub(r'O Mercado Pago.*?Utilize a simula.*?o\.', 'As chaves do Stripe n&atilde;o est&atilde;o configuradas. Utilize a simula&ccedil;&atilde;o.', plans)

with open('src/components/SubscriptionPlans.tsx', 'w', encoding='utf-8') as f:
    f.write(plans)
