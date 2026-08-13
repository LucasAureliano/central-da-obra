# QA Report Final — Fase 21 (Beta Ready)

## Resumo
**Testes Executados:** 0/50+
**Recomendação Atual:** 🔴 Não pronto (QA em andamento)

## Bugs Encontrados (P0, P1, P2, P3)
| ID | Perfil | Módulo | Problema | Severidade | Status |
|---|---|---|---|---|---|
| - | - | - | - | - | - |

---

## Matriz de QA

| Área | Teste | Resultado Esperado | Status |
|---|---|---|---|
| Auth | Cadastrar | Nova conta criada e persistida no Firebase | ⏳ Pendente |
| Auth | Login (Email) | Entrar na conta com sucesso | ⚠️ Bloqueado (Sem Credenciais) |
| Auth | Login (Google) | Autenticação unificada, sem retorno ao login | ⚠️ Bloqueado (Sem Credenciais) |
| Auth | Logout | Modal de confirmação, sessão encerrada e redirecionamento | ⚠️ Bloqueado (Sem Credenciais) |
| Visitante | Fallback Interativo | Login de Visitante flui até Dashboard, Obras locais | ✅ Passou |
| Obras | Criar Obra | Obra gravada, persistência após Refresh e relogin | ⚠️ Bloqueado (Sem Credenciais Firebase) |
| Obras | Obra Principal | Alterar obra principal reflete no Dashboard instantaneamente | ⚠️ Bloqueado |
| Obras | Excluir Obra | Modal de confirmação, dados órfãos removidos | ⚠️ Bloqueado |
| Financeiro | Criar Despesa | Gasto reflete no Saldo, Total e Home | ⚠️ Bloqueado |
| Financeiro | Excluir Despesa | Valores revertidos corretamente | ⚠️ Bloqueado |
| Cronograma | Etapas | Adicionar, arrastar, concluir etapas e reabrir | ⚠️ Bloqueado |
| Cronograma | Progresso | Percentual na UI baseado no número real de itens concluídos | ⚠️ Bloqueado |
| Cronograma | Atrasos | Indicador vermelho e dias de atraso atualizados | ⚠️ Bloqueado |
| Compras | Criar Compra | Obra e Totais atualizados; Mudança de status pendente > comprado | ⚠️ Bloqueado |
| Orçamentos | Gerar PDF | PDF formatado, sem tela travada, usando logotipo e valores do Firestore | ⚠️ Bloqueado |
| Inteligência | Calculadoras | Resposta, histórico sem mocks, cálculo real e fallback de API | ⚠️ Bloqueado |
| Calculadoras | Calcular Cimento | Input -> Cálculo com perda -> Exportar PDF/Salvar | ⚠️ Bloqueado |
| Calculadoras | Exportação PDF | Arquivo com logo, dados da obra, formatação | ⚠️ Bloqueado |
| Corporate BI | Dashboard | Leitura condicional (companyId) ao invés de dados mockados globais | ⚠️ Bloqueado |
| Perfil | Switch de Contexto | Regras limitam a UI do Proprietário vs Prestador vs Construtora | ⚠️ Bloqueado |
| Sistema | Empty States | Toda lista sem dados mostra Empty State e CTA amigável, zero tabelas falsas | ⚠️ Bloqueado |
| Sistema | Performance/Sessão | Troca de abas não quebra sincronização em tempo real (onSnapshot) | ⚠️ Bloqueado |

> **Notas de Encerramento (Fase 22):** A automação do modo Visitante obteve sucesso, contudo, os testes do E2E (`test_core_features.py` e `test_auth_firestore.py`) foram formalmente bloqueados na esteira, pois a aplicação valida chaves válidas de Firestore e as variáveis de ambiente `.env` não foram fornecidas. Como manda a regra de ouro: "Funcionalidade 'feita' apenas quando testada e persistida no sistema real (Firebase)", a bateria completa aguardará o provisionamento de infra.

## Testes Aprovados
*(Nenhum ainda)*

## Testes Pendentes
- Todos os testes da matriz.

## Riscos
- Mocks não identificados ainda ativos em painéis complexos.
