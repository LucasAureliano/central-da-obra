# Firebase & Database (Firestore)

A CentralObra usa a plataforma Firebase ativamente, extraindo máximo valor do ecossistema NoSQL em Real-Time.

## 1. Estrutura de Dados
O banco opera de forma otimizada para minimizar "reads" (leituras) ao longo de operações complexas de dashboard, isolando blocos por `userId`.
- `users/{uid}`: Informações pessoais do perfil.
- `works/{workId}`: Centro gravitacional dos projetos. Cada `work` contém:
  - Subcoleções para `transactions`, `schedules`, e `pendencies`.
  - Dados desnormalizados quando prático.

## 2. Abordagem de RBAC (Role-Based Access Control)
As permissões são mantidas dentro de cada documento chave no Firestore (Ex: `roles: { "uid1": "owner", "uid2": "editor" }`).
As Security Rules verificam esse array ativamente para negar ou aceitar o acesso à obra.

## 3. Storage
Armazenamento espelha a mesma estrutura. O caminho `/users/{userId}/works/{workId}/fotos/` exige que `{userId}` bata com o auth do requisitante ou seja um usuário com função válida em `roles`.

## 4. Otimização de Índices (Composite Indexes)
Utilizamos índices compostos no Firestore para permitir busca rápida e eficiente de dados agregados nos painéis Corporativos e BI, ordenados por Status e Categoria.
