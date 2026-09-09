fetch('https://centralobra.com/assets/index-C2H4uxJx.js')
  .then(r => r.arrayBuffer())
  .then(buf => {
    const arr = new Uint8Array(buf);
    const js = new TextDecoder('utf-8').decode(arr);
    const idx = js.indexOf('construÃ');
    if (idx !== -1) {
      console.log('Found double-encoded string!');
      // print the bytes at that location
      // wait, the string indexOf is char index, not byte index.
    } else {
      console.log('Not found?');
    }
  });
