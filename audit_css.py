import os

css_path = r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\index.css"
content = open(css_path, encoding='utf-8').read()

# Add glassmorphism variables
if "--bg-glass:" not in content:
    content = content.replace("--bg-surface: #1A1A1A;", "--bg-surface: #1A1A1A;\n  --bg-glass: rgba(26, 26, 26, 0.75);")
    content = content.replace("--bg-surface: #FFFFFF;", "--bg-surface: #FFFFFF;\n  --bg-glass: rgba(255, 255, 255, 0.75);")

# Update .bottom-nav
content = content.replace("background-color: var(--bg-surface);", "background-color: var(--bg-glass);\n  backdrop-filter: blur(20px);\n  -webkit-backdrop-filter: blur(20px);")

new_utilities = """
/* Glass Panel */
.glass-panel {
  background-color: var(--bg-glass);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

/* Mesh Gradient / Glow */
.card-mesh-gradient {
  background: radial-gradient(circle at 100% 0%, rgba(255,107,0,0.8) 0%, var(--color-primary) 50%, #C24A00 100%);
  position: relative;
  overflow: hidden;
}
.card-mesh-gradient::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1), transparent 60%);
  pointer-events: none;
}

/* Horizontal Scroll (Swimlanes) */
.horizontal-scroll {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  gap: 16px;
  padding-bottom: 8px;
}
.horizontal-scroll > * {
  scroll-snap-align: start;
  flex: 0 0 auto;
}

/* Staggered Animations */
.animate-stagger-1 { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.05s both; }
.animate-stagger-2 { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.10s both; }
.animate-stagger-3 { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both; }
.animate-stagger-4 { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.20s both; }
.animate-stagger-5 { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.25s both; }
"""

# Update .card-premium-interactive:active
content = content.replace("transform: translateY(-2px);", "transform: translateY(-2px);")
# Let's completely redefine card-premium-interactive
interactive_css = """
.card-premium-interactive {
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.2s ease, box-shadow 0.2s ease;
}
.card-premium-interactive:hover {
  transform: translateY(-2px);
  border-color: var(--border-strong);
  cursor: pointer;
  box-shadow: 0 12px 32px rgba(0,0,0,0.1);
}
.card-premium-interactive:active {
  transform: scale(0.97) translateY(0);
}
"""
content = content.replace(""".card-premium-interactive:hover, .card-premium-interactive:active {
  transform: translateY(-2px);
  border-color: var(--border-strong);
  cursor: pointer;
}""", interactive_css)

if "/* Glass Panel */" not in content:
    content += new_utilities

open(css_path, 'w', encoding='utf-8').write(content)
print("CSS Updated with Audit fixes")
