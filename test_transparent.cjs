const { jsPDF } = require('jspdf');
const fs = require('fs');

const doc = new jsPDF('p', 'pt', 'a4');
doc.setFillColor(30, 41, 59);
doc.rect(0, 0, 595, 842, 'F');

const logoBuffer = fs.readFileSync('public/logo-centralobra.png');
const logoBase64 = 'data:image/png;base64,' + logoBuffer.toString('base64');

doc.addImage(logoBase64, 'PNG', 40, 40, 22, 22, undefined, 'FAST');
doc.setFontSize(14);
doc.setFont('helvetica', 'bold');
doc.setTextColor(255, 255, 255);
doc.text('CentralObra', 40 + 28, 40 + 16);
doc.setTextColor(249, 115, 22);
doc.text('.', 40 + 28 + doc.getTextWidth('CentralObra'), 40 + 16);

doc.save('test_transparent.pdf');
