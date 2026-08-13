# Perfis e Acessos (RBAC)

A CentralObra possui uma gestão de perfis rigorosa baseada no papel que o usuário desempenha no ecossistema da construção.

## Proprietário
Acesso primário. Controla suas próprias obras, orçamento geral, financeiro e compartilha a gestão com outros perfis (Ex: Arquiteto). Não acessa dados de obras de outros proprietários.

## Arquiteto/Engenheiro
Gestão avançada de projetos e cronogramas. Possui acesso estendido sobre obras em que atua como Gestor Delegado ou Colaborador, mas limitado a ver as rubricas e aprovações que lhe forem liberadas pelo dono.

## Prestador de Serviços
Focado no escopo técnico, faturamento e vistorias (Assistente). Acesso altamente compartimentado apenas aos orçamentos e relatórios em que atua.

## Construtora
Acesso corporativo (Enterprise). Ferramentas de macro gestão (Corporate BI, Dashboard Financeiro Global, Equipamentos e Times). As obras da Construtora são unificadas via `companyId` na infraestrutura subjacente (Tenancy Corporate).

## Visitantes
Permissão *Somente Leitura* para funcionalidades de conversão. Interceptadores bloqueiam ativamente qualquer tentativa de salvamento de dados, retornando ações amigáveis de conversão (fallback ou login request).
