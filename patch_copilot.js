import fs from 'fs';

const copilotPath = 'api/copilot.ts';
let code = fs.readFileSync(copilotPath, 'utf8');

// replace the 503 check
const target = `    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({ error: 'OpenAI API is not configured', reply: 'Configuração de IA ausente.' });
    }`;

const fallback = `    if (!process.env.OPENAI_API_KEY) {
      // Mock Response for users without API key to prevent the app from breaking
      const lastUserMsg = messages[messages.length - 1].content.toLowerCase();
      let reply = "Olá! Como estou operando no modo Sandbox (sem chave da OpenAI), minhas respostas são limitadas. ";
      
      if (lastUserMsg.includes('cimento') || lastUserMsg.includes('preço') || lastUserMsg.includes('orçamento')) {
        reply = "Com base no modo de simulação, o preço médio do cimento CP-II 50kg está em R$ 32,90. Recomendo sempre pesquisar na Leroy Merlin ou Obramax para valores atualizados.";
      } else if (lastUserMsg.includes('projeto') || lastUserMsg.includes('arquitet')) {
        reply = "Para a etapa de projetos, lembre-se sempre de conferir a compatibilização entre arquitetura e estrutura. Isso evita retrabalhos no canteiro.";
      } else if (lastUserMsg.includes('atraso') || lastUserMsg.includes('cronograma')) {
        reply = "Notei que você mencionou o cronograma. Uma boa prática é focar no caminho crítico da obra: fundações e alvenaria estrutural não podem atrasar.";
      } else {
        reply += "Se quiser respostas reais e completas com a IA, adicione a variável OPENAI_API_KEY na Vercel/Netlify. O que mais você gostaria de explorar no app?";
      }

      return res.status(200).json({ reply, suggestions: [{ label: 'Ver Preço do Cimento', action: 'cimento' }] });
    }`;

code = code.replace(target, fallback);

fs.writeFileSync(copilotPath, code, 'utf8');
