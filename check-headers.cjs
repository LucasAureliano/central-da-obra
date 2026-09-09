fetch('https://centralobra.com/calculadoras')
  .then(r => {
    console.log(r.headers.get('x-vercel-id'));
    console.log(r.headers.get('date'));
  });
