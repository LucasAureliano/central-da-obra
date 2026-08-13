# Changelog

Todas as mudanças notáveis deste projeto (SaaS CentralObra) serão documentadas neste arquivo.

O formato baseia-se em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [Unreleased]

### Adicionado
- Preparação de Infraestrutura e Arquitetura de Produção.
- Setup inicial da branch `main` e `develop`.
- Configuração de CI/CD (GitHub Actions).
- Script `check-secrets.js` ativado via Husky (`pre-commit`) para proteção de chaves (Fase 20).
- Firestore Security Rules e Storage Rules para isolamento total de tenantes e proteção rigorosa de arquivos sensíveis.
- Módulos avançados do Copilot da Obra e Assistente de Cálculo com arquitetura de backend.

### Modificado
- Revisão completa do frontend para uso de tokens administrativos seguros ao invés de chaves expostas nas chamadas à API `api/prices.ts`.
- Limpeza do `.env.example`.
- Tratamento correto de Visitantes (Guest Users) evitando gravação e leitura não-autorizada no banco.

## [1.0.0] - A ser definido

Lançamento inicial planejado do SaaS nas plataformas Web (PWA) e Stores.
