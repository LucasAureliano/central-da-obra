import os
import re

src_dir = r"C:\Users\Lucas\.gemini\antigravity\scratch\central-da-obra\src"
components_dir = os.path.join(src_dir, "components")

def write_component(name, content):
    with open(os.path.join(components_dir, f"{name}.tsx"), "w", encoding="utf-8") as f:
        f.write(content)

# 1. Team.tsx
team_content = """import React from 'react';
import { Users, UserPlus, Phone, Briefcase, MapPin } from 'lucide-react';

export const Team: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-white">Gestão de Equipe</h2>
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center font-medium transition-colors">
          <UserPlus size={20} className="mr-2" />
          Novo Funcionário
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { name: 'João Silva', role: 'Mestre de Obras', phone: '(11) 98765-4321', rate: 'R$ 250/dia', status: 'Em obra' },
          { name: 'Carlos Santos', role: 'Pedreiro', phone: '(11) 91234-5678', rate: 'R$ 180/dia', status: 'Disponível' },
          { name: 'Roberto Alves', role: 'Eletricista', phone: '(11) 99988-7766', rate: 'R$ 200/dia', status: 'Em obra' }
        ].map((emp, i) => (
          <div key={i} className="bg-slate-800 p-5 rounded-xl border border-slate-700 hover:border-orange-500/50 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center mr-3">
                  <UserPlus className="text-orange-400" />
                </div>
                <div>
                  <h3 className="font-medium text-white">{emp.name}</h3>
                  <p className="text-sm text-slate-400">{emp.role}</p>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full font-medium ${emp.status === 'Em obra' ? 'bg-orange-500/20 text-orange-400' : 'bg-green-500/20 text-green-400'}`}>
                {emp.status}
              </span>
            </div>
            
            <div className="space-y-2 text-sm text-slate-300">
              <div className="flex items-center">
                <Phone size={16} className="mr-2 text-slate-500" />
                {emp.phone}
              </div>
              <div className="flex items-center">
                <Briefcase size={16} className="mr-2 text-slate-500" />
                Diária: {emp.rate}
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between">
              <button className="text-sm text-slate-400 hover:text-white transition-colors">Ver Perfil</button>
              <button className="text-sm text-orange-400 hover:text-orange-300 transition-colors font-medium">Vincular a Obra</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
"""
write_component("Team", team_content)

# 2. Quotes.tsx (Orçamentos e Contratos)
quotes_content = """import React, { useState } from 'react';
import { FileText, Plus, Download, FileSignature, CheckCircle } from 'lucide-react';

export const Quotes: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'quotes' | 'contracts'>('quotes');

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-2xl font-semibold text-white mb-4 md:mb-0">Orçamentos & Contratos</h2>
        <div className="flex space-x-2">
          <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center transition-colors">
            <FileSignature size={20} className="mr-2" />
            <span className="hidden sm:inline ml-2">Novo Contrato</span>
          </button>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center font-medium transition-colors">
            <Plus size={20} className="mr-2" />
            <span className="hidden sm:inline ml-2">Novo Orçamento</span>
          </button>
        </div>
      </div>

      <div className="flex border-b border-slate-700 mb-6">
        <button 
          onClick={() => setActiveTab('quotes')}
          className={`pb-3 px-4 font-medium transition-colors relative ${activeTab === 'quotes' ? 'text-orange-400' : 'text-slate-400 hover:text-white'}`}
        >
          Orçamentos
          {activeTab === 'quotes' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 rounded-t-md"></div>}
        </button>
        <button 
          onClick={() => setActiveTab('contracts')}
          className={`pb-3 px-4 font-medium transition-colors relative ${activeTab === 'contracts' ? 'text-orange-400' : 'text-slate-400 hover:text-white'}`}
        >
          Contratos
          {activeTab === 'contracts' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500 rounded-t-md"></div>}
        </button>
      </div>

      {activeTab === 'quotes' ? (
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/50 text-slate-400 text-sm border-b border-slate-700">
                <th className="p-4 font-medium whitespace-nowrap">Cliente/Obra</th>
                <th className="p-4 font-medium whitespace-nowrap">Data</th>
                <th className="p-4 font-medium whitespace-nowrap">Valor Total</th>
                <th className="p-4 font-medium whitespace-nowrap">Status</th>
                <th className="p-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr className="border-b border-slate-700 hover:bg-slate-700/30 transition-colors">
                <td className="p-4 whitespace-nowrap">
                  <p className="font-medium text-white">Reforma Residencial</p>
                  <p className="text-slate-400 text-xs">Cliente: Carlos Mendes</p>
                </td>
                <td className="p-4 text-slate-300">15/07/2026</td>
                <td className="p-4 text-white font-medium">R$ 45.000,00</td>
                <td className="p-4">
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium flex items-center w-max">
                    <CheckCircle size={12} className="mr-1" /> Aprovado
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button className="p-2 text-slate-400 hover:text-orange-400 transition-colors" title="Exportar PDF">
                    <Download size={18} />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
           {['Contrato de Empreitada', 'Contrato de Reforma', 'Prestação de Serviços'].map((title, i) => (
             <div key={i} className="bg-slate-800 p-5 rounded-xl border border-slate-700 flex flex-col h-full hover:border-orange-500/50 transition-colors">
               <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center mb-4 text-orange-400">
                 <FileText size={20} />
               </div>
               <h3 className="font-medium text-white mb-2">{title}</h3>
               <p className="text-sm text-slate-400 mb-6 flex-grow">Gere automaticamente um contrato preenchido com os dados da obra e do cliente.</p>
               <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg text-sm transition-colors font-medium">
                 Gerar Documento
               </button>
             </div>
           ))}
        </div>
      )}
    </div>
  );
};
"""
write_component("Quotes", quotes_content)


