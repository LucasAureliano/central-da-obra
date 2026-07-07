import os
import re

css_path = r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\index.css"

with open(css_path, "r", encoding="utf-8") as f:
    css = f.read()

# We need to remove from /* PREMIUM UI OVERHAUL */ or similar.
# Wait, I used "/* NEW BOTTOM NAV (5 TABS) */" in index.css as well, or "/* PREMIUM UI OVERHAUL */"
if "/* PREMIUM UI OVERHAUL */" in css:
    css = css[:css.find("/* PREMIUM UI OVERHAUL */")]
elif "/* NEW BOTTOM NAV (5 TABS) */" in css:
    css = css[:css.find("/* NEW BOTTOM NAV (5 TABS) */")]
elif "/* Glassmorphism Classes */" in css:
    css = css[:css.find("/* Glassmorphism Classes */")]
else:
    # Let's just find where the original css ended. The original css probably ended with .slide-left-exit-active
    # Let's print out the last few classes.
    pass

# To be completely sure, I'll search for where I inserted my custom properties and trim.
# In `update_css.py`, I did:
# css_append = """\n/* PREMIUM UI OVERHAUL */\n
# So it starts exactly with "/* PREMIUM UI OVERHAUL */"

if "/* PREMIUM UI OVERHAUL */" in css:
    css = css[:css.find("/* PREMIUM UI OVERHAUL */")]
    print("Found and removed PREMIUM UI OVERHAUL block.")
    
    with open(css_path, "w", encoding="utf-8") as f:
        f.write(css)

# I also need to restore `.bottom-nav` if it was deleted.
# In Phase 1, `.bottom-nav` was:
bottom_nav_css = """
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 8px 16px;
  padding-bottom: env(safe-area-inset-bottom, 16px);
  background-color: var(--color-surface);
  border-top: 1px solid var(--color-border);
  z-index: 50;
  overflow-x: auto;
  gap: 16px;
}

.bottom-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-width: 64px;
  padding: 4px 8px;
  color: var(--color-text-muted);
  background: transparent;
  border: none;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.bottom-nav-item-active {
  color: var(--color-primary);
  background: var(--color-bg-primary);
}
"""

with open(css_path, "r", encoding="utf-8") as f:
    css = f.read()
    
if ".bottom-nav {" not in css:
    with open(css_path, "a", encoding="utf-8") as f:
        f.write(bottom_nav_css)
    print("Restored original .bottom-nav")

