# CentralObra

> Plataforma SaaS para gestão inteligente da construção civil.

*A CentralObra é um produto proprietário. Este repositório apresenta a arquitetura, funcionalidades e documentação do projeto para fins de portfólio. O código-fonte proprietário não está disponibilizado publicamente.*

---

## Sobre o projeto

A construção civil sofre com descentralização de informações, orçamentos estourados, comunicação fragmentada entre proprietários e prestadores, além da ausência de inteligência de dados nas tomadas de decisão de campo.

**CentralObra** é um Software as a Service (SaaS) criado para unificar e resolver esses problemas através de uma gestão 360º.

## Solução

A plataforma centraliza a jornada da construção:
- **Gestão de Obras**: Controle de múltiplas obras, status, prazos e equipes.
- **Financeiro & Custos**: DRE automatizado, controle de verbas, custos diretos e notas.
- **Suprimentos e Compras**: Fluxo de aprovação de orçamentos, cotação e lista de materiais.
- **Inteligência e BI**: Dashboards executivos, indicadores de saúde financeira e alertas em tempo real.
- **Copilot Inteligente**: Assistência embarcada que entende do negócio para sugerir ações (orçamentos, vistoria, mitigação de riscos).

## Perfis Atendidos

A aplicação possui um **RBAC (Role-Based Access Control)** flexível que adapta as permissões de acordo com o Tenant:

- 🏠 **Proprietário**: Acesso total às suas próprias obras, finanças e convites a profissionais.
- 👷 **Prestador de Serviços**: Ferramentas focadas na entrega (diário de obras, fotos, faturamento aprovado).
- 📐 **Arquiteto/Engenheiro**: Gestão técnica e delegada do cronograma.
- 🏢 **Construtora**: Acesso de nível corporativo (Enterprise) com BI consolidado.

## Tecnologias

A arquitetura foi selecionada para garantir escalabilidade, segurança e rápida iteração de produto:
- **Frontend**: React, TypeScript, Tailwind CSS, Vite.
- **Arquitetura**: Progressive Web App (PWA) Mobile-first.
- **Autenticação**: Firebase Authentication + App Check (ReCaptcha Enterprise).
- **Banco de Dados**: Firestore (NoSQL Real-Time) com Tenancy-Isolation.
- **Backend / APIs**: Vercel Serverless Functions + Firebase Admin SDK.
- **Infra/DevOps**: GitHub Actions (CI/CD) integrado.

## Funcionalidades e Telas (Demonstração)

*(Screenshots de demonstração serão inseridos nas sub-pastas do repositório público)*
1. **Painel do Proprietário**: Visão de Orçamento Consumido vs Planejado.
2. **Copilot**: Interface de Inteligência Artificial assistindo uma tomada de decisão sobre compras.
3. **Módulo de Compras**: Aprovação de orçamentos de fornecedores.
4. **Corporate BI (Construtora)**: Visão consolidada de todas as obras da empresa.

## Segurança

O projeto não expõe regras de negócio críticas ou segredos aos clientes:
- **Zero Trust**: Regras de Segurança (Firestore/Storage Rules) impedem que um usuário leia dados fora do seu escopo de permissão (Roles).
- **APIs Isoladas**: Processamento de IA, cruzamento de custos e chaves externas residem no backend (Vercel Functions).
- **Pre-commit Hooks**: Mecanismos rígidos de CI para coibir o envio acidental de chaves de API (`.env`).

## Roadmap

- [x] Arquitetura base e Autenticação Segura
- [x] Isolamento Multi-Tenant (Perfis e Regras)
- [x] Gestão Financeira e Compras
- [x] Inteligência Artificial Integrada (Copilot)
- [ ] Lançamento em Lojas Oficiais (App Store e Google Play)
- [ ] Integrações B2B Externas (APIs de Fornecedores)

## Status
> **Status atual:** Produto em fase final de homologação / preparação para lançamento fechado.
