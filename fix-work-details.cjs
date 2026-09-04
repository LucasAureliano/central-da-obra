const fs = require('fs');

let content = fs.readFileSync('src/components/WorkDetails.tsx', 'utf8');

// Replace addDoc to calculations with expenses
content = content.replace(
  /await addDoc\(collection\(db, `works\/\$\{workId\}\/calculations`\), \{\s*calcType:\s*expenseTitle,\s*totalCost:\s*amount,\s*savedAt:\s*serverTimestamp\(\),\s*resultData:\s*\{\s*materials:\s*\[\]\s*\}\s*\}\);/,
  `await addDoc(collection(db, \`works/\${workId}/expenses\`), {
        title: expenseTitle,
        amount: amount,
        category: 'Outros',
        status: 'Pago',
        date: new Date().toISOString().split('T')[0],
        createdAt: serverTimestamp()
      });`
);

// Replace query to calculations for totalSpent
const expensesQueryStr = `
    const calcsQuery = collection(db, 'works', workId, 'expenses');
    const unsubscribeCalcs = onSnapshot(calcsQuery, (snap) => {
      const calcs: any[] = [];
      let spent = 0;
      snap.forEach(c => {
        const data = c.data();
        if (data.status !== 'Cancelado' && data.amount) {
          spent += Number(data.amount);
        }
      });
      setTotalSpent(spent);
    });
`;

content = content.replace(
  /const calcsQuery = collection\(db, 'works', workId, 'calculations'\);[\s\S]*?setTotalSpent\(spent\);\s*\}\);/,
  expensesQueryStr.trim()
);

fs.writeFileSync('src/components/WorkDetails.tsx', content, 'utf8');
