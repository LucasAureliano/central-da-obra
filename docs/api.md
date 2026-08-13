# APIs CentralObra

O Frontend consome chamadas REST isoladas do Vercel Serverless Functions (`api/`) para processos sensíveis que não podem rodar no lado do cliente.

## 1. Segurança das Requisições
- Todas as APIs exigem validação Auth Bearer baseada em JWT Firebase (`Authorization: Bearer <token>`).
- Rejeição ativa de origens desconhecidas através de CORS explícito (em produção).
- Timeouts definidos para evitar abuse de conexões (Ex: Máximo 10s em `/api/prices`).

## 2. API de Integração de Preços (`api/prices`)
- **Propósito**: Integrar base de preços para calculadoras e geração de custos e orçamentos.
- **Proteção**: A chave real da API externa, se houver, nunca sai da Vercel Function.
- **Escabilidade**: Servida de forma paralela, permite busca unificada para os componentes Frontend.

## 3. Integração AI (Planejado)
A arquitetura base foi projetada para que os próximos serviços como Inteligência Artificial ou Geração Dinâmica de Plantas funcionem através deste modelo seguro `Client ➔ JWT ➔ API Vercel ➔ Third Party API`.
