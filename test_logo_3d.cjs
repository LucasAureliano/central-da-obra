const { jsPDF } = require('jspdf');
const fs = require('fs');

const doc = new jsPDF('p', 'pt', 'a4');
doc.setFillColor(30, 41, 59);
doc.rect(0, 0, 595, 842, 'F');

const logoBuffer = fs.readFileSync('public/assets/logo_3d.jpg');
const logoBase64 = 'data:image/jpeg;base64,' + logoBuffer.toString('base64');

doc.advancedAPI(d => {
  d.roundedRect(40, 40, 50, 50, 10, 10);
  d.clip();
  d.addImage(logoBase64, 'JPEG', 40, 40, 50, 50);
});

doc.save('test_logo_3d.pdf');
