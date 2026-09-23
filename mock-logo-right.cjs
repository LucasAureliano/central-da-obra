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

const doc = new jsPDF('p', 'pt', 'a4');
const margin = 40;
const pageWidth = doc.internal.pageSize.getWidth();
const pageHeight = doc.internal.pageSize.getHeight();
const isPremium = false; 

doc.setFillColor(255, 255, 255);
doc.rect(0, 0, pageWidth, pageHeight, 'F');

const darkBlockWidth = 170;
doc.setFillColor(30, 41, 59);
doc.rect(margin, margin, darkBlockWidth, 290, 'F'); 

// Header Right Side
const contentStartX = margin + darkBlockWidth + 30;

if (!isPremium) {
  // Move logo here, above company name, on white background
  drawAppLogo(doc, contentStartX, margin + 20, false);
}

// Company Name / Proposta
doc.setFontSize(14);
doc.setFont('helvetica', 'bold');
doc.setTextColor(249, 115, 22); 
doc.text('Lucas Engenharia', contentStartX, margin + 65);

doc.setFontSize(32);
doc.setFont('helvetica', 'bold');
doc.setTextColor(30, 41, 59);
doc.text('PROPOSTA', contentStartX, margin + 100);

doc.save('quote_preview_logo_right.pdf');
console.log('PDFs generated successfully');
