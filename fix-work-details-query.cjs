const fs = require('fs');

let content = fs.readFileSync('src/components/WorkDetails.tsx', 'utf8');

const expensesQueryStr = `
    const calcsQuery = collection(db, 'works', workId, 'expenses');
    const unsubscribeCalcs = onSnapshot(calcsQuery, (snap) => {
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
