# Site de Barbearia — modelo comercial estático

Template de site responsivo para uma barbearia apresentar seus serviços e receber contatos pelo WhatsApp. Construído com HTML, CSS e JavaScript puro, sem dependências de backend.

## O que esta versão faz

- Página institucional responsiva com seções Sobre, Serviços, Galeria e Contato.
- Botões de contato que abrem uma conversa no WhatsApp com uma mensagem inicial.
- Links externos com proteção `rel="noopener noreferrer"`.
- Menu móvel com estado acessível e fechamento pela tecla Escape.
- Conteúdo dos serviços renderizado com `textContent`, sem inserir dados variáveis com `innerHTML`.
- Não armazena dados pessoais, reservas ou credenciais no navegador.

## Limites importantes

Esta é uma página estática de apresentação e captação de contatos. **Não é um sistema de agendamento online**: não verifica disponibilidade, não registra reservas, não oferece painel administrativo e não confirma horários. O agendamento só fica combinado depois que a equipe responder ao cliente.

Para oferecer reservas online reais, implemente um backend e um banco de dados com autenticação, controle de acesso, validação de horários no servidor, prevenção de conflitos e política de privacidade adequada. Não volte a colocar senhas ou regras de autorização no JavaScript do navegador.

## Personalização obrigatória antes de publicar

Edite o objeto `SHOP` no início de `barbershop.js`:

- `name`: nome real do estabelecimento.
- `whatsapp`: número real no formato internacional, somente dígitos (ex.: `5585999999999`).
- `instagram`: URL completa do perfil oficial, se houver.
- `address` e `hours`: caso vá adicionar endereço e horários reais ao conteúdo.

Revise também `index.html` antes da publicação:

1. Substitua o nome fictício da marca.
2. Confirme e atualize todos os serviços e preços em `barbershop.js`.
3. Substitua as fotos de banco por imagens autorizadas do estabelecimento, quando disponíveis.
4. Ajuste título, descrição e textos para o negócio real.
5. Remova o aviso de modelo demonstrativo só depois de revisar e substituir todos os dados fictícios.
6. Teste cada botão de WhatsApp em celular e computador.
7. Confirme com o proprietário o endereço, horários, preços e formas de contato.

O número do WhatsApp fica vazio por padrão de propósito: botões não redirecionam clientes para um telefone de exemplo.

## Executar localmente

Abra `index.html` no navegador ou use uma extensão de servidor local. Não há etapa de build.

## Publicação

Pode ser hospedado em um serviço de hospedagem estática. Se o código precisa continuar privado, verifique as opções de publicação do provedor antes de enviar o repositório; o site publicado será público para visitantes, mas isso não exige necessariamente tornar o repositório público.

## Arquivos

- `index.html` — estrutura e conteúdo.
- `barbershop.css` — identidade visual e layout responsivo.
- `barbershop.js` — configuração do negócio, renderização segura e contatos.
