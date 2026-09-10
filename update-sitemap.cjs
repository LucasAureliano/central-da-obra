const fs = require('fs');
let code = fs.readFileSync('public/sitemap.xml', 'utf8');

const additionalLinks = `  <url>
    <loc>https://centralobra.com/privacidade</loc>
    <lastmod>2026-09-10</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://centralobra.com/termos</loc>
    <lastmod>2026-09-10</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://centralobra.com/sobre</loc>
    <lastmod>2026-09-10</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://centralobra.com/contato</loc>
    <lastmod>2026-09-10</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>`;

code = code.replace(/<\/urlset>/, additionalLinks);

fs.writeFileSync('public/sitemap.xml', code, 'utf8');
console.log("Updated sitemap.xml");
