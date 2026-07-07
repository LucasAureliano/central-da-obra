import os

app_path = r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\App.tsx"
content = open(app_path, encoding='utf-8').read()

content = content.replace("<Login onGoToRegister={() => setAuthView('register')} />", "<Login onGoToRegister={() => setAuthView('register')} theme={theme} />")
content = content.replace("<Register onGoToLogin={() => setAuthView('login')} />", "<Register onGoToLogin={() => setAuthView('login')} theme={theme} />")
content = content.replace("<CustomLogo />", "<CustomLogo theme={theme} />")

open(app_path, 'w', encoding='utf-8').write(content)


# Update Login.tsx
login_path = r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\components\Login.tsx"
content = open(login_path, encoding='utf-8').read()
content = content.replace("interface LoginProps {\n  onGoToRegister: () => void;\n}", "interface LoginProps {\n  onGoToRegister: () => void;\n  theme?: 'light' | 'dark';\n}")
content = content.replace("export function Login({ onGoToRegister }: LoginProps) {", "export function Login({ onGoToRegister, theme = 'dark' }: LoginProps) {")
content = content.replace("<CustomLogo />", "<CustomLogo theme={theme} />")
open(login_path, 'w', encoding='utf-8').write(content)

# Update Register.tsx
reg_path = r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\components\Register.tsx"
content = open(reg_path, encoding='utf-8').read()
content = content.replace("interface RegisterProps {\n  onGoToLogin: () => void;\n}", "interface RegisterProps {\n  onGoToLogin: () => void;\n  theme?: 'light' | 'dark';\n}")
content = content.replace("export function Register({ onGoToLogin }: RegisterProps) {", "export function Register({ onGoToLogin, theme = 'dark' }: RegisterProps) {")
content = content.replace("<CustomLogo />", "<CustomLogo theme={theme} />")
open(reg_path, 'w', encoding='utf-8').write(content)

print("Props passed to Auth screens")
