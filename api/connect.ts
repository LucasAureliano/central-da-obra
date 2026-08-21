export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  const url = new URL(req.url);
  const connectId = url.searchParams.get('connect');

  // If no connect ID, we just let the rewrite pass or redirect to home
  if (!connectId) {
    return new Response('Not found', { status: 404 });
  }

  // Basic HTML skeleton with dynamic OG tags injected
  // Note: For a production app, we would fetch the professional's name/photo from Firebase Admin here.
  // For now, we provide the infrastructure to avoid breaking their current setup.
  
  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        <!-- OpenGraph Tags Dinâmicas injetadas via Edge -->
        <meta property="og:title" content="Perfil do Profissional - CentralObra Connect" />
        <meta property="og:description" content="Confira meu portfólio, projetos e calculadoras técnicas no CentralObra Connect." />
        <meta property="og:image" content="https://centralobra.com/pwa-512x512.png" />
        <meta property="og:url" content="${req.url}" />
        <meta property="og:type" content="profile" />
        <meta name="twitter:card" content="summary_large_image" />
        
        <title>CentralObra Connect</title>
        
        <!-- Redirecionamento instantâneo para o SPA real -->
        <meta http-equiv="refresh" content="0;url=/?connect=${connectId}" />
        <script>
          window.location.replace("/?connect=${connectId}");
        </script>
      </head>
      <body>
        <p>Redirecionando para o perfil...</p>
      </body>
    </html>
  `;

  return new Response(html, {
    headers: {
      'content-type': 'text/html;charset=UTF-8',
    },
  });
}
