const fs = require('fs');
let code = fs.readFileSync('src/components/public/PublicCalculatorView.tsx', 'utf8');

const searchStr = `<Helmet>
        <title>{title} | CentralObra</title>
        <meta name="description" content={description} />
      </Helmet>`;

const replaceStr = `<Helmet>
        <title>{title} | CentralObra</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={"calculadora de obra, cálculo de materiais, " + title.toLowerCase() + ", engenharia, construção civil, evitar desperdício"} />
        <link rel="canonical" href={"https://centralobra.com/?calc=" + calcId} />
        <meta property="og:title" content={title + " | CentralObra"} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={"https://centralobra.com/?calc=" + calcId} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title + " | CentralObra"} />
        <meta name="twitter:description" content={description} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": title,
            "description": description,
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "All",
            "url": "https://centralobra.com/?calc=" + calcId,
            "publisher": {
              "@type": "Organization",
              "name": "CentralObra",
              "url": "https://centralobra.com"
            }
          })}
        </script>
      </Helmet>`;

code = code.replace(searchStr, replaceStr);
fs.writeFileSync('src/components/public/PublicCalculatorView.tsx', code, 'utf8');
console.log('Fixed SEO in CalculatorView');
