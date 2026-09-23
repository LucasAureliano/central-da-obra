const fs = require('fs');
let code = fs.readFileSync('src/components/landing/GenericInfoPage.tsx', 'utf8');

const oldPrivacy = <h3>3. Segurana</h3>
          <p>Utilizamos infraestrutura em nuvem de ponta (Google Cloud/Firebase) para garantir que seus dados estejam protegidos contra acesso nǜo autorizado.</p>
        </>;

const newPrivacy = <h3>3. Segurança</h3>
          <p>Utilizamos infraestrutura em nuvem de ponta (Google Cloud/Firebase) para garantir que seus dados estejam protegidos contra acesso não autorizado.</p>
          <h3>4. Cookies e Tecnologias de Rastreamento</h3>
          <p>O Google AdSense e outros fornecedores terceiros utilizam cookies para veicular anúncios com base nas visitas anteriores do usuário ao nosso site ou a outros sites na Internet. O uso de cookies de publicidade permite que o Google e seus parceiros veiculem anúncios aos usuários com base em sua visita ao nosso site e/ou a outros sites na Internet. Os usuários podem optar por não receber publicidade personalizada acessando as Configurações de Anúncios do Google.</p>
          <h3>5. Seus Direitos (LGPD)</h3>
          <p>Você tem o direito de solicitar acesso, correção ou exclusão dos seus dados pessoais a qualquer momento. Para exercer esses direitos, entre em contato conosco através do e-mail de suporte. Não vendemos dados pessoais a terceiros.</p>
          <h3>6. Consentimento</h3>
          <p>Ao utilizar nossa plataforma, você consente com esta Política de Privacidade. Reservamo-nos o direito de atualizar este documento periodicamente para refletir mudanças em nossos serviços ou exigências legais, e o uso contínuo implicará na aceitação das alterações.</p>
        </>;
        
const oldTerms = <h3>3. Isenǜo de responsabilidade</h3>
          <p>Os materiais e servios do CentralObra sǜo fornecidos "como estǜo". Nǜo oferecemos garantias, expressas ou implcitas, sobre resultados exatos em oramentos complexos.</p>
        </>;

const newTerms = <h3>3. Isenção de responsabilidade</h3>
          <p>Os materiais e serviços do CentralObra são fornecidos "como estão". Não oferecemos garantias, expressas ou implícitas, sobre resultados exatos em orçamentos complexos. A CentralObra não atua como responsável técnico por obras geridas por meio da plataforma (ART/RRT).</p>
          <h3>4. Direitos Autorais e Propriedade Intelectual</h3>
          <p>Todo o conteúdo presente no aplicativo, incluindo textos, gráficos, logotipos, ícones de botões, imagens e compilações de dados, é de propriedade exclusiva do CentralObra e protegido por leis internacionais de direitos autorais. O uso comercial não autorizado do nosso sistema é estritamente proibido.</p>
          <h3>5. Modificações dos Termos</h3>
          <p>O CentralObra pode revisar estes termos de serviço do site a qualquer momento, sem aviso prévio. Ao usar este site, você concorda em ficar vinculado à versão atual desses termos de serviço.</p>
        </>;
        
code = code.replace(oldPrivacy, newPrivacy);
code = code.replace(oldTerms, newTerms);

fs.writeFileSync('src/components/landing/GenericInfoPage.tsx', code, 'utf8');
console.log("Expanded privacy and terms");
