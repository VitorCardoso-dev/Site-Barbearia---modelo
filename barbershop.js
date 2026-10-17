/* Personalize este objeto antes de publicar o site para um negócio real.
 * WhatsApp: somente números, com código do país e DDD (ex.: 5585999999999).
 * Não inclua +, espaços, parênteses ou hífens.
 * Este site é estático: não salva reservas, senhas nem dados pessoais.
 */
const SHOP = {
  name: "Barber Premium",
  whatsapp: "", // OBRIGATÓRIO: número real com código do país e DDD
  instagram: "", // Opcional: URL completa do perfil real
  address: "", // Opcional: endereço real
  hours: "" // Opcional: horários reais
};

const SERVICES = [
  { name: "Corte clássico", description: "Acabamento cuidadoso para seu dia a dia.", price: "Consulte" },
  { name: "Barba", description: "Modelagem e acabamento da barba.", price: "Consulte" },
  { name: "Corte + barba", description: "Um cuidado completo para renovar o visual.", price: "Consulte" }
];

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function toast(message) {
  const container = $("#toast-container");
  if (!container) return;
  const item = document.createElement("div");
  item.className = "toast";
  item.setAttribute("role", "status");
  item.textContent = message;
  container.appendChild(item);
  window.setTimeout(() => item.remove(), 3500);
}

function validWhatsAppNumber(value) {
  return /^\d{12,15}$/.test(value);
}

function openWhatsApp(message) {
  const number = String(SHOP.whatsapp || "").replace(/\D/g, "");
  if (!validWhatsAppNumber(number) || /^55?11999998888$/.test(number)) {
    toast("O WhatsApp ainda não foi configurado. Atualize SHOP.whatsapp em barbershop.js antes de publicar.");
    return;
  }
  const url = "https://wa.me/" + number + "?text=" + encodeURIComponent(message);
  const popup = window.open(url, "_blank", "noopener,noreferrer");
  if (!popup) window.location.href = url;
}

function renderServices() {
  const grid = $("#services-grid");
  if (!grid) return;
  grid.replaceChildren();
  SERVICES.forEach((service) => {
    const card = document.createElement("article");
    card.className = "service-card";
    const title = document.createElement("h3");
    title.textContent = service.name;
    const description = document.createElement("p");
    description.textContent = service.description;
    const price = document.createElement("span");
    price.className = "service-price";
    price.textContent = service.price;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "btn btn-outline service-cta js-whatsapp";
    button.textContent = "Consultar serviço";
    button.dataset.message = "Olá! Gostaria de consultar o serviço: " + service.name + ".";
    card.append(title, description, price, button);
    grid.appendChild(card);
  });
}

function renderFooterContact() {
  const list = $("#footer-contact");
  if (!list) return;
  list.replaceChildren();
  if (SHOP.whatsapp && validWhatsAppNumber(String(SHOP.whatsapp).replace(/\D/g, ""))) {
    const li = document.createElement("li");
    const link = document.createElement("a");
    link.href = "https://wa.me/" + String(SHOP.whatsapp).replace(/\D/g, "");
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "WhatsApp";
    li.appendChild(link);
    list.appendChild(li);
  } else {
    const li = document.createElement("li");
    li.textContent = "Configure o WhatsApp em barbershop.js";
    list.appendChild(li);
  }
  if (SHOP.instagram && /^https:\/\//i.test(SHOP.instagram)) {
    const li = document.createElement("li");
    const link = document.createElement("a");
    link.href = SHOP.instagram;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Instagram";
    li.appendChild(link);
    list.appendChild(li);
  }
}

function setupNavigation() {
  const nav = $("#mobile-nav");
  const opener = $("#hamburger-btn");
  const closer = $("#mobile-close");
  const closeMenu = () => {
    if (!nav || !opener) return;
    nav.classList.remove("open");
    nav.setAttribute("aria-hidden", "true");
    opener.setAttribute("aria-expanded", "false");
  };
  if (opener && nav) {
    opener.addEventListener("click", () => {
      nav.classList.add("open");
      nav.setAttribute("aria-hidden", "false");
      opener.setAttribute("aria-expanded", "true");
    });
  }
  if (closer) closer.addEventListener("click", closeMenu);
  $$(".mobile-link", nav || document).forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
  document.addEventListener("click", (event) => {
    if (nav && nav.classList.contains("open") && !nav.contains(event.target) && !opener.contains(event.target)) closeMenu();
  });
  window.addEventListener("scroll", () => {
    const navbar = $("#navbar");
    if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 60);
  }, { passive: true });
}

function setupContactButtons() {
  document.addEventListener("click", (event) => {
    const button = event.target.closest(".js-whatsapp");
    if (!button) return;
    event.preventDefault();
    openWhatsApp(button.dataset.message || ("Olá! Gostaria de falar com " + SHOP.name + "."));
  });
  const note = $("#contact-config-note");
  if (note && SHOP.whatsapp && validWhatsAppNumber(String(SHOP.whatsapp).replace(/\D/g, ""))) {
    note.textContent = "Ao continuar, você será direcionado ao WhatsApp para conversar diretamente com a equipe.";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderServices();
  renderFooterContact();
  setupNavigation();
  setupContactButtons();
  const year = $("#current-year");
  if (year) year.textContent = String(new Date().getFullYear());
  document.title = SHOP.name + " | Barbearia";
});
