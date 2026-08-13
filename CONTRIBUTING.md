# Contribuindo para a CentralObra

Obrigado pelo seu interesse! **A CentralObra é um produto proprietário (SaaS) e este repositório é estritamente privado e não-comercializável publicamente.**

Como este projeto é desenvolvido por uma equipe interna, este guia destina-se a alinhar o fluxo de trabalho dos desenvolvedores autorizados.

## Fluxo de Trabalho (Git Flow Simplificado)

Trabalhamos com o fluxo de pull requests baseado em branches.

1. **Main**: Representa a versão estável em produção. Não fazer commit direto na `main`.
2. **Develop**: Representa a versão de homologação/integração.
3. **Features/Fixes**: Crie branches a partir da `develop` no padrão:
   - `feature/nome-da-feature`
   - `fix/nome-do-bug`
   - `hotfix/nome-da-correcao` (criadas a partir da `main` apenas quando urgente)

## Padrões de Código

- Usamos **TypeScript** rigoroso, não use `any` a menos que estritamente necessário.
- Componentes funcionais usando React Hooks.
- Estilização local no componente e via utilitários do App, focada em Glassmorphism e minimalismo premium.
- Lógica de negócio, validações fortes e segredos devem ficar no back-end (Cloud Functions) e protegidos via Firebase Security Rules.

## Segredos e Configurações

**NUNCA adicione chaves de APIs ou senhas (secrets) no código ou em commits.**
- Use `.env.example` para declarar quais chaves são necessárias no projeto.
- Cada desenvolvedor deve possuir seu `.env.local` configurado e este arquivo já se encontra no `.gitignore`.
- O hook de pré-commit automático (`husky`) fará a checagem e impedirá a publicação acidental de segredos, mas revise sempre seus diffs.

## Pull Requests

1. Todas as branches de `feature/` e `fix/` devem abrir Pull Request (PR) contra a `develop`.
2. O Pipeline do CI/CD rodará automaticamente.
3. PRs só podem ser mergiados (aprovados) se:
   - Os testes passarem.
   - O Lint e o Type Check não possuírem erros críticos.
   - Nenhuma vulnerabilidade ou "secret leakage" for detectada.
