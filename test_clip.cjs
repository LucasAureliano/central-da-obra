const { jsPDF } = require('jspdf');
const fs = require('fs');

const doc = new jsPDF('p', 'pt', 'a4');
doc.setFillColor(30, 41, 59);
doc.rect(0, 0, 595, 842, 'F');

const logoBuffer = fs.readFileSync('public/assets/logo_light_3d.jpg');
const logoBase64 = 'data:image/jpeg;base64,' + logoBuffer.toString('base64');

// Try to clip
doc.advancedAPI(doc => {
  doc.roundedRect(40, 40, 50, 50, 10, 10);
  doc.clip();
  doc.addImage(logoBase64, 'JPEG', 40, 40, 50, 50);
});

doc.save('test_clip.pdf');
