    if (!process.env.OPENAI_API_KEY) {
      const lastUserMsg = messages[messages.length - 1].content.toLowerCase();
      let reply = 'Como estou operando no modo Sandbox (sem chave da OpenAI), respondo a palavras-chave. ';
      let suggestions: any[] = [];
      
      if (lastUserMsg.includes('plano') || lastUserMsg.includes('assinatura') || lastUserMsg.includes('gratis') || lastUserMsg.includes('pro')) {
        reply += 'Temos 3 planos: Gratuito (funcionalidades básicas e calculadoras com anúncios), Pro (para prestadores autônomos, sem anúncios e com PDFs) e Business (para empresas). Quer ver os detalhes?';
        suggestions.push({ label: 'Ver Planos', actionKey: 'planos' });
      } else if (lastUserMsg.includes('calculadora') || lastUserMsg.includes('calculo') || lastUserMsg.includes('calcular')) {
        reply += 'Temos várias calculadoras (Tijolo, Tinta, Piso, etc.) para ajudar no seu dia a dia. Acesse a biblioteca de cálculos abaixo!';
        suggestions.push({ label: 'Abrir Calculadoras', actionKey: 'calculos' });
      } else if (lastUserMsg.includes('cimento') || lastUserMsg.includes('preço') || lastUserMsg.includes('orcamento') || lastUserMsg.includes('orçamento')) {
        reply += 'Para criar orçamentos, vá na aba Novo Orçamento. Sobre preços, o cimento CP-II 50kg está na faixa de R$ 32,90.';
        suggestions.push({ label: 'Novo Orçamento', actionKey: 'novo-orcamento' });
      } else if (lastUserMsg.includes('projeto') || lastUserMsg.includes('arquitet')) {
        reply += 'Na gestão de projetos, você pode gerenciar clientes, arquivos e andamento da obra. Acesse seus projetos aqui:';
        suggestions.push({ label: 'Meus Projetos', actionKey: 'obras' });
      } else if (lastUserMsg.includes('diario') || lastUserMsg.includes('obra')) {
        reply += 'O Diário de Obra é essencial para registrar o avanço e clima do dia. Comece um novo relatório agora:';
        suggestions.push({ label: 'Novo Diário', actionKey: 'diario' });
      } else if (lastUserMsg.includes('compras') || lastUserMsg.includes('material')) {
        reply += 'Você pode gerenciar as listas de compras de cada obra para controlar os gastos. Vamos lá?';
        suggestions.push({ label: 'Lista de Compras', actionKey: 'compras' });
      } else if (lastUserMsg.includes('tendencia') || lastUserMsg.includes('inovacao')) {
        reply += 'Fique por dentro das novidades da Construção Civil na nossa aba de Tendências.';
        suggestions.push({ label: 'Ver Tendências', actionKey: 'tendencias' });
      } else {
        reply = 'Olá! No momento estou sem minha chave de IA conectada (OPENAI_API_KEY), então só entendo algumas palavras-chave como: planos, calculadoras, orçamento, obra, diário, compras e tendências. Como posso ajudar?';
      }

      return res.status(200).json({ reply, suggestions });
    }
