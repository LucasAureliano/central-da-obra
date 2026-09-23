import os

def update_file(path, search, replace):
    with open(path, 'r', encoding='utf-8') as f:
        code = f.read()
    code = code.replace(search, replace)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(code)

update_file('src/components/calculators_library/BaseCalculatorLayout.tsx', 
"""userName: user?.displayName || 'Usuário'
        });""",
"""userName: user?.displayName || 'Usuário',
          isPremium: (profile as any)?.plan === 'pro'
        });""")

update_file('src/components/provider/QuoteWizard.tsx',
"""totals,
        profile
      });""",
"""totals,
        profile,
        isPremium: (profile as any)?.plan === 'pro'
      });""")

print("Injected isPremium flags")
