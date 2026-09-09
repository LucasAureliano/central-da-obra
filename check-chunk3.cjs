fetch('https://centralobra.com/assets/index-DyV4gyC1.js')
  .then(r => r.text())
  .then(js => {
    const matches = js.match(/constru.{0,10}/g);
    console.log(matches ? matches.slice(0, 10) : 'none');
  });
