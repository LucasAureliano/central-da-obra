const fs = require('fs');

const path = 'src/components/owner/OwnerWorkDetails.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  /const allDone = s\.tasks\?\.every\(\(t: any\) => t\.isCompleted\) && s\.tasks\?\.length > 0;/g,
  `const allDone = s.completed === true;`
);

// ALSO, InteractiveSchedule uses collection 'schedule_stages', NOT 'stages' !!
code = code.replace(
  /const stagesQuery = collection\(db, \`works\/\$\{workId\}\/stages\`\);/g,
  `const stagesQuery = collection(db, \`works/\${workId}/schedule_stages\`);`
);

fs.writeFileSync(path, code, 'utf8');
