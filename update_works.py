import os

path = r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src\components\Works.tsx"

with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace state variables
old_state = """  // New Work Form state
  const [newName, setNewName] = useState('');
  const [newClient, setNewClient] = useState('');
  const [newBudget, setNewBudget] = useState('150000');
  const [newDeadline, setNewDeadline] = useState('25/12/2026');
  const [newAddress, setNewAddress] = useState('');"""

new_state = """  // New Work Form state (Simplified)
  const [newName, setNewName] = useState('');
  const [newClient, setNewClient] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newType, setNewType] = useState('Residencial');"""

content = content.replace(old_state, new_state)

# Replace handleCreate
old_handle = """  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateWork({
      name: newName,
      client: newClient,
      budget: parseFloat(newBudget) || 0,
      deadline: newDeadline,
      address: newAddress,
      progress: 0,
      status: 'Planejamento'
    });
    setIsCreating(false);
    // Reset form
    setNewName('');
    setNewClient('');
    setNewAddress('');
  };"""

new_handle = """  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateWork({
      name: newName,
      client: newClient,
      budget: 0, // Definido depois
      deadline: 'A definir', // Definido depois
      address: newCity, // Temporariamente salva a cidade no endereço
      progress: 0,
      status: 'Planejamento'
    });
    setIsCreating(false);
    // Reset form
    setNewName('');
    setNewClient('');
    setNewCity('');
  };"""

content = content.replace(old_handle, new_handle)

# Replace form HTML
old_form = """              <div className="input-group" style={{ marginBottom: 0 }}>
                <span className="input-label">Orçamento Total (R$)</span>
                <input type="number" placeholder="Ex: 250000" value={newBudget} onChange={(e) => setNewBudget(e.target.value)} className="input-field" style={{ paddingLeft: 12 }} required />
              </div>

              <div className="input-group" style={{ marginBottom: 0 }}>
                <span className="input-label">Prazo Final</span>
                <input type="text" placeholder="Ex: 25/12/2026" value={newDeadline} onChange={(e) => setNewDeadline(e.target.value)} className="input-field" style={{ paddingLeft: 12 }} required />
              </div>

              <div className="input-group" style={{ marginBottom: 0 }}>
                <span className="input-label">Endereço</span>
                <input type="text" placeholder="Rua das Palmeiras, 120" value={newAddress} onChange={(e) => setNewAddress(e.target.value)} className="input-field" style={{ paddingLeft: 12 }} required />
              </div>"""

new_form = """              <div className="input-group" style={{ marginBottom: 0 }}>
                <span className="input-label">Cidade</span>
                <input type="text" placeholder="Ex: São Paulo" value={newCity} onChange={(e) => setNewCity(e.target.value)} className="input-field" style={{ paddingLeft: 12 }} required />
              </div>

              <div className="input-group" style={{ marginBottom: 0 }}>
                <span className="input-label">Tipo da Obra</span>
                <select value={newType} onChange={(e) => setNewType(e.target.value)} className="input-field" style={{ paddingLeft: 12 }} required>
                  <option value="Residencial">Construção Residencial</option>
                  <option value="Comercial">Construção Comercial</option>
                  <option value="Reforma">Reforma Geral</option>
                </select>
              </div>"""

content = content.replace(old_form, new_form)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("Works.tsx form simplified")
