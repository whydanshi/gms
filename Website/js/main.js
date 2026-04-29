document.addEventListener('DOMContentLoaded', () => {
  initHeroAnimation();
  initHeroCarousel();
  initNavbar();
  initMobileMenu();
  initMegaMenu();
  initScrollReveal();
  initCounters();
  initQuoteModal();
  initContactCopy();
  initIndiaMapTooltips();
});

function initHeroCarousel() {
  const carousel = document.querySelector('.hero-carousel');
  if (!carousel) return;

  const slides = carousel.querySelectorAll('.hero-carousel__slide');
  if (slides.length < 2) return;

  let current = 0;

  function advance() {
    var prev = current;
    current = (current + 1) % slides.length;

    slides[prev].classList.remove('hero-carousel__slide--active');
    slides[prev].classList.add('hero-carousel__slide--exiting');

    slides[current].classList.add('hero-carousel__slide--active');

    setTimeout(function () {
      slides[prev].classList.remove('hero-carousel__slide--exiting');
    }, 1500);
  }

  setInterval(advance, 5000);
}

function initHeroAnimation() {
  const hero = document.getElementById('hero');
  if (!hero) return;

  const line1 = hero.querySelector('.hero__heading .line1');
  const line2 = hero.querySelector('.hero__heading .line2');
  if (!line1 || !line2) return;

  function getTextCenter(el) {
    const range = document.createRange();
    range.selectNodeContents(el);
    const rect = range.getBoundingClientRect();
    return rect.left + rect.width / 2;
  }

  // Phase 1: set starting positions
  // Movement starts centered
  line1.style.textAlign = 'center';
  line1.style.paddingLeft = '0';
  // Redefined starts flush left
  line2.style.textAlign = 'left';
  line2.style.paddingLeft = '0';

  line1.style.opacity = '1';
  line2.style.opacity = '1';

  setTimeout(() => {
    // Measure starting text center positions
    const start1 = getTextCenter(line1);
    const start2 = getTextCenter(line2);

    // Switch to final CSS state
    line1.style.textAlign = '';
    line1.style.paddingLeft = '';
    line2.style.textAlign = '';
    line2.style.paddingLeft = '';

    // Measure final text center positions
    const end1 = getTextCenter(line1);
    const end2 = getTextCenter(line2);

    const dx1 = start1 - end1;
    const dx2 = start2 - end2;

    // Snap to starting position via transform
    line1.style.transition = 'none';
    line2.style.transition = 'none';
    line1.style.transform = 'translateX(' + dx1 + 'px)';
    line2.style.transform = 'translateX(' + dx2 + 'px)';

    void line1.offsetHeight;

    // Animate to final position
    const ease = 'transform 1.1s cubic-bezier(0.22, 1, 0.36, 1)';
    line1.style.transition = ease;
    line2.style.transition = ease;
    line1.style.transform = 'translateX(0)';
    line2.style.transform = 'translateX(0)';

    hero.classList.add('hero--final');
  }, 1200);
}

