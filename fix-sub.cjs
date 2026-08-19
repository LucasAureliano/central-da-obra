const fs = require('fs');
let file = fs.readFileSync('src/components/SubscriptionPlans.tsx', 'utf8');

file = file.replace(/if \(data\.id\) \{\s+setPreferenceId\(data\.id\);\s+\} else \{/g, "if (data.init_point) { window.location.href = data.init_point; } else if (data.id) { setPreferenceId(data.id); } else {");

fs.writeFileSync('src/components/SubscriptionPlans.tsx', file);
