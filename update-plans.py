import os
import re

path = 'src/components/SubscriptionPlans.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace MercadoPago endpoint with Stripe endpoint
content = content.replace('/api/mercadopago/create-preference', '/api/stripe/create-checkout')

# Replace the redirect logic
# MercadoPago returns { id, init_point }
# Stripe returns { id, url }
old_logic = "if (data.init_point) { window.location.href = data.init_point; } else if (data.id) { setPreferenceId(data.id); } else {"
new_logic = "if (data.url) { window.location.href = data.url; } else {"

content = content.replace(old_logic, new_logic)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
