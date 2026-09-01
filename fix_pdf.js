const fs = require('fs');
let code = fs.readFileSync('src/components/calculators_library/BaseCalculatorLayout.tsx', 'utf8');

// Add the import
if (!code.includes('generateCalculationPDF')) {
  code = code.replace(/import \{ drawHeader.*\} from '\.\.\/\.\.\/utils\/pdfGenerator';/, "import { generateCalculationPDF } from '../../utils/pdfGenerator';");
}

// Replace generatePDF
const newGeneratePDF = 
  const generatePDF = async () => {
    if (!results) return;
    setIsGeneratingPDF(true);
    try {
      const formattedInputs = []; // We can pass a summary of inputs if needed
      const formattedResults = Object.entries(results).map(([k, v]) => ({ label: k, value: String(v) }));
      
      await generateCalculationPDF({
        title,
        inputs: formattedInputs,
        results: formattedResults,
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