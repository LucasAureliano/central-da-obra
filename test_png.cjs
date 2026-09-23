const { jsPDF } = require('jspdf');
const fs = require('fs');

const logoBuffer = fs.readFileSync('public/logo-centralobra.png');
const logoBase64 = 'data:image/png;base64,' + logoBuffer.toString('base64');

const doc = new jsPDF('p', 'pt', 'a4');
doc.setFillColor(30, 41, 59);
doc.rect(0, 0, 595, 842, 'F');
doc.addImage(logoBase64, 'PNG', 40, 40, 50, 50, 'LOGO', 'FAST');
doc.save('test_png.pdf');
