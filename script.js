const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const menu = document.querySelector(".nav-links");
const menuLinks = document.querySelectorAll(".nav-links a");
const animatedBlocks = document.querySelectorAll("[data-animate]");
const sections = document.querySelectorAll("section[id]");
const hero = document.querySelector(".hero");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Atualiza o cabeçalho quando a página sai do topo.
function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 20);
}

// Abre e fecha o menu em telas menores.
function toggleMenu() {
  const isOpen = menu.classList.toggle("open");

  menuButton.classList.toggle("open", isOpen);
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
}

// Fecha o menu depois que uma opção é escolhida.
function closeMenu() {
  menu.classList.remove("open");
  menuButton.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Abrir menu");
}

// Revela os blocos aos poucos durante a rolagem.
function startRevealAnimation() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.16
  });

  animatedBlocks.forEach((block) => observer.observe(block));
}

// Marca no menu a seção que está aparecendo na tela.
function watchActiveSection() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      menuLinks.forEach((link) => {
        const isCurrentLink = link.getAttribute("href") === `#${entry.target.id}`;
        link.classList.toggle("active", isCurrentLink);
      });
    });
  }, {
    rootMargin: "-40% 0px -50% 0px"
  });

  sections.forEach((section) => observer.observe(section));
}

// Movimento discreto no hero para dar profundidade sem pesar a página.
function updateHeroMotion() {
  if (reduceMotion || !hero) {
    return;
  }

  const movement = Math.min(window.scrollY * 0.08, 28);
  hero.style.setProperty("--hero-shift", `${movement}px`);
}

menuButton.addEventListener("click", toggleMenu);
menuLinks.forEach((link) => link.addEventListener("click", closeMenu));

window.addEventListener("scroll", () => {
  updateHeader();
  updateHeroMotion();
}, { passive: true });

updateHeader();
updateHeroMotion();
startRevealAnimation();
watchActiveSection();
