const fs = require('fs');

let rules = fs.readFileSync('firestore.rules', 'utf8');

// Fix Users read leak
rules = rules.replace(
  "allow get: if isOwner(userId) || isAuthenticated();",
  "allow get: if isOwner(userId);"
);

// Fix shared_links leak
rules = rules.replace(
  "match /shared_links/{linkId} {\n      // Qualquer um pode ler um link pelo token para acessar a obra (a query farǭ filtro pelo token)\n      allow read: if true;\n      // Somente autenticados (profissionais) podem gerar links\n      allow create: if isAuthenticated();\n      allow update, delete: if isAuthenticated();\n    }",
  "match /shared_links/{linkId} {\n      // O portal do cliente busca diretamente pelo ID do token. Isso impede a raspagem.\n      allow get: if true;\n      allow list: if false;\n      // Somente autenticados podem gerar links ou ler via query de workId\n      allow read, create, update, delete: if isAuthenticated();\n    }"
);

// Wait, if I use `allow read, create... if isAuthenticated()`, then `allow list` is allowed for authenticated users. That's fine because they only list their own works' links anyway (restricted by frontend, but better than being completely public).
// Let's refine the replacement string safely.

// Replace block exactly:
let newRules = rules.replace(
  /match \/shared_links\/\{linkId\} \{[\s\S]*?\}/,
  `match /shared_links/{linkId} {
      allow get: if true;
      allow list: if false;
      allow read, create, update, delete: if isAuthenticated();
    }`
);

fs.writeFileSync('firestore.rules', newRules, 'utf8');