# 3. Agenda.tsx
agenda_content = """import React from 'react';
import { Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';

export const Agenda: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-white">Agenda Global</h2>
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center font-medium transition-colors">
          Novo Evento
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-800 rounded-xl border border-slate-700 p-6 flex items-center justify-center min-h-[400px]">
          <div className="text-center text-slate-400">
            <CalendarIcon size={48} className="mx-auto mb-4 text-slate-600" />
            <p>A visualização de calendário completo estaria aqui.</p>
            <p className="text-sm mt-2">Neste protótipo, listamos os eventos ao lado.</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-lg text-white mb-4">Próximos Eventos</h3>
          
          {[
            { title: 'Reunião com Cliente', time: 'Hoje, 14:00', type: 'Reunião', color: 'bg-blue-500' },
            { title: 'Entrega de Cimento', time: 'Amanhã, 08:30', type: 'Entrega', color: 'bg-orange-500' },
            { title: 'Vistoria da Caixa', time: 'Sexta, 10:00', type: 'Visita', color: 'bg-purple-500' },
            { title: 'Pagamento Equipe', time: 'Dia 05', type: 'Financeiro', color: 'bg-green-500' }
          ].map((event, i) => (
            <div key={i} className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex">
              <div className={`w-1.5 rounded-full ${event.color} mr-4`}></div>
              <div>
                <h4 className="font-medium text-white text-sm">{event.title}</h4>
                <div className="flex items-center text-xs text-slate-400 mt-2 space-x-3">
                  <span className="flex items-center"><Clock size={12} className="mr-1" /> {event.time}</span>
                  <span className="px-2 py-0.5 bg-slate-700 rounded-full">{event.type}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
"""
write_component("Agenda", agenda_content)

# Update Works.tsx to include Gantt, Checklist, Gallery, Weather
works_path = os.path.join(components_dir, "Works.tsx")
with open(works_path, "r", encoding="utf-8") as f:
    works_code = f.read()

