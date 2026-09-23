const { jsPDF } = require('jspdf');
const autoTable = require('jspdf-autotable');
const fs = require('fs');

const logoBuffer = fs.readFileSync('public/logo-centralobra.png');
const logoBase64 = 'data:image/png;base64,' + logoBuffer.toString('base64');

const drawAppLogo = (doc, x, y, isDarkBackground = false) => {
  doc.addImage(logoBase64, 'PNG', x, y, 22, 22, undefined, 'FAST');
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(isDarkBackground ? 255 : 30, isDarkBackground ? 255 : 41, isDarkBackground ? 255 : 59);
  doc.text('CentralObra', x + 28, y + 16);
  doc.setTextColor(249, 115, 22);
  doc.text('.', x + 28 + doc.getTextWidth('CentralObra'), y + 16);
};

const doc2 = new jsPDF('p', 'pt', 'a4');
const margin = 40;
const pageWidth = doc2.internal.pageSize.getWidth();
const pageHeight = doc2.internal.pageSize.getHeight();
const isPremium2 = false; 

doc2.setFillColor(255, 255, 255);
doc2.rect(0, 0, pageWidth, pageHeight, 'F');

const darkBlockWidth = 170;
doc2.setFillColor(30, 41, 59);
doc2.rect(margin, margin, darkBlockWidth, 300, 'F'); 

if (!isPremium2) {
  drawAppLogo(doc2, margin + 15, margin + 20, true);
}

// Draw the rest
doc2.setTextColor(255, 255, 255);
doc2.setFontSize(8);
doc2.setFont('helvetica', 'normal');
doc2.text('Data:', margin + 20, margin + 65);

doc2.save('quote_preview_free_realigned.pdf');
console.log('PDFs generated successfully');
