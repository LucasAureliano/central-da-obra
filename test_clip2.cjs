const { jsPDF } = require('jspdf');
const autoTable = require('jspdf-autotable');
const fs = require('fs');

const logoBuffer = fs.readFileSync('public/assets/logo_light_3d.jpg');
const logoBase64 = 'data:image/jpeg;base64,' + logoBuffer.toString('base64');

const drawAppLogo = (doc, x, y, isDarkBackground = false) => {
  if (doc.advancedAPI) {
    doc.advancedAPI(d => {
      d.roundedRect(x, y, 22, 22, 5, 5);
      d.clip();
      d.addImage(logoBase64, 'JPEG', x, y, 22, 22);
    });
  } else {
    doc.addImage(logoBase64, 'JPEG', x, y, 22, 22);
  }
  
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

// ... skipping drawing the rest of the text for the test
doc2.save('quote_preview_free_realigned.pdf');
console.log('Done');
