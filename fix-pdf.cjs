const fs = require('fs');
let code = fs.readFileSync('src/utils/pdfGenerator.ts', 'utf8');

// I will insert a function to draw a cover page
const coverPageCode = `
async function drawCoverPage(doc: jsPDF, clientName: string, projectName: string, companyName: string, dateStr: string) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  
  // Background Block
  doc.setFillColor(37, 99, 235); // Corporate Blue
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // White panel for content
  doc.setFillColor(255, 255, 255);
  doc.rect(40, 100, pageWidth - 80, pageHeight - 200, 'F');
  
  // Try to load logo
  const logoBase64 = await fetchImageAsBase64('/assets/logo_light_3d.jpg');
  if (logoBase64) {
    doc.addImage(logoBase64, 'JPEG', 60, 130, 40, 40);
  }
  
  doc.setFontSize(36);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(37, 99, 235);
  doc.text('PROPOSTA', 60, 220);
  doc.text('COMERCIAL', 60, 260);
  
  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(3);
  doc.line(60, 280, 140, 280);
  
  doc.setFontSize(16);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 85, 99);
  doc.text(\`Para: \${clientName || 'Cliente Especial'}\`, 60, 320);
  doc.text(\`Projeto: \${projectName || 'Construção/Reforma'}\`, 60, 345);
  
  doc.setFontSize(12);
  doc.setTextColor(156, 163, 175);
  doc.text(dateStr, 60, pageHeight - 140);
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(37, 99, 235);
  doc.text(companyName || 'CentralObra Parceiro', pageWidth - 60, pageHeight - 140, { align: 'right' });
  
  doc.addPage();
}
`;

code = code.replace(/export async function drawProfessionalHeader/, coverPageCode + '\nexport async function drawProfessionalHeader');

// Find generateCommercialQuotePDF and inject cover page
const genComm = `export async function generateCommercialQuotePDF({ work, user, profile, clientInfo, items, totals, conditions }: any) {
  const doc = new jsPDF('p', 'pt', 'a4');`;
  
const newGenComm = `export async function generateCommercialQuotePDF({ work, user, profile, clientInfo, items, totals, conditions }: any) {
  const doc = new jsPDF('p', 'pt', 'a4');
  const dataHoje = new Date().toLocaleDateString('pt-BR');
  await drawCoverPage(doc, clientInfo?.name, work?.name, profile?.companyName || profile?.name, dataHoje);
`;
code = code.replace(genComm, newGenComm);

// enhance table style in generateCommercialQuotePDF to use corporate blue header
code = code.replace(/headStyles: \{ fillColor: \[249, 250, 251\], textColor: \[55, 65, 81\]/g, "headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255]");

fs.writeFileSync('src/utils/pdfGenerator.ts', code, 'utf8');
console.log("Added cover page and premium table styles to PDF");
