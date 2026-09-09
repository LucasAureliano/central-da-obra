fetch('https://centralobra.com/api/prices?q=cimento')
  .then(r => r.json())
  .then(json => console.log(JSON.stringify(json, null, 2)))
  .catch(console.error);
