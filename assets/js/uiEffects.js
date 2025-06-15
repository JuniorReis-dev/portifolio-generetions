// uiEffects.js - Responsável por efeitos de interface e interações
class UIEffects {
  constructor() {
    this.init();
  }

  init() {
    this.setupNavigation();
    this.setupScrollEffects();
    this.setupMobileMenu();
    this.setupSmoothScrolling();
  }

  // Configurar navegação e links ativos
  setupNavigation() {
    const topNavLinks = document.querySelectorAll(".top-nav-menu a");
    const sections = document.querySelectorAll(".section");

    // Observer para seções visíveis
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.4,
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const currentId = entry.target.getAttribute("id");

        if (entry.isIntersecting) {
          entry.target.classList.add("visible");

          // Atualizar o link ativo na navbar
          topNavLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${currentId}`) {
              link.classList.add("active");
            }
          });
        }
      });
    }, observerOptions);

    sections.forEach((section) => {
      sectionObserver.observe(section);
    });
  }

  // Configurar efeitos de scroll
  setupScrollEffects() {
    const navbar = document.querySelector(".top-navbar");

    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset;

      // Efeito de transparência na navbar
      if (scrolled > 100) {
        navbar.style.background = "rgba(10, 10, 20, 0.95)";
        navbar.style.backdropFilter = "blur(15px)";
      } else {
        navbar.style.background = "rgba(10, 10, 20, 0.8)";
        navbar.style.backdropFilter = "blur(10px)";
      }
    });
  }

  // Configurar menu mobile
  setupMobileMenu() {
    const mobileNavToggle = document.querySelector(".mobile-nav-toggle");
    const navbarMenu = document.querySelector(".navbar-menu");
    const topNavLinks = document.querySelectorAll(".top-nav-menu a");

    if (mobileNavToggle && navbarMenu) {
      // Toggle do menu mobile
      mobileNavToggle.addEventListener("click", () => {
        navbarMenu.classList.toggle("active");
        mobileNavToggle.classList.toggle("active");

        // Adicionar/remover classe no body para prevenir scroll
        document.body.classList.toggle("menu-open");
      });

      // Fechar o menu ao clicar em um link
      topNavLinks.forEach((link) => {
        link.addEventListener("click", () => {
          navbarMenu.classList.remove("active");
          mobileNavToggle.classList.remove("active");
          document.body.classList.remove("menu-open");
        });
      });

      // Fechar menu ao clicar fora dele
      document.addEventListener("click", (event) => {
        if (
          !navbarMenu.contains(event.target) &&
          !mobileNavToggle.contains(event.target)
        ) {
          navbarMenu.classList.remove("active");
          mobileNavToggle.classList.remove("active");
          document.body.classList.remove("menu-open");
        }
      });
    }
  }

  // Configurar scroll suave
  setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();

        const targetId = link.getAttribute("href");
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
          const offsetTop = targetSection.offsetTop - 80; // Compensar altura da navbar

          window.scrollTo({
            top: offsetTop,
            behavior: "smooth",
          });
        }
      });
    });
  }

  // Adicionar efeito de hover nos cards
  addHoverEffects() {
    const cards = document.querySelectorAll(
      ".skill-card, .project-card, .contact-card"
    );

    cards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        card.style.transform = "translateY(-10px) scale(1.02)";
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "translateY(0) scale(1)";
      });
    });
  }

  // Adicionar animação de digitação para o título
  addTypingEffect(elementSelector, text, speed = 100) {
    const element = document.querySelector(elementSelector);
    if (!element) return;

    element.innerHTML = "";
    let i = 0;

    const typeWriter = () => {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        setTimeout(typeWriter, speed);
      }
    };

    typeWriter();
  }

  // Adicionar efeito de parallax simples
  addParallaxEffect() {
    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll(".parallax");

      parallaxElements.forEach((element) => {
        const speed = element.dataset.speed || 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
      });
    });
  }
}

// Inicializar efeitos de UI quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", function () {
  const uiEffects = new UIEffects();

  // Adicionar efeitos adicionais após um pequeno delay
  setTimeout(() => {
    uiEffects.addHoverEffects();
  }, 1000);
});

// Exportar para uso global
window.UIEffects = UIEffects;
