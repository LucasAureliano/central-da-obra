fetch('https://centralobra.com/calculadoras')
  .then(r => r.text())
  .then(html => {
    const scripts = html.match(/src="([^"]+\.js)"/g);
    console.log(scripts);
  });
