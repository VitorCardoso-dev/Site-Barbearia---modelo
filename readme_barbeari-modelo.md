# Barber Premium - Barbearia de Elite ✂️💈

O **Barber Premium** é uma aplicação web moderna, elegante e interativa desenvolvida para barbearias de alto padrão. O sistema oferece uma experiência imersiva para clientes marcarem horários e um painel administrativo completo para a gestão do negócio.

---

## 🚀 Funcionalidades Principais

### Para Clientes:
- **Landing Page Imersiva:** Design moderno focado em conversão, com seções de Sobre, Serviços, Galeria, Equipe e Localização (integrada com Leaflet.js).
- **Sistema de Agendamento em Etapas (Wizard):**
  1. Escolha do serviço (Cortes, Barbas, Combos, Tratamentos).
  2. Escolha do profissional (Barbeiros especializados com avaliações).
  3. Seleção de data em um calendário dinâmico interativo.
  4. Escolha de horários disponíveis (calculados automaticamente com base na agenda do profissional e horários de almoço).
  5. Confirmação de dados com suporte a códigos de reserva únicos, cópia rápida e atalho para compartilhamento via WhatsApp.
- **Consulta de Reserva ("Minha Reserva"):** O cliente pode informar o telefone para localizar, acompanhar o status ou cancelar seus agendamentos ativos.
- **Botões Flutuantes:** Acesso rápido ao WhatsApp e Instagram oficial.

### Para Administradores:
- **Painel Administrativo Completo:** Protegido por senha.
- **Visão Geral (Dashboard):** Métricas de agendamentos e faturamento em tempo real (hoje e no mês atual), além da agenda do dia.
- **Gerenciamento de Agendamentos:** Filtros por data, barbeiro e status (Confirmado, Concluído, Cancelado, Não compareceu).
- **Gestão de Barbeiros & Serviços:** Adição e remoção dinâmica de profissionais e catálogo de serviços.
- **Gestão de Cupons:** Criação de cupons de desconto personalizados.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5** & **CSS3** (Variáveis CSS, Flexbox, Grid, Design Responsivo)
- **JavaScript (Vanilla ES6+)** (Arquitetura orientada a estado local com `localStorage`)
- **Leaflet.js** (Exibição de mapas interativos para localização)
- **FontAwesome** & **Google Fonts** (Ícones e tipografia de alto padrão como *Syne*, *Inter* e *Cormorant Garamond*)

---

## 📂 Estrutura de Arquivos

```text
├── index.html       # Estrutura principal da aplicação e modais
├── barbershop.css   # Estilos, temas escuros, layout responsivo e animações
└── barbershop.js    # Lógica de negócio, manipulação de estado, calendário e painel admin
```

---

## ⚙️ Como Executar o Projeto

Como o projeto utiliza arquivos estáticos puros (HTML, CSS e JS) e armazena os dados no `localStorage` do navegador, você pode executá-lo de duas formas:

1. **Diretamente no navegador:** Dê um duplo clique no arquivo `index.html`.
2. **Via Servidor Local (Recomendado):** Utilize extensões como o *Live Server* no Visual Studio Code para uma melhor experiência.

---

## 🔐 Acesso ao Painel Administrativo

Para acessar a área administrativa do sistema:
- **Atalho de Teclado:** Pressione `Ctrl + Shift + A` em qualquer lugar da página.
- **Parâmetro na URL:** Acesse adicionando `?admin` ao final do link (ex: `index.html?admin`).
- **Senha Padrão:** `admin123`