# We will inject some tabs and mock content into Works.tsx using string replacement
works_new_code = works_code.replace(
    "const [activeTab, setActiveTab] = useState<'summary' | 'materials' | 'shopping' | 'financial'>('summary');",
    "const [activeTab, setActiveTab] = useState<'summary' | 'gantt' | 'checklist' | 'gallery' | 'weather'>('summary');\n  const [checklists, setChecklists] = useState<{[key: string]: boolean}>({'escavacao': true, 'compactacao': false});"
).replace(
    "          <button onClick={() => setActiveTab('summary')} className={`whitespace-nowrap px-1 py-4 border-b-2 font-medium text-sm transition-colors ${activeTab === 'summary' ? 'border-orange-500 text-orange-400' : 'border-transparent text-slate-400 hover:text-slate-300 hover:border-slate-300'}`}>Resumo</button>",
    """          <button onClick={() => setActiveTab('summary')} className={`whitespace-nowrap px-1 py-4 border-b-2 font-medium text-sm transition-colors ${activeTab === 'summary' ? 'border-orange-500 text-orange-400' : 'border-transparent text-slate-400 hover:text-slate-300'}`}>Resumo</button>
          <button onClick={() => setActiveTab('gantt')} className={`whitespace-nowrap px-1 py-4 border-b-2 font-medium text-sm transition-colors ${activeTab === 'gantt' ? 'border-orange-500 text-orange-400' : 'border-transparent text-slate-400 hover:text-slate-300'}`}>Cronograma</button>
          <button onClick={() => setActiveTab('checklist')} className={`whitespace-nowrap px-1 py-4 border-b-2 font-medium text-sm transition-colors ${activeTab === 'checklist' ? 'border-orange-500 text-orange-400' : 'border-transparent text-slate-400 hover:text-slate-300'}`}>Checklist</button>
          <button onClick={() => setActiveTab('gallery')} className={`whitespace-nowrap px-1 py-4 border-b-2 font-medium text-sm transition-colors ${activeTab === 'gallery' ? 'border-orange-500 text-orange-400' : 'border-transparent text-slate-400 hover:text-slate-300'}`}>Galeria</button>
          <button onClick={() => setActiveTab('weather')} className={`whitespace-nowrap px-1 py-4 border-b-2 font-medium text-sm transition-colors ${activeTab === 'weather' ? 'border-orange-500 text-orange-400' : 'border-transparent text-slate-400 hover:text-slate-300'}`}>Clima & Docs</button>
"""
).replace(
    "{activeTab === 'summary' && (",
    """{activeTab === 'gantt' && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="text-lg font-medium text-white mb-4">Cronograma Visual (Gantt)</h3>
              <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
                {[{name: 'Fundação', p: 100}, {name: 'Alvenaria', p: 65}, {name: 'Cobertura', p: 20}].map((s,i) => (
                  <div key={i} className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white font-medium">{s.name}</span>
                      <span className="text-orange-400">{s.p}%</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-4 overflow-hidden border border-slate-700">
                      <div className="bg-orange-500 h-4 rounded-full transition-all duration-1000 relative" style={{width: `${s.p}%`}}>
                        <div className="absolute inset-0 bg-white/20 w-full" style={{backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)', backgroundSize: '1rem 1rem'}}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'checklist' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-white">Checklist de Execução</h3>
                <span className="text-sm bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full">1/5 Concluído</span>
              </div>
              <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                <div className="p-3 bg-slate-900/80 font-medium text-orange-400 border-b border-slate-700">1. Fundação</div>
                <div className="p-4 border-b border-slate-700 flex items-center space-x-3 hover:bg-slate-700/30 transition-colors">
                  <input type="checkbox" checked={checklists.escavacao} onChange={() => setChecklists({...checklists, escavacao: !checklists.escavacao})} className="w-5 h-5 rounded border-slate-600 text-orange-500 focus:ring-orange-500 bg-slate-900 accent-orange-500 cursor-pointer" />
                  <span className={checklists.escavacao ? 'line-through text-slate-500' : 'text-white'}>Escavação</span>
                </div>
                <div className="p-4 flex items-center space-x-3 hover:bg-slate-700/30 transition-colors">
                  <input type="checkbox" checked={checklists.compactacao} onChange={() => setChecklists({...checklists, compactacao: !checklists.compactacao})} className="w-5 h-5 rounded border-slate-600 text-orange-500 focus:ring-orange-500 bg-slate-900 accent-orange-500 cursor-pointer" />
                  <span className={checklists.compactacao ? 'line-through text-slate-500' : 'text-white'}>Compactação e Apiloamento</span>
                </div>
                <div className="p-4 flex items-center space-x-3 border-t border-slate-700 hover:bg-slate-700/30 transition-colors">
                  <input type="checkbox" className="w-5 h-5 rounded border-slate-600 text-orange-500 focus:ring-orange-500 bg-slate-900 accent-orange-500 cursor-pointer" />
                  <span className="text-white">Formas e Ferragens</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-white">Galeria da Obra</h3>
                <button className="text-sm bg-orange-500 text-white px-3 py-1.5 rounded-lg flex items-center"><Camera size={16} className="mr-1"/> Adicionar Foto</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="aspect-square bg-slate-700 rounded-lg overflow-hidden relative group">
                    <img src={`https://picsum.photos/400/400?random=${i}`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="Obra" />
                    <div className="absolute bottom-2 left-2 bg-black/60 px-2 py-0.5 rounded text-xs text-white">25/08/2026</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'weather' && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-900/20 rounded-xl border border-blue-500/30 p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 text-blue-400 opacity-20">
                    <Cloud size={64} />
                  </div>
                  <h3 className="font-medium text-white mb-4 relative z-10">Clima Local</h3>
                  <div className="flex items-center justify-between relative z-10">
                    <div>
                      <div className="text-4xl font-bold text-white mb-1">28°C</div>
                      <div className="text-blue-300 text-sm">Ensolarado • 10% chance de chuva</div>
                      <div className="text-blue-400 text-xs mt-2">Vento: 15km/h • Umidade: 60%</div>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
                  <h3 className="font-medium text-white mb-4">Documentos da Obra</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-slate-900/50 hover:bg-slate-700 rounded-lg cursor-pointer transition-colors border border-slate-700">
                      <span className="text-sm text-white flex items-center"><FileText className="w-4 h-4 mr-2 text-red-400" /> Projeto_Arquitetonico.pdf</span>
                      <Download size={16} className="text-slate-400" />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-900/50 hover:bg-slate-700 rounded-lg cursor-pointer transition-colors border border-slate-700">
                      <span className="text-sm text-white flex items-center"><FileText className="w-4 h-4 mr-2 text-blue-400" /> ART_Engenheiro.pdf</span>
                      <Download size={16} className="text-slate-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'summary' && ("""
)

