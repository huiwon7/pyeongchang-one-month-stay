/* ============================================
   Main JavaScript - Navigation, Scroll, Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollEffects();
  initMobileMenu();
  initSmoothScroll();
  initTabs();
  initActivityFilter();
  initRoomSlider();
  initWeekCards();
});

/* ----------------------------------------
   Navigation - Sticky on scroll
   ---------------------------------------- */
function initNavigation() {
  const nav = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 50) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }

    lastScroll = currentScroll;
  });

  // Active link tracking
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  const observerOptions = {
    rootMargin: '-20% 0px -80% 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/* ----------------------------------------
   Mobile Menu
   ---------------------------------------- */
function initMobileMenu() {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  const overlay = document.getElementById('navOverlay');

  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    menu.classList.toggle('open');
    overlay.classList.toggle('open');
    document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
  });

  overlay.addEventListener('click', () => {
    menu.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  });

  // Close menu on link click
  menu.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ----------------------------------------
   Smooth Scroll
   ---------------------------------------- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (!target) return;

      const navHeight = document.getElementById('navbar').offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });
}

/* ----------------------------------------
   Scroll Effects - Fade in on scroll
   ---------------------------------------- */
function initScrollEffects() {
  const fadeElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  fadeElements.forEach(el => observer.observe(el));

  // Stats counter animation
  const stats = document.querySelectorAll('.intro-stat__number[data-count]');
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(stat => statsObserver.observe(stat));
}

function animateCounter(element) {
  const target = parseInt(element.dataset.count);
  const duration = 1500;
  const start = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = Math.round(eased * target);

    element.textContent = current.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/* ----------------------------------------
   Tabs (Target Audience)
   ---------------------------------------- */
function initTabs() {
  const tabBtns = document.querySelectorAll('#target .tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;

      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      tabPanels.forEach(panel => {
        panel.classList.toggle('active', panel.id === `tab-${tabId}`);
      });
    });
  });
}

/* ----------------------------------------
   Activity Filter
   ---------------------------------------- */
function initActivityFilter() {
  const filterBtns = document.querySelectorAll('.activities-filters .tab-btn');
  const cards = document.querySelectorAll('.activity-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      cards.forEach(card => {
        const category = card.dataset.category;
        const show = filter === 'all' || category === filter;

        card.style.opacity = show ? '1' : '0';
        card.style.transform = show ? 'translateY(0)' : 'translateY(10px)';

        setTimeout(() => {
          card.style.display = show ? '' : 'none';
        }, show ? 0 : 300);

        if (show) {
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        }
      });
    });
  });

  // Add transition to cards
  cards.forEach(card => {
    card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  });
}

/* ----------------------------------------
   Room Slider
   ---------------------------------------- */
function initRoomSlider() {
  const slider = document.getElementById('roomSlider');
  if (!slider) return;

  const track = slider.querySelector('.room-slider__track');
  const slides = slider.querySelectorAll('.room-slide');
  const prevBtn = slider.querySelector('.room-slider__btn--prev');
  const nextBtn = slider.querySelector('.room-slider__btn--next');
  const dots = slider.querySelectorAll('.room-slider__dot');

  let currentSlide = 0;
  const totalSlides = slides.length;

  function goToSlide(index) {
    currentSlide = ((index % totalSlides) + totalSlides) % totalSlides;
    track.style.transform = `translateX(-${currentSlide * 100}%)`;

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
  nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goToSlide(parseInt(dot.dataset.slide));
    });
  });

  // Touch support
  let startX = 0;
  let isDragging = false;

  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
  });

  track.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
    }
    isDragging = false;
  });

  // Auto play
  setInterval(() => goToSlide(currentSlide + 1), 5000);
}

/* ----------------------------------------
   Week Cards (click to expand)
   ---------------------------------------- */
function initWeekCards() {
  const weekCards = document.querySelectorAll('.week-card');

  weekCards.forEach(card => {
    card.addEventListener('click', () => {
      const isActive = card.classList.contains('active');

      weekCards.forEach(c => c.classList.remove('active'));

      if (!isActive) {
        card.classList.add('active');
      }
    });
  });
}
