import os
import re

with open('api/mercadopago/create-preference.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# Make the mock token return an error explicitly so it falls into the frontend catch block and triggers showMockCheckout
content = content.replace("return res.status(200).json({\n        id: 'mock_pref_' + Date.now(),\n        init_point: origin + '/#/mock-checkout?planId=' + planId + '&price=' + price,\n        sandbox_init_point: origin + '/#/mock-checkout?planId=' + planId + '&price=' + price\n      });", "return res.status(400).json({ error: 'MOCK_CHECKOUT_TRIGGER' });")

with open('api/mercadopago/create-preference.ts', 'w', encoding='utf-8') as f:
    f.write(content)
