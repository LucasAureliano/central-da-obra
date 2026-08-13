# Autenticação na CentralObra

O gerenciamento de identidade é gerido pelo Firebase Authentication, garantindo segurança corporativa para o acesso dos usuários.

## 1. Provedores
A plataforma suporta múltiplos provedores para facilitar o embarque, sendo o e-mail/senha e o Google Auth os principais.

## 2. JWT e Firebase App Check
- O Firebase garante um JWT de sessão de curta duração, reciclando-o a cada acesso.
- Usamos o **Firebase App Check (ReCaptcha Enterprise)** para atestar que as requisições Auth estão vindo efetivamente do aplicativo real da CentralObra, prevenindo bots de tentar invadir o sistema.

## 3. Fluxo de Visitantes (Guest Mode)
Visando conversão, usuários que não desejam criar conta imediatamente operam no modo Visitante.
- Identidade anônima sem persistência de longo prazo ou armazenamento local estrito (somente leitura limitada).
- As Regras de Segurança bloqueiam usuários anônimos (Guests) de salvar ou alterar dados da plataforma, garantindo integridade dos bancos de dados reais.

## 4. Comunicação Segura com Backend
- Todas as chamadas ao backend proprietário (`api/`) requerem o envio do Token ID do usuário logado via header (`Authorization: Bearer <Token>`).
- O servidor valida ativamente o Token via Firebase Admin SDK.
