# Security Policy

A CentralObra é um SaaS proprietário que valoriza a segurança dos dados dos seus usuários acima de tudo.

## Versões Suportadas

Atualmente, aplicamos patches de segurança e atualizações na versão mais recente disponível na branch `main`.

| Versão | Suportada          |
| -------| ------------------ |
| v1.0.x | :white_check_mark: |

## Reportando Vulnerabilidades

Se você encontrar qualquer vulnerabilidade de segurança, por favor não a divulgue publicamente.

Você pode enviar um relatório detalhado para o responsável pelo repositório (Lucas). Se a vulnerabilidade for validada, ela será corrigida em caráter de urgência.

Ao reportar uma vulnerabilidade, inclua:
- A URL ou local exato no código.
- Os passos para reproduzir o problema.
- O possível impacto e risco.

Garantimos sigilo e resposta rápida para problemas críticos (CVSS alto e crítico).

## Scanners e Proteções

Este repositório privado possui as seguintes camadas ativadas:
- **Secret Scanning** ativado no GitHub.
- **Push Protection** para impedir chaves vazadas.
- **Pre-commit Hooks** configurados localmente via `husky`.
