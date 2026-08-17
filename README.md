<p align="center">
  <img src="public/favicon.svg" alt="Central da Obra Logo" width="120" />
</p>

<h1 align="center">Central da Obra</h1>

<p align="center">
  <strong>Plataforma SaaS Inteligente para Gestão 360º da Construção Civil</strong>
</p>

<p align="center">
  <a href="#sobre-o-projeto">Sobre</a> •
  <a href="#solução">Solução</a> •
  <a href="#tecnologias">Tecnologias</a> •
  <a href="#funcionalidades-principais">Funcionalidades</a> •
  <a href="#segurança-e-privacidade">Segurança</a>
</p>

---

## 🏗️ Sobre o projeto

A indústria da construção civil sofre historicamente com a descentralização de informações, orçamentos imprecisos, comunicação fragmentada e falta de previsibilidade financeira em tempo real.

A **Central da Obra** é uma plataforma inovadora criada para resolver esses desafios, unificando proprietários, arquitetos, engenheiros, construtoras e prestadores de serviço em um único ecossistema inteligente e seguro.

## 🚀 Solução

O aplicativo atua como o sistema nervoso central de qualquer projeto de construção ou reforma, entregando:

- **Gestão Integrada:** Cronogramas detalhados, controle de progresso e alinhamento de equipes em tempo real.
- **Saúde Financeira:** Visão clara de orçamentos, custos reais (DRE), contas a pagar e despesas.
- **Suprimentos Simplificados:** Automação na cotação de materiais, aprovação de orçamentos e listas inteligentes.
- **Copilot IA:** Um assistente inteligente embarcado que entende do contexto da sua obra e oferece suporte para estimativas, mitigação de riscos e dicas construtivas.

## 👥 Perfis Atendidos (Multi-Tenant RBAC)

A plataforma se adapta instantaneamente às necessidades de cada usuário através de um robusto controle de acesso baseado em perfis (Role-Based Access Control):

- 🏠 **Proprietário:** Controle total financeiro, visão executiva do andamento e gestão de acessos.
- 📐 **Arquiteto / Engenheiro:** Ferramentas técnicas de projetos, gerenciamento de equipe e controle de qualidade.
- 👷 **Prestador de Serviço:** Diário de obra prático, envio de fotos de progresso e gestão de recebíveis.
- 🏢 **Construtora (Corporate):** Painel Enterprise (BI) com visão consolidada de todos os projetos simultâneos.

## 💻 Tecnologias

Arquitetura moderna, mobile-first e preparada para escalabilidade:

- **Frontend:** React 19, TypeScript, Tailwind CSS, Vite
- **Experiência:** PWA (Progressive Web App) para uso nativo off-line em dispositivos móveis.
- **Backend & APIs:** Vercel Serverless Functions para processamento isolado (IA, pagamentos, cálculos).
- **Banco de Dados:** Firebase Firestore (NoSQL Real-Time) com Tenancy-Isolation.
- **Autenticação:** Firebase Auth + App Check (Google ReCaptcha Enterprise).
- **Armazenamento:** Firebase Storage com regras rígidas de acesso a arquivos e plantas.

## ✨ Funcionalidades Principais

- **Painel Financeiro Avançado:** Acompanhe o saldo planejado vs. realizado de forma visual e intuitiva.
- **Central de Projetos:** Compartilhe, edite e valide projetos em tempo real (PDFs, DWGs e Imagens).
- **Diário de Obra:** Feed estilo rede-social com atualizações diárias, clima automatizado e fotos do andamento.
- **Bibliotecas Técnicas:** Calculadoras embutidas (Blondel, Tijolos, Tintas) e indexadores atualizados da construção civil.
- **Sistema de Convites:** Adicione profissionais à sua obra com apenas um link e defina o nível de acesso (Visualizador, Editor, Gerente).

## 🔒 Segurança e Privacidade

Seguimos as melhores práticas de mercado para garantir a proteção dos dados dos nossos usuários:

- **Zero Trust Architecture:** Todas as leituras e escritas são validadas por regras de segurança nativas (`firestore.rules` e `storage.rules`), garantindo que usuários leiam apenas dados onde têm permissão direta.
- **Nenhum Segredo Exposto:** Chaves de API, segredos de serviço e integrações sensíveis são mantidas estritamente do lado do servidor (Vercel Functions). O repositório não rastreia arquivos `.env`.
- **Prevenção contra Bots:** Acesso às APIs protegido por Firebase App Check.
- Para relatar vulnerabilidades, leia nosso [SECURITY.md](./SECURITY.md).

---

<p align="center">
  <i>Desenvolvido com foco na excelência e na modernização da construção civil.</i>
</p>
