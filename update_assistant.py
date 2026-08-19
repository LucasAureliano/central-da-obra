import sys

with open('src/components/assistant/SmartAssistant.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Add imports
if "assistantService" not in text:
    text = text.replace("import { formatCurrency } from '../../utils/formatters';", "import { formatCurrency } from '../../utils/formatters';\nimport { assistantService } from '../../services/assistant/AssistantService';")

# Lock mechanism
if "const isPremium =" not in text:
    text = text.replace("const currentWork = profile?.role === 'owner' ? primaryWork : activeWork;", "const currentWork = profile?.role === 'owner' ? primaryWork : activeWork;\n  const isPremium = profile?.subscriptionPlan === 'pro' || profile?.subscriptionPlan === 'business' || profile?.isAdmin;")

lock_ui = """
  if (!isPremium) {
    return (
      <div className="screen-content animate-fade-in" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, height: '100%' }}>
        <div className="glass-panel" style={{ maxWidth: 400, textAlign: 'center', padding: 40, borderRadius: 24 }}>
          <div style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <Sparkles size={40} color="#8B5CF6" />
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-main)', marginBottom: 12 }}>CentralObra Copilot</h2>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 32 }}>
            Sua Inteligência Artificial especialista em engenharia e gestão de obras. Desbloqueie dicas de materiais, normas, revisão de cronograma e muito mais.
          </p>
          <button className="btn-primary" onClick={() => onNavigate('planos')} style={{ width: '100%', padding: 16, borderRadius: 16, fontWeight: 800, fontSize: 16 }}>
            Fazer Upgrade para o PRO
          </button>
        </div>
      </div>
    );
  }
"""

if "if (!isPremium)" not in text:
    text = text.replace("  return (\n    <div className=\"screen-content\"", lock_ui + "\n  return (\n    <div className=\"screen-content\"")


# Replace handleSend
start_idx = text.find('  const handleSend = (text: string) => {')
end_idx = text.find('    }, 800);\n  };\n', start_idx) + len('    }, 800);\n  };\n')

new_handle_send = """  const handleSend = async (text: string) => {
    if (!text.trim() || isTyping) return;
    
    setMessages(prev => [...prev, { role: 'user', text }]);
    setQuery('');
    setIsTyping(true);

    try {
      const response = await assistantService.sendMessage({
        text,
        contextData: {
          currentWorkId: currentWork?.id,
          role: profile?.role
        }
      });
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: response.answer,
        suggestions: response.suggestions.map((s: any) => ({
          label: s.label,
          action: () => onNavigate(s.actionKey, s.actionParam),
          icon: <Sparkles size={16} />
        }))
      }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, {
        role: 'assistant',
        text: 'Desculpe, ocorreu um erro ao conectar com o Copilot. Tente novamente mais tarde.'
      }]);
    } finally {
      setIsTyping(false);
    }
  };
"""

text = text[:start_idx] + new_handle_send + text[end_idx:]

with open('src/components/assistant/SmartAssistant.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
