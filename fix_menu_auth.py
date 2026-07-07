import os

# Fix Menu.tsx
menu_path = r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\components\Menu.tsx"
content = open(menu_path, encoding='utf-8').read()
if "import { useAuth }" not in content:
    content = content.replace("import { \n  Settings,", "import { useAuth } from '../contexts/AuthContext';\nimport { \n  Settings,")
# The previous script might have failed to replace it because I had replaced the import block earlier.
# Let's just prepend it.
if "import { useAuth } from '../contexts/AuthContext';" not in content:
    content = "import { useAuth } from '../contexts/AuthContext';\n" + content

open(menu_path, 'w', encoding='utf-8').write(content)

# Fix AuthContext.tsx
auth_path = r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\contexts\AuthContext.tsx"
content = open(auth_path, encoding='utf-8').read()
content = content.replace("import { createContext, useContext, useEffect, useState, ReactNode } from 'react';", "import { createContext, useContext, useEffect, useState } from 'react';\nimport type { ReactNode } from 'react';")
content = content.replace("import { onAuthStateChanged, User, signOut as firebaseSignOut } from 'firebase/auth';", "import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';\nimport type { User } from 'firebase/auth';")
open(auth_path, 'w', encoding='utf-8').write(content)

print("TS errors fixed")
