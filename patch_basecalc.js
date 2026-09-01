const fs = require('fs');
let code = fs.readFileSync('src/components/calculators_library/BaseCalculatorLayout.tsx', 'utf8');

if (!code.includes('generateCalculationPDF')) {
  code = code.replace(/import \{ drawHeader.*\} from '\.\.\/\.\.\/utils\/pdfGenerator';/, "import { generateCalculationPDF } from '../../utils/pdfGenerator';");
}

const newGeneratePDF = 
  const generatePDF = async () => {
    if (!results) return;
    setIsGeneratingPDF(true);
    try {
      await generateCalculationPDF({
        title,
        results,
        prices,
        workName: activeWork?.name,
        userName: user?.displayName || 'Usuário'
      });
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 3000);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF. Tente novamente.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };
;

code = code.replace(/const generatePDF = \(\) => \{[\s\S]*?setIsGeneratingPDF\(false\);\s*\}\s*\};\s*\}\s*;/g, newGeneratePDF);
fs.writeFileSync('src/components/calculators_library/BaseCalculatorLayout.tsx', code, 'utf8');