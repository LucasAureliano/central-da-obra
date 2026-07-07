import os

css_path = r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\index.css"

new_css = """@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* Dark Mode Default (Premium Dark) */
  --bg-base: #0B0B0B;
  --bg-surface: #1A1A1A;
  --bg-elevated: #262626;
  
  --color-primary: #FF6B00;
  --color-primary-hover: #E66000;
  --color-primary-alpha: rgba(255, 107, 0, 0.15);
  
  --text-main: #FFFFFF;
  --text-muted: #A0A0A0;
  --text-inverse: #0B0B0B;
  
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-strong: rgba(255, 255, 255, 0.15);
  
  --shadow-elevated: 0 8px 30px rgba(0, 0, 0, 0.5);
  
  /* Status */
  --color-success: #10B981;
  --color-success-bg: rgba(16, 185, 129, 0.15);
  --color-warning: #F59E0B;
  --color-warning-bg: rgba(245, 158, 11, 0.15);
  --color-danger: #EF4444;
  --color-danger-bg: rgba(239, 68, 68, 0.15);
}

[data-theme='light'] {
  --bg-base: #F7F8F9;
  --bg-surface: #FFFFFF;
  --bg-elevated: #F0F2F4;
  
  --color-primary: #FF6B00;
  --color-primary-hover: #E66000;
  --color-primary-alpha: rgba(255, 107, 0, 0.1);
  
  --text-main: #111827;
  --text-muted: #6B7280;
  --text-inverse: #FFFFFF;
  
  --border-subtle: rgba(0, 0, 0, 0.06);
  --border-strong: rgba(0, 0, 0, 0.12);
  
  --shadow-elevated: 0 4px 24px rgba(0, 0, 0, 0.06);
}

/* Base Styles */
html, body, #root {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  background-color: var(--bg-base);
  color: var(--text-main);
  font-family: 'Inter', sans-serif;
  overflow: hidden;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Plus Jakarta Sans', sans-serif;
  letter-spacing: -0.02em;
  margin: 0;
}

/* Layout */
.app-container {
  display: flex;
  height: 100vh;
  height: 100dvh;
  width: 100%;
  overflow: hidden;
  position: relative;
}

.main-content {
  flex: 1;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
}

.screen-content {
  display: flex;
  flex-direction: column;
  padding-bottom: 96px; /* Space for Bottom Nav */
}

@media (min-width: 769px) {
  .app-container {
    flex-direction: row;
  }
  .screen-content {
    padding-bottom: 32px;
  }
}

/* Components */
.card-premium {
  background-color: var(--bg-surface);
  border-radius: 24px;
  padding: 24px;
  border: 1px solid var(--border-subtle);
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.card-premium-interactive:hover, .card-premium-interactive:active {
  transform: translateY(-2px);
  border-color: var(--border-strong);
  cursor: pointer;
}

.btn-primary {
  background-color: var(--color-primary);
  color: var(--text-inverse);
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 16px;
  border-radius: 16px;
  padding: 0 24px;
  height: 48px;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:active {
  transform: scale(0.96);
  background-color: var(--color-primary-hover);
}

.btn-secondary {
  background-color: transparent;
  color: var(--text-main);
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 16px;
  border-radius: 16px;
  padding: 0 24px;
  height: 48px;
  border: 1.5px solid var(--border-strong);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:active {
  background-color: var(--bg-elevated);
}

.btn-icon {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  background-color: var(--bg-elevated);
  border: 1px solid var(--border-subtle);
  color: var(--text-main);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-icon:active {
  transform: scale(0.92);
}

.status-chip {
  padding: 6px 12px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.status-active {
  background-color: var(--color-success-bg);
  color: var(--color-success);
}
.status-warning {
  background-color: var(--color-warning-bg);
  color: var(--color-warning);
}
.status-danger {
  background-color: var(--color-danger-bg);
  color: var(--color-danger);
}

/* Bottom Navigation (Mobile) */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px; /* larger touch area */
  background-color: var(--bg-surface);
  border-top: 1px solid var(--border-subtle);
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding-bottom: env(safe-area-inset-bottom, 0px);
  z-index: 100;
}

@media (min-width: 769px) {
  .bottom-nav { display: none; }
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  color: var(--text-muted);
  width: 100%;
  height: 100%;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.2s;
}

.nav-item span {
  font-size: 11px;
  font-weight: 500;
  font-family: 'Inter', sans-serif;
}

.nav-item.active {
  color: var(--color-primary);
}

.nav-item.active .nav-icon-container {
  background-color: var(--color-primary-alpha);
  color: var(--color-primary);
}

.nav-icon-container {
  width: 48px;
  height: 32px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

/* Inputs */
.input-premium {
  width: 100%;
  height: 56px;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: 16px;
  padding: 0 16px;
  color: var(--text-main);
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  transition: all 0.2s ease;
}

.input-premium:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-alpha);
}

/* Utilities */
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.animate-fade-in {
  animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
"""

with open(css_path, "w", encoding="utf-8") as f:
    f.write(new_css)
print("CSS Updated")
