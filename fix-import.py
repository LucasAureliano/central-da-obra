import os
import re

with open('src/components/SubscriptionPlans.tsx', 'r', encoding='utf-8') as f:
    plans = f.read()

plans = re.sub(r"import \{ CheckoutBrick \} from '\./shared/CheckoutBrick';\n?", "", plans)
plans = re.sub(r"<CheckoutBrick.*?/>", "", plans)

with open('src/components/SubscriptionPlans.tsx', 'w', encoding='utf-8') as f:
    f.write(plans)
