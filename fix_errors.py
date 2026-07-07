import os

works_path = r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\components\Works.tsx"

with open(works_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Remove compras block
start_compras = content.find("{/* TAB 2: COMPRAS */}")
start_financeiro = content.find("{/* TAB 3: FINANCEIRO */}")
start_cronograma = content.find("{/* NOVO: CRONOGRAMA */}")

if start_compras != -1 and start_cronograma != -1:
    content = content[:start_compras] + content[start_cronograma:]

# 2. Add Checklist block back before DIÁRIO
checklist_block = """
            {/* NOVO: CHECKLIST */}
            {activeTab === 'checklist' && (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="flex-space-between">
                  <h3 className="text-sm font-bold text-primary">Checklist de Execução</h3>
                  <span className="badge badge-orange">1/5 Concluído</span>
                </div>
                
                <div className="card-premium" style={{ padding: 0, overflow: 'hidden' }}>
                  <div style={{ padding: '8px 12px', backgroundColor: 'var(--bg-surface-hover)', borderBottom: '1px solid var(--border-light)', fontWeight: 'bold', fontSize: 12, color: 'var(--color-primary)' }}>
                    1. Fundação
                  </div>
                  <div className="flex-space-between" style={{ padding: '12px', borderBottom: '1px solid var(--border-light)' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, cursor: 'pointer' }}>
                      <input type="checkbox" checked={checklists.escavacao} onChange={() => setChecklists({...checklists, escavacao: !checklists.escavacao})} />
                      <span style={{ textDecoration: checklists.escavacao ? 'line-through' : 'none', color: checklists.escavacao ? 'var(--text-muted)' : 'var(--text-main)' }}>Escavação</span>
                    </label>
                  </div>
                  <div className="flex-space-between" style={{ padding: '12px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, cursor: 'pointer' }}>
                      <input type="checkbox" checked={checklists.compactacao} onChange={() => setChecklists({...checklists, compactacao: !checklists.compactacao})} />
                      <span style={{ textDecoration: checklists.compactacao ? 'line-through' : 'none', color: checklists.compactacao ? 'var(--text-muted)' : 'var(--text-main)' }}>Compactação</span>
                    </label>
                  </div>
                </div>
              </div>
            )}
"""

start_diario = content.find("{/* TAB 4: DIÁRIO */}")
if start_diario != -1:
    content = content[:start_diario] + checklist_block + content[start_diario:]


with open(works_path, "w", encoding="utf-8") as f:
    f.write(content)

# Fix unused imports in App.tsx
app_path = r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\App.tsx"
with open(app_path, "r", encoding="utf-8") as f:
    app_ts = f.read()
app_ts = app_ts.replace("Calculator, User, WifiOff,", "User, WifiOff,")
app_ts = app_ts.replace("RefreshCw, Database, Sparkles, ShoppingCart, FileText, Calendar, BarChart3, Bell, Search", "RefreshCw, Database, Sparkles, FileText, Calendar")
with open(app_path, "w", encoding="utf-8") as f:
    f.write(app_ts)

# Fix unused imports in Agenda.tsx
agenda_path = r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\components\Agenda.tsx"
with open(agenda_path, "r", encoding="utf-8") as f:
    agenda = f.read()
agenda = agenda.replace("Calendar as CalendarIcon, Clock, MapPin, User, ChevronRight", "MapPin, ChevronRight")
with open(agenda_path, "w", encoding="utf-8") as f:
    f.write(agenda)

# Fix unused imports in Quotes.tsx
quotes_path = r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\components\Quotes.tsx"
with open(quotes_path, "r", encoding="utf-8") as f:
    quotes = f.read()
quotes = quotes.replace("FileText, Plus, CheckCircle, Clock, Ban", "Plus, CheckCircle, Clock, Ban")
with open(quotes_path, "w", encoding="utf-8") as f:
    f.write(quotes)

# Fix unused imports in Team.tsx
team_path = r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\components\Team.tsx"
with open(team_path, "r", encoding="utf-8") as f:
    team = f.read()
team = team.replace("Users, UserPlus, Phone, Briefcase, MapPin", "UserPlus, Phone, Briefcase, MapPin")
with open(team_path, "w", encoding="utf-8") as f:
    f.write(team)

print("Errors fixed.")
