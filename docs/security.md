# Segurança na CentralObra

O coração do SaaS CentralObra baseia-se na segurança e isolamento da propriedade (Multi-Tenancy).

## 1. Zero Segredos (Zero Secrets Policy)
É política estrita que nenhum `secret` resida no código público ou exposto aos clientes.
- Chaves privadas, tokens, e dados sensíveis de integração estão isolados no servidor.
- O `.env` na raiz do projeto não é comitado e não retém valores.

## 2. Firebase Security Rules
Regras rígidas impedem a visualização ou alteração por contas não-autorizadas.
- O acesso a qualquer documento em `/works` exige que o campo `userId` seja igual ao do requisitante.
- Mecanismo avançado de permissões garante acessos secundários através do campo `roles`, onde o ID do usuário deve estar mapeado.

## 3. Prevenção a Guest Exploits
Visitantes não têm poder de destruição de dados, e seus reads são altamente restritos por rotas limitadas, e não por regras abertas de acesso Firestore.

## 4. Proteção de Imagens e Documentos
Arquivos de projetos, fotos e vistoria do Firebase Storage seguem o mesmo espelho de Tenant. Arquivos da `Obra A` são bloqueados se o requerente não for o `Owner` da `Obra A` ou um membro ativo via Firebase Rules.
