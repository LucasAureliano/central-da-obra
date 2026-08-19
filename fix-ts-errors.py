import re

# Fix SubscriptionPlans.tsx
with open('src/components/SubscriptionPlans.tsx', 'r', encoding='utf-8') as f:
    plans = f.read()
plans = plans.replace("setShowMockCheckout({ plan: selectedPlan, price });", "setShowMockCheckout({ plan: selectedPlan, price: selectedPlan === 'pro' ? proPrice : selectedPlan === 'starter' ? starterPrice : businessPrice });")
with open('src/components/SubscriptionPlans.tsx', 'w', encoding='utf-8') as f:
    f.write(plans)

# Fix ConnectProfileForm.tsx
with open('src/components/connect/ConnectProfileForm.tsx', 'r', encoding='utf-8') as f:
    prof = f.read()
prof = prof.replace("profile?.phone", "''")
with open('src/components/connect/ConnectProfileForm.tsx', 'w', encoding='utf-8') as f:
    f.write(prof)
