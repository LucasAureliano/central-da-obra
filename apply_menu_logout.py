import os

menu_path = r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\components\Menu.tsx"
content = open(menu_path, encoding='utf-8').read()

new_content = content.replace("import { \n  Settings,", "import { useAuth } from '../contexts/AuthContext';\nimport { \n  Settings,")
# The menu function declaration
new_content = new_content.replace(
    "export function Menu({ theme, onToggleTheme }: MenuProps) {",
    "export function Menu({ theme, onToggleTheme }: MenuProps) {\n  const { signOut, user } = useAuth();"
)
# Add logout button at the end
new_content = new_content.replace(
    "      </div>\n\n    </div>\n  );\n}",
    """      </div>

      <div style={{ marginTop: 32 }}>
        <button 
          className="btn-secondary card-premium-interactive" 
          style={{ width: '100%', borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}
          onClick={() => signOut()}
        >
          Sair da Conta
        </button>
      </div>

    </div>
  );
}"""
)

# Update user profile dynamically
new_content = new_content.replace(
    "<h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-main)' }}>João Diretor</h2>",
    "<h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-main)' }}>{user?.email || 'Usuário'}</h2>"
)
new_content = new_content.replace(
    "<span style={{ fontSize: 20, fontWeight: 700, color: '#FFF' }}>JD</span>",
    "<span style={{ fontSize: 20, fontWeight: 700, color: '#FFF' }}>{user?.email ? user.email[0].toUpperCase() : 'U'}</span>"
)

open(menu_path, 'w', encoding='utf-8').write(new_content)
print("Menu.tsx updated with logout")
