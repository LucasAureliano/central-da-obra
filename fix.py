import os

with open('src/components/landing/GenericInfoPage.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

old_priv = """<h3>3. Segurana</h3>
          <p>Utilizamos infraestrutura em nuvem de ponta (Google Cloud/Firebase) para garantir que seus dados estejam protegidos contra acesso nǜo autorizado.</p>
        </>"""
        
new_priv = """<h3>3. Segurança</h3>
          <p>Utilizamos infraestrutura em nuvem de ponta (Google Cloud/Firebase) para garantir que seus dados estejam protegidos contra acesso não autorizado.</p>
          <h3>4. Cookies e Tecnologias de Rastreamento</h3>
          <p>O Google AdSense e outros fornecedores terceiros utilizam cookies para veicular anúncios com base nas visitas anteriores do usuário ao nosso site ou a outros sites na Internet. O uso de cookies de publicidade permite que o Google e seus parceiros veiculem anúncios aos usuários com base em sua visita ao nosso site e/ou a outros sites na Internet. Os usuários podem optar por não receber publicidade personalizada acessando as Configurações de Anúncios do Google.</p>
          <h3>5. Seus Direitos (LGPD)</h3>
          <p>Você tem o direito de solicitar acesso, correção ou exclusão dos seus dados pessoais a qualquer momento. Para exercer esses direitos, entre em contato conosco através do e-mail de suporte. Não vendemos dados pessoais a terceiros.</p>
          <h3>6. Consentimento</h3>
          <p>Ao utilizar nossa plataforma, você consente com esta Política de Privacidade. Reservamo-nos o direito de atualizar este documento periodicamente para refletir mudanças em nossos serviços ou exigências legais, e o uso contínuo implicará na aceitação das alterações.</p>
        </>"""

code = code.replace(old_priv, new_priv)
code = code.replace("<h3>3. Isenǜo de responsabilidade</h3>", "<h3>3. Isenção de responsabilidade</h3>")

with open('src/components/landing/GenericInfoPage.tsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Replaced!")
