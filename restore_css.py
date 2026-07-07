import os
path = r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\index.css"
with open(path, "a", encoding="utf-8") as f:
    f.write("""
/* RESTORED BOTTOM NAV */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  align-items: center;
  justify-content: center;
  padding: 8px 0;
  padding-bottom: env(safe-area-inset-bottom, 16px);
  background: var(--color-surface-glass);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid rgba(0,0,0,0.05);
  z-index: 1000;
}

.bottom-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: var(--text-muted);
  background: transparent;
  border: none;
  font-size: 10px;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
}

.bottom-nav-item-active {
  color: var(--color-primary);
}
""")
