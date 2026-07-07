import os
import re

calc_path = r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\components\Calculators.tsx"
with open(calc_path, "r", encoding="utf-8") as f:
    calc = f.read()

# I will use string replace for each specific hint section.
# We have `<!-- Concrete Results Card -->` style comments but in TSX they are `{/* Concrete Results Card */}`
# I will inject the hint right before `</div>` that closes the inner content of the card-premium, or right before the buttons.
# A safe place is right before the `<div style={{ display: 'flex', gap: 8, marginTop: 16 }}>` where buttons are.

hint_template = """
                    <div style={{ marginTop: 12, padding: '8px 12px', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--color-primary)', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <span style={{ fontSize: 16 }}>📚</span>
                      <p className="text-xs text-muted" style={{ lineHeight: 1.4 }}>
                        <strong>Dica Técnica:</strong> {hint_text}
                      </p>
                    </div>
"""

def inject_hint(calc_str, button_search_str, hint_text):
    hint_code = hint_template.replace("{hint_text}", hint_text)
    return calc_str.replace(button_search_str, hint_code + "\n                    " + button_search_str)

button_search = "<div style={{ display: 'flex', gap: 8, marginTop: 16 }}>"

# Wait, `button_search` is exact for all of them. I should find it individually based on context.
# Or replace it in chunks using regex or split.

sections = calc.split("</button>\n                      <button \n")
# Actually, let's just do manual replace for each block based on the "onClick={() => handleAddToShopping("
# because that's unique.

hints = {
    "'Concreto', [": "Consulte a NBR 6118 (Projeto de Estruturas de Concreto) na Biblioteca para mais detalhes sobre recobrimento e dosagem.",
    "'Alvenaria', [": "Para especificações de prumo e assentamento, verifique o Manual de Execução de Alvenaria Estrutural.",
    "'Pintura', [": "Preparação e rendimento ótimo seguem a NBR 13245 (Preparação de Superfície).",
    "'Piso', [": "Assentamento de porcelanato: verifique a NBR 13753 na Biblioteca.",
    "'Reboco', [": "A espessura média do reboco (emboço) não deve exceder os limites da NBR 13749.",
    "'Telhado', [": "Para caimentos e sobreposição, consulte a NBR 15310 para telhas cerâmicas."
}

for key, hint_text in hints.items():
    # find the button div that precedes this key
    # It looks like:
    # <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
    #   <button 
    #     onClick={() => handleAddToShopping('Concreto', [
    
    # We can search backwards from `onClick={() => handleAddToShopping({key}` to find the `<div style={{ display: 'flex', gap: 8, marginTop: 16 }}>`
    idx = calc.find(key)
    if idx != -1:
        div_idx = calc.rfind("<div style={{ display: 'flex', gap: 8, marginTop: 16 }}>", 0, idx)
        if div_idx != -1:
            hint_code = hint_template.replace("{hint_text}", hint_text)
            calc = calc[:div_idx] + hint_code + "\n                    " + calc[div_idx:]

with open(calc_path, "w", encoding="utf-8") as f:
    f.write(calc)

print("Added Library hints to Calculators.")
