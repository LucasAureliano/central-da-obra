const fs = require('fs');

const path = 'api/copilot.ts';
let code = fs.readFileSync(path, 'utf8');

// Modify the getSystemPrompt to accept and process isPremium
const promptTarget = `const getSystemPrompt = (contextData?: any) => {
  const role = contextData?.role;
  const currentWork = contextData?.currentWork;`;

const promptReplacement = `const getSystemPrompt = (contextData?: any) => {
  const role = contextData?.role;
  const currentWork = contextData?.currentWork;
  const isPremium = contextData?.isPremium;`;

code = code.replace(promptTarget, promptReplacement);

const baseTarget = `  if (currentWork) {`;

const baseReplacement = `  if (isPremium === false) {
    base += "\\n\\nATENÇÃO: O usuário possui um plano GRATUITO. Suas respostas devem ser curtas e prestativas. Para perguntas que exigem acesso a recursos bloqueados (como integrações avançadas, múltiplos projetos, gestão financeira corporativa), diga que essa funcionalidade está disponível nos planos PRO/Business e sugira que ele faça o Upgrade. Entretanto, responda livremente a perguntas de engenharia, tendências, materiais e uso das calculadoras gratuitas.";
  } else {
    base += "\\n\\nATENÇÃO: O usuário possui um plano PRO/Business. Você tem acesso total para ajudá-lo com relatórios completos e análises.";
  }

  if (currentWork) {`;

code = code.replace(baseTarget, baseReplacement);

fs.writeFileSync(path, code, 'utf8');
