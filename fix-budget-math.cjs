const fs = require('fs');

// 1. Fix OwnerWorkDetails.tsx
let ownerDetails = fs.readFileSync('src/components/owner/OwnerWorkDetails.tsx', 'utf8');

// Replace the calculations query with an expenses query
const expensesQueryStr = `
      // Listen to real expenses instead of calculations
      const expensesQuery = collection(db, 'works', workId, 'expenses');
      const unsubscribeExpenses = onSnapshot(expensesQuery, (snap) => {
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

// Find the old calculations block
ownerDetails = ownerDetails.replace(
  /\/\/ Listen to calculations \(expenses\)[\s\S]*?setTotalSpent\(spent\);\s*\}\);/,
  expensesQueryStr.trim()
);
ownerDetails = ownerDetails.replace(/unsubscribeCalcs/g, 'unsubscribeExpenses');

fs.writeFileSync('src/components/owner/OwnerWorkDetails.tsx', ownerDetails, 'utf8');

// 2. Fix WorksContext.tsx
let worksContext = fs.readFileSync('src/contexts/WorksContext.tsx', 'utf8');

// The current code sums them. Let's just make totalSpent = totalSpentExpenses.
// We can just find the setPrimaryWorkStats calls and change totalSpent: ...
worksContext = worksContext.replace(/totalSpent:\s*calcSpent \+ \(prev\?\.totalSpentExpenses \|\| 0\),/g, 'totalSpent: prev?.totalSpentExpenses || 0,');
worksContext = worksContext.replace(/totalSpent:\s*expSpent \+ \(prev\?\.totalSpentCalcs \|\| 0\),/g, 'totalSpent: expSpent,');

fs.writeFileSync('src/contexts/WorksContext.tsx', worksContext, 'utf8');