# Also ensure Camera, Cloud, FileText, Download are imported in Works.tsx
works_new_code = works_new_code.replace(
    "import { MapPin, Calendar, Users, DollarSign, Clock, CheckCircle2, AlertTriangle, ArrowUpRight, TrendingUp } from 'lucide-react';",
    "import { MapPin, Calendar, Users, DollarSign, Clock, CheckCircle2, AlertTriangle, ArrowUpRight, TrendingUp, Camera, Cloud, FileText, Download } from 'lucide-react';"
)

with open(works_path, "w", encoding="utf-8") as f:
    f.write(works_new_code)


# Update App.tsx to include the new navigation items
app_path = os.path.join(src_dir, "App.tsx")
with open(app_path, "r", encoding="utf-8") as f:
    app_code = f.read()

app_new_code = app_code.replace(
    "import { Profile } from './components/Profile';",
    "import { Profile } from './components/Profile';\nimport { Team } from './components/Team';\nimport { Quotes } from './components/Quotes';\nimport { Agenda } from './components/Agenda';"
).replace(
    "type ViewState = 'dashboard' | 'works' | 'calculators' | 'financial' | 'shopping' | 'profile' | 'reports';",
    "type ViewState = 'dashboard' | 'works' | 'calculators' | 'financial' | 'shopping' | 'profile' | 'reports' | 'team' | 'quotes' | 'agenda';"
).replace(
    "        {activeView === 'financial' && <Financial />}",
    "        {activeView === 'financial' && <Financial />}\n        {activeView === 'team' && <Team />}\n        {activeView === 'quotes' && <Quotes />}\n        {activeView === 'agenda' && <Agenda />}"
)

# Need to update the sidebar items
sidebar_items = """
          <nav className="flex-grow py-4 px-3 space-y-1 overflow-y-auto">
            <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-4">Principal</h3>
            <NavItem id="dashboard" icon={<Home size={20} />} label="Dashboard" />
            <NavItem id="works" icon={<HardHat size={20} />} label="Obras & Projetos" />
            
            <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-6">Gestão</h3>
            <NavItem id="team" icon={<User size={20} />} label="Equipe" />
            <NavItem id="quotes" icon={<FileText size={20} />} label="Orçamentos" />
            <NavItem id="agenda" icon={<Calendar size={20} />} label="Agenda" />
            
            <h3 className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-6">Ferramentas</h3>
            <NavItem id="calculators" icon={<Calculator size={20} />} label="Calculadoras" />
            <NavItem id="financial" icon={<BarChart3 size={20} />} label="Financeiro" />
            <NavItem id="shopping" icon={<ShoppingCart size={20} />} label="Compras" />
"""
# Replace the original nav with the expanded one
import re
app_new_code = re.sub(r'<nav className="flex-grow py-6 px-3 space-y-2">.*?</nav>', sidebar_items + '</nav>', app_new_code, flags=re.DOTALL)
app_new_code = app_new_code.replace("import { \n  Home, HardHat, Calculator, User, WifiOff, \n  RefreshCw, Database, Sparkles, ShoppingCart \n} from 'lucide-react';", "import { \n  Home, HardHat, Calculator, User, WifiOff, \n  RefreshCw, Database, Sparkles, ShoppingCart, FileText, Calendar, BarChart3, Bell, Search \n} from 'lucide-react';")

# Add Top Header elements (Search, Notifications)
header_html = """
        <header className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-20">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <div className="flex items-center flex-1">
              <div className="relative w-full max-w-md hidden md:block">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-slate-500" />
                </div>
                <input type="text" className="block w-full pl-10 pr-3 py-2 border border-slate-700 rounded-lg leading-5 bg-slate-800 text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm" placeholder="Buscar obras, materiais, clientes..." />
              </div>
              <h1 className="text-xl font-bold text-white md:hidden">Central da Obra</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="text-slate-400 hover:text-white transition-colors relative">
                <Bell size={24} />
                <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-orange-500 ring-2 ring-slate-900"></span>
              </button>
              <div className="flex items-center space-x-3 border-l border-slate-700 pl-4 cursor-pointer hover:opacity-80 transition-opacity">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-white">Eng. Lucas</p>
                  <p className="text-xs text-slate-400">Plano Pro</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold border-2 border-slate-800">
                  L
                </div>
              </div>
            </div>
          </div>
        </header>
"""
app_new_code = re.sub(r'<header className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-10">.*?</header>', header_html, app_new_code, flags=re.DOTALL)

with open(app_path, "w", encoding="utf-8") as f:
    f.write(app_new_code)
