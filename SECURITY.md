# Security Policy

## Supported Versions

Central da Obra maintains active support and security updates for the current production environment. Because it is a SaaS application, users are always served the latest secure version.

| Version | Supported          |
| ------- | ------------------ |
| Main (v1.x.x) | :white_check_mark: |
| Legacy | :x:                |

## Reporting a Vulnerability

We take the security of Central da Obra and our users' data very seriously.

If you discover a vulnerability or a security issue, please **DO NOT** create a public issue or discussion on GitHub. Instead, report it privately to our security team to ensure we can patch it safely before it becomes public knowledge.

**How to report:**
1. Send an email to [security@centralobra.com](mailto:security@centralobra.com) (or the repository owner's direct contact).
2. Include a detailed description of the vulnerability.
3. Provide steps to reproduce the issue, if possible.
4. Attach any relevant logs, screenshots, or code snippets.

**What to expect:**
- We will acknowledge receipt of your vulnerability report within 48 hours.
- We will send you regular updates about our progress in addressing the vulnerability.
- After the issue is fixed, we may acknowledge your contribution (if desired).

## Data Privacy & Hardcoded Secrets

We utilize strict pre-commit hooks and `.gitignore` policies to prevent sensitive data from entering version control. 

1. **Environment Variables**: No API Keys, Firebase Secrets, or Database URLs are hardcoded in the codebase. Always refer to `.env.example` to see required variables.
2. **Access Control**: Production databases (Firebase Firestore/Storage) are secured using strict Role-Based Access Control (RBAC) via Firebase Security Rules. Users can only read/write data they own or have been explicitly granted access to.

## Automated Scans

This repository may run automated security scans using GitHub Dependabot or other CI/CD pipeline tools to monitor dependencies for known vulnerabilities. We strive to apply patches as quickly as possible.
