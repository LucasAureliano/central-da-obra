fetch('https://centralobra.com/assets/index-C2H4uxJx.js')
  .then(r => r.text())
  .then(js => {
    console.log(js.includes('PublicCalculatorsHubView'));
  });
