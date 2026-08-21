const fs = require('fs');

let rules = fs.readFileSync('firestore.rules', 'utf8');

const oldUsersRule = `match /users/{userId} {
      allow get: if isOwner(userId);
      allow list: if isAuthenticated() && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
      allow write: if isOwner(userId) || (isAuthenticated() && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true);`;

// Wait, the formatting might be slightly different with indentation. 
// Let's use regex to replace just the allow write line.

const regex = /allow write: if isOwner\(userId\) \|\| \(isAuthenticated\(\) && get\(\/databases\/\$\(database\)\/documents\/users\/\$\(request\.auth\.uid\)\)\.data\.isAdmin == true\);/;

const newRulesBlock = `// Permite criação se não estiver tentando forçar privilégios
      allow create: if isOwner(userId) && request.resource.data.get('isAdmin', false) == false;
      
      // Permite atualização se NÃO mexer em campos sensíveis (Admin, Subscription, Plan)
      allow update: if (isOwner(userId) && !request.resource.data.diff(resource.data).affectedKeys().hasAny(['isAdmin', 'subscription', 'plan'])) 
                    || (isAuthenticated() && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true);
      
      allow delete: if isOwner(userId) || (isAuthenticated() && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true);`;

rules = rules.replace(regex, newRulesBlock);

fs.writeFileSync('firestore.rules', rules, 'utf8');
