# uabiConsent 1.1

### Ferramamenta de Gestão de Consetimento de Cookies Integrado com Google Analytics e Adsense

JavaScript simples e gratuito para gerenciamento de cookies em conformidade com regulamentações como RGPD, LGPD.

A documentação deste projeto pode ser encontrada nos links:

### Português

### English

### Español


### Principais funcionalidades:

O uabiConsent disponibiliza uma caixa de diálogo para solicitar permissão ao usuário para armazenar cookies com diferentes finalidades. Abaixo estão suas principais funcionalidades:

- Dois Tipos de Consentimento:
   * Consentimento Explícito: O usuário escolhe se e a quais cookies deseja consentir. Oferece controle granular sobre as preferências.
   * Consentimento Implícito: Informa ao usuário que os cookies serão armazenados automaticamente, tornando o uso do site condicional ao consentimento.
- Política de Privacidade:
   * Permite definir a URL da política de privacidade do site, garantindo conformidade legal e transparência.
- Suporte Multilíngue:
   * Suporta três idiomas: Português, Inglês e Espanhol.
   * É possível adicionar novas linguagens, expandindo o alcance global do script.
- Customização de Textos:
   * Todos os textos das mensagens e botões são personalizáveis em todas as linguagens.
   * Utiliza textos diferentes para a mensagem principal e o botão de consentimento, dependendo se o consentimento é explícito ou implícito. Ambos são totalmente configuráveis.
- Configurações Iniciais:
   * Possibilita definir o consentimento inicial, ou seja, se o consentimento será considerado garantido (granted) ou negado (denied) antes que o usuário faça uma escolha.
- Controle de Botões:
   * Permite definir se os botões Recusar Cookies e Personalizar Cookies serão exibidos na interface.
- Link para Configurações:
   * Facilita a criação de um link para reabrir a caixa de diálogo de configurações dos cookies, permitindo que o usuário altere suas preferências a qualquer momento.
- Logs no Console:
   * Oferece uma opção para registrar os valores dos cookies no console do navegador, útil para depuração e testes. Recomenda-se desativar essa funcionalidade em ambientes de produção.
- Integração Automática com Ferramentas:
   * Integra-se automaticamente ao Google Analytics e ao Google Adsense utilizando sinais. Basta fornecer os IDs correspondentes, e as ferramentas serão carregadas com base nas escolhas do usuário.
- Personalização Visual:
   * Permite a personalização completa da caixa de diálogo através do arquivo SASS (.scss) que acompanha o script. Isso possibilita ajustar o design para atender às necessidades visuais do site.

### Tipos de Cookies

O uabiConsent oferece quatro tipos de cookies personalizáveis para atender às necessidades do site e garantir conformidade com as regulamentações de privacidade. Abaixo estão os detalhes de cada tipo:

- Cookies Estritamente Necessários:
* São essenciais para o funcionamento básico do site e não podem ser desativados.
* Geralmente são criados em resposta a ações do usuário, como definir preferências de privacidade, fazer login ou preencher formulários.
* Não armazenam informações pessoais identificáveis.
- Cookies de desempenho
* Usados para medir e melhorar a experiência do usuário e a performance do site.
* Responsáveis por coletar dados sobre o número de visitas, fontes de tráfego e como os visitantes interagem com o site (por exemplo, páginas mais visitadas).
* Ferramentas como o Google Analytics se enquadram nessa categoria.
* Todas as informações que estes cookies recolhem são agregadas e, portanto, anônimas.
- Cookies funcionais
* Proporcionam funcionalidades aprimoradas e personalizações no site.
* Podem ser definidos pelo próprio site ou por terceiros.
* Exemplos incluem a capacidade de lembrar preferências do usuário, como tema, idioma ou região.
- Cookies de direcionamento
* Usados para tornar os anúncios publicitários mais relevantes ao perfil de interesses do usuário.
* Podem ser definidos pelo site ou por terceiros, como o Google Adsense.
* Quando aceitos, permitem a exibição de anúncios personalizados com base nas preferências do usuário.
* Quando recusados, os anúncios serão exibidos sem personalização.
