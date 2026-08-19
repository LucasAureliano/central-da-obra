import re

with open('src/components/connect/ConnectProfileForm.tsx', 'r', encoding='utf-8') as f:
    prof = f.read()
prof = prof.replace("phone: '' || ''", "phone: ''")
with open('src/components/connect/ConnectProfileForm.tsx', 'w', encoding='utf-8') as f:
    f.write(prof)
