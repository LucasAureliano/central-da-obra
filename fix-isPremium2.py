import os

def update_file(path, search, replace):
    with open(path, 'r', encoding='utf-8') as f:
        code = f.read()
    code = code.replace(search, replace)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(code)

update_file('src/components/calculators_library/BaseCalculatorLayout.tsx', 
"const { user, isGuest } = useAuth();", 
"const { user, isGuest, profile } = useAuth();")

print("Added profile to useAuth destructuring")
