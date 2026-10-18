# Barber Premium — configuração para publicação comercial

O projeto é um site estático hospedado no GitHub Pages. Antes de divulgá-lo para clientes reais, revise os itens abaixo.

## Configuração obrigatória

Em `barbershop.js`, ajuste o objeto `SHOP`:
- `name`: nome real da barbearia;
- `whatsapp`: número real com código do país e DDD, somente dígitos (ex.: 55 + DDD + número);
- `mapLat` e `mapLng`: coordenadas reais do estabelecimento.

No `index.html`, revise os dados de demonstração que continuam no conteúdo visual:
- telefone, e-mail, WhatsApp e Instagram;
- endereço, cidade e horário de funcionamento;
- nome, fotos, especialidades e avaliações da equipe;
- serviços, preços e durações;
- texto institucional e ano/menções de localização.

Não publique informações de exemplo como se fossem reais.

## Limites importantes do GitHub Pages

O fluxo atual pode preparar uma **solicitação** e abrir o WhatsApp com os dados preenchidos. O cliente ainda precisa enviar a mensagem e a barbearia precisa responder para confirmar o horário.

O site estático não oferece banco de dados compartilhado nem bloqueio de horários em tempo real. A consulta/cancelamento de reservas entre dispositivos e uma agenda confiável exigem backend ou uma plataforma de agendamento integrada. Não anuncie uma reserva como confirmada apenas porque o formulário foi preenchido.

## Checklist antes de divulgar

- [ ] Substituir todos os dados de exemplo por dados autorizados da barbearia.
- [ ] Configurar e testar o WhatsApp real em celular e computador.
- [ ] Confirmar endereço, mapa, horários, preços e disponibilidade com o proprietário.
- [ ] Testar o site em telas pequenas e grandes, incluindo todos os passos do pedido.
- [ ] Definir aviso de privacidade e tratamento dos dados enviados pelos clientes.
- [ ] Se precisar de agenda online real, integrar e testar um backend/plataforma de agendamento.
