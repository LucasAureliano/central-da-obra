fetch('https://centralobra.com/api/prices?q=cimento')
  .then(r => r.text())
  .then(console.log)
  .catch(console.error);
