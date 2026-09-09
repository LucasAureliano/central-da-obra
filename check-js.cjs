fetch('https://centralobra.com/assets/index-C2H4uxJx.js')
  .then(r => {
    console.log(r.headers.get('last-modified'));
    console.log(r.headers.get('date'));
  });
