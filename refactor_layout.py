import os
import re

css_path = r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\index.css"

with open(css_path, "r", encoding="utf-8") as f:
    css = f.read()

# Replace the Prototype/Shell layout section
# We will just append the new responsive rules and remove the old shell classes
# But first, let's remove `.prototype-container`, `.device-shell`, `.device-notch`, `.device-screen` and `.status-bar` (which is in css too, wait, status-bar might be there).

# The easiest way is to use regex to remove block by block, or just append overriding rules. But removing is cleaner.
# Actually, I'll just rewrite index.css from scratch preserving the variables and global styles, but updating the shell.
# Let's write the whole file to ensure it's clean and doesn't get messed up.
