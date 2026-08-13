# Arquitetura CentralObra

A CentralObra é construída sob uma arquitetura serverless de duas camadas (Frontend + Backend), projetada para escalabilidade e segurança do SaaS.

## 1. Camada de Frontend (Cliente)
- **Tecnologias**: React, TypeScript, Vite, Tailwind CSS.
- **PWA Ready**: Arquitetura modular que suporta instalação como Web App, Android e iOS no futuro.
- **Isolamento de Lógica**: O frontend é responsável estritamente por renderização (UI/UX) e consumo de APIs. Segredos e lógicas core (como IA e geração avançada de PDF) não são expostas ao cliente.
- **Hospedagem**: Arquivos estáticos servidos via CDN rápida.

## 2. Camada de Backend (Serverless & APIs)
- **Firebase Services**:
  - **Firestore**: Banco de dados NoSQL em tempo real.
  - **Authentication**: Gerenciamento de identidade (E-mail, Google).
  - **Storage**: Armazenamento de arquivos e documentos protegido.
- **Cloud Functions / Vercel API**: Lógica de backend rodando em contêineres serverless.
  - O processamento pesado (geração de métricas globais), integração com IA (Copilot) e integração com APIs de preço são retidos estritamente no backend.
  - Protegido por Firebase Admin SDK. O frontend fornece um Token JWT para atestar a identidade.

## 3. Isolamento entre Dispositivos (Cross-platform)
A arquitetura de sincronização via Firestore garante que a mesma conta funcione simultaneamente no Desktop (Web), Celular (PWA) e Tablet. A UI responsiva e os layouts dedicados garantem a melhor experiência sem duplicar a lógica de dados.

## 4. Segurança do Sistema
Ver `security.md` para detalhes aprofundados sobre a arquitetura de Tenancy e Firebase Rules.
