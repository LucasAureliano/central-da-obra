# Estratégia de Deploy e Versionamento

## Pipelines e CI/CD

O GitHub Actions gerencia as pipelines com fluxos estritos de Continuous Integration:
- Em cada Push na `main` ou `develop`, bem como em Pull Requests.
- Execução de testes de Lint e TypeScript.
- Escaneamento de vulnerabilidades (`npm audit`).
- Build de verificação de produção.

## Branching Strategy

A base de código utiliza um formato híbrido inspirado no GitFlow:
1. `main`: Ambiente de Produção.
2. `develop`: Ambiente de Staging / Integração.
3. `feature/*`: Novas implementações, criadas a partir de `develop`.
4. `hotfix/*`: Correções de emergência de produção, criadas a partir de `main`.

## Regras de Deploy
Como a CentralObra é um SaaS de mercado, o código em `main` deve estar perpetuamente *Deployable*.
- Secrets de produção são guardados única e exclusivamente no painel de Vercel (Frontend) e Cloud Functions (Backend).
- Publicação bloqueada via Husky caso o código contenha indícios de vazamento de Secrets antes mesmo de atingir a nuvem.