function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const logoImg = navbar?.querySelector('.navbar__logo img');
  if (!navbar) return;

  const hasHero = !!document.querySelector('.hero-wrapper, .hero');
  if (!hasHero) {
    navbar.classList.add('navbar--scrolled');
    if (logoImg) logoImg.src = 'assets/GMS-logo.svg';
  }

  const onScroll = () => {
    const scrolled = !hasHero || window.scrollY > 60;
    navbar.classList.toggle('navbar--scrolled', scrolled);
    if (logoImg) {
      logoImg.src = scrolled
        ? 'assets/GMS-logo.svg'
        : 'assets/GMS-logo-white.svg';
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function initMobileMenu() {
  const hamburger = document.querySelector('.navbar__hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (!hamburger || !mobileNav) return;

  const toggle = () => {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  };

  hamburger.addEventListener('click', toggle);
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

function initMegaMenu() {
  var dropdown = document.querySelector('.navbar__dropdown');
  if (!dropdown) return;

  var megaMenu = dropdown.querySelector('.navbar__mega-menu');
  var groups = dropdown.querySelectorAll('.mega-menu__group');
  var closeTimer = null;
  var CLOSE_DELAY = 220;

  function open() {
    if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
    dropdown.classList.add('is-open');
  }
  function scheduleClose() {
    if (closeTimer) clearTimeout(closeTimer);
    closeTimer = setTimeout(function() {
      dropdown.classList.remove('is-open');
      groups.forEach(function(g) { g.classList.remove('is-expanded'); });
    }, CLOSE_DELAY);
  }

  dropdown.addEventListener('mouseenter', open);
  dropdown.addEventListener('mouseleave', scheduleClose);
  if (megaMenu) {
    megaMenu.addEventListener('mouseenter', open);
    megaMenu.addEventListener('mouseleave', scheduleClose);
  }

  groups.forEach(function(group) {
    group.addEventListener('mouseenter', function() {
      groups.forEach(function(g) { g.classList.remove('is-expanded'); });
      group.classList.add('is-expanded');
    });
  });

  var trigger = document.querySelector('.mobile-nav__accordion-trigger');
  var panel = document.querySelector('.mobile-nav__accordion-panel');
  if (trigger && panel) {
    trigger.addEventListener('click', function() {
      trigger.classList.toggle('is-open');
      panel.classList.toggle('is-open');
    });
    panel.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        var hamburger = document.querySelector('.navbar__hamburger');
        var mobileNav = document.querySelector('.mobile-nav');
        if (hamburger) hamburger.classList.remove('active');
        if (mobileNav) mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }
}

function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => observer.observe(el));
}

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target).toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

function initQuoteModal() {
  const overlay = document.querySelector('.quote-modal-overlay');
  const modal = document.querySelector('.quote-modal');
  if (!overlay || !modal) return;

  const triggers = document.querySelectorAll('[data-quote-trigger]');
  const closeBtn = modal.querySelector('.quote-modal__close');

  const open = (e) => {
    if (e) e.preventDefault();
    overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };

  const close = () => {
    overlay.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  triggers.forEach(btn => {
    btn.addEventListener('click', open);
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) close();
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', close);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
      close();
    }
  });
}

function initContactCopy() {
  const items = document.querySelectorAll('.contact-highlight__item');
  if (!items.length) return;

  const baseLabel = 'Click to copy';

  items.forEach((item) => {
    const valueEl = item.querySelector('span');
    if (!valueEl) return;
    const text = valueEl.textContent.trim();
    item.dataset.copyValue = text;
    item.dataset.copyLabel = baseLabel;

    const reset = () => {
      item.dataset.copyLabel = baseLabel;
      item.classList.remove('is-copied');
    };

    item.addEventListener('click', (e) => {
      e.preventDefault();
      const toCopy = item.dataset.copyValue;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(toCopy).then(() => {
          item.dataset.copyLabel = 'Copied ✓';
          item.classList.add('is-copied');
          setTimeout(reset, 2000);
        }).catch(reset);
      } else {
        reset();
      }
    });
  });
}

function initIndiaMapTooltips() {
  const mapDots = document.querySelectorAll('.india-map__dot');
  if (!mapDots.length) return;

  mapDots.forEach((dot) => {
    const title = dot.querySelector('title');
    if (!title) return;

    const locationName = title.textContent;

    dot.addEventListener('mouseenter', () => {
      const tooltip = document.createElement('div');
      tooltip.className = 'india-map__tooltip';
      tooltip.textContent = locationName;
      tooltip.style.cssText = `
        position: fixed;
        background: rgba(0, 0, 0, 0.85);
        color: #fff;
        padding: 6px 10px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;
        white-space: nowrap;
        pointer-events: none;
        z-index: 1000;
        font-family: 'Plus Jakarta Sans', sans-serif;
      `;
      
      document.body.appendChild(tooltip);
      
      const rect = dot.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      
      tooltip.style.left = (rect.left + rect.width / 2 - tooltipRect.width / 2) + 'px';
      tooltip.style.top = (rect.top - tooltipRect.height - 8) + 'px';
      
      const moveTooltip = () => {
        const newRect = dot.getBoundingClientRect();
        const newTooltipRect = tooltip.getBoundingClientRect();
        tooltip.style.left = (newRect.left + newRect.width / 2 - newTooltipRect.width / 2) + 'px';
        tooltip.style.top = (newRect.top - newTooltipRect.height - 8) + 'px';
      };
      
      document.addEventListener('mousemove', moveTooltip);
      
      const handleMouseLeave = () => {
        tooltip.remove();
        document.removeEventListener('mousemove', moveTooltip);
        dot.removeEventListener('mouseleave', handleMouseLeave);
      };
      
      dot.addEventListener('mouseleave', handleMouseLeave);
    });
  });
}
