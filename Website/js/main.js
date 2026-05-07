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
  initInquiryFollowUp();
  initCopyGuard();
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

  var trigger = dropdown.querySelector('.navbar__dropdown-trigger');
  var megaMenu = dropdown.querySelector('.navbar__mega-menu');
  var groups = dropdown.querySelectorAll('.mega-menu__group');
  var closeTimer = null;
  var CLOSE_DELAY = 220;

  function setExpanded(isOpen) {
    if (trigger) trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  }
  function open() {
    if (closeTimer) { clearTimeout(closeTimer); closeTimer = null; }
    dropdown.classList.add('is-open');
    setExpanded(true);
  }
  function close() {
    dropdown.classList.remove('is-open');
    groups.forEach(function(g) { g.classList.remove('is-expanded'); });
    setExpanded(false);
  }
  function scheduleClose() {
    if (closeTimer) clearTimeout(closeTimer);
    closeTimer = setTimeout(close, CLOSE_DELAY);
  }

  dropdown.addEventListener('mouseenter', open);
  dropdown.addEventListener('mouseleave', scheduleClose);
  if (megaMenu) {
    megaMenu.addEventListener('mouseenter', open);
    megaMenu.addEventListener('mouseleave', scheduleClose);
  }

  // Click on the "Services" label should NEVER navigate to a page —
  // it only toggles the dropdown so the user can pick a bucket.
  if (trigger) {
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      if (dropdown.classList.contains('is-open')) {
        close();
      } else {
        open();
      }
    });
    trigger.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        open();
      } else if (e.key === 'Escape') {
        close();
        trigger.blur();
      }
    });
  }

  // Click outside to close
  document.addEventListener('click', function(e) {
    if (!dropdown.contains(e.target)) close();
  });

  groups.forEach(function(group) {
    group.addEventListener('mouseenter', function() {
      groups.forEach(function(g) { g.classList.remove('is-expanded'); });
      group.classList.add('is-expanded');
    });
  });

  // Internal preview helper: open menu when ?openmenu is present (no UI impact).
  if (location.search.indexOf('openmenu') !== -1) open();

  var trigger = document.querySelector('.mobile-nav__accordion-trigger');
  var panel = document.querySelector('.mobile-nav__accordion-panel');
  if (trigger && panel) {
    // Auto-expand the services accordion on services pages so the active bucket is visible
    if (document.querySelector('.mobile-nav__group-label.is-current')) {
      trigger.classList.add('is-open');
      panel.classList.add('is-open');
    }
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

/* =============================================================
   Inquiry follow-up: when a user picks Household / Relocation /
   Pet / Fine Art / Auto, ask Within India vs International and
   show searchable from-to city or country pickers.
   ============================================================= */

const FOLLOWUP_INQUIRIES = new Set([
  'household',
  'destination',
  'pet',
  'fine-art',
  'auto'
]);

const INDIA_CITIES = [
  'Agra','Ahmedabad','Ajmer','Aligarh','Allahabad','Amravati','Amritsar','Asansol','Aurangabad','Bareilly',
  'Belgaum','Bengaluru','Bhavnagar','Bhilai','Bhiwandi','Bhopal','Bhubaneswar','Bikaner','Bilaspur','Chandigarh',
  'Chennai','Coimbatore','Cuttack','Dehradun','Delhi','Dhanbad','Durgapur','Erode','Faridabad','Firozabad',
  'Ghaziabad','Goa','Gorakhpur','Gulbarga','Guntur','Gurugram','Guwahati','Gwalior','Howrah','Hubli',
  'Hyderabad','Indore','Jabalpur','Jaipur','Jalandhar','Jammu','Jamnagar','Jamshedpur','Jhansi','Jodhpur',
  'Kakinada','Kalyan-Dombivli','Kannur','Kanpur','Kochi','Kolhapur','Kolkata','Kollam','Kota','Kozhikode',
  'Kurnool','Lucknow','Ludhiana','Madurai','Maheshtala','Malappuram','Mangaluru','Mathura','Meerut','Mira-Bhayandar',
  'Moradabad','Mumbai','Mysuru','Nagpur','Nanded','Nashik','Navi Mumbai','Nellore','New Delhi','Noida',
  'Patna','Pimpri-Chinchwad','Pondicherry','Prayagraj','Pune','Purnia','Raipur','Rajahmundry','Rajkot','Ranchi',
  'Rohtak','Rourkela','Saharanpur','Salem','Sangli','Shillong','Shimla','Siliguri','Solapur','Srinagar',
  'Surat','Thane','Thiruvananthapuram','Thrissur','Tiruchirappalli','Tirunelveli','Tirupati','Tirupur','Tumkur','Udaipur',
  'Ujjain','Vadodara','Varanasi','Vasai-Virar','Vellore','Vijayawada','Visakhapatnam','Warangal'
];

const COUNTRIES = [
  'Afghanistan','Albania','Algeria','Andorra','Angola','Argentina','Armenia','Australia','Austria','Azerbaijan',
  'Bahamas','Bahrain','Bangladesh','Barbados','Belarus','Belgium','Belize','Benin','Bhutan','Bolivia',
  'Bosnia and Herzegovina','Botswana','Brazil','Brunei','Bulgaria','Burkina Faso','Burundi','Cambodia','Cameroon','Canada',
  'Cape Verde','Central African Republic','Chad','Chile','China','Colombia','Comoros','Congo','Costa Rica','Croatia',
  'Cuba','Cyprus','Czech Republic','Denmark','Djibouti','Dominica','Dominican Republic','Ecuador','Egypt','El Salvador',
  'Equatorial Guinea','Eritrea','Estonia','Eswatini','Ethiopia','Fiji','Finland','France','Gabon','Gambia',
  'Georgia','Germany','Ghana','Greece','Grenada','Guatemala','Guinea','Guinea-Bissau','Guyana','Haiti',
  'Honduras','Hungary','Iceland','India','Indonesia','Iran','Iraq','Ireland','Israel','Italy',
  'Ivory Coast','Jamaica','Japan','Jordan','Kazakhstan','Kenya','Kiribati','Kuwait','Kyrgyzstan','Laos',
  'Latvia','Lebanon','Lesotho','Liberia','Libya','Liechtenstein','Lithuania','Luxembourg','Madagascar','Malawi',
  'Malaysia','Maldives','Mali','Malta','Marshall Islands','Mauritania','Mauritius','Mexico','Micronesia','Moldova',
  'Monaco','Mongolia','Montenegro','Morocco','Mozambique','Myanmar','Namibia','Nauru','Nepal','Netherlands',
  'New Zealand','Nicaragua','Niger','Nigeria','North Korea','North Macedonia','Norway','Oman','Pakistan','Palau',
  'Palestine','Panama','Papua New Guinea','Paraguay','Peru','Philippines','Poland','Portugal','Qatar','Romania',
  'Russia','Rwanda','Saint Kitts and Nevis','Saint Lucia','Saint Vincent and the Grenadines','Samoa','San Marino',
  'Sao Tome and Principe','Saudi Arabia','Senegal','Serbia','Seychelles','Sierra Leone','Singapore','Slovakia','Slovenia',
  'Solomon Islands','Somalia','South Africa','South Korea','South Sudan','Spain','Sri Lanka','Sudan','Suriname',
  'Sweden','Switzerland','Syria','Taiwan','Tajikistan','Tanzania','Thailand','Timor-Leste','Togo','Tonga',
  'Trinidad and Tobago','Tunisia','Turkey','Turkmenistan','Tuvalu','Uganda','Ukraine','United Arab Emirates','United Kingdom',
  'United States','Uruguay','Uzbekistan','Vanuatu','Vatican City','Venezuela','Vietnam','Yemen','Zambia','Zimbabwe'
];

function initInquiryFollowUp() {
  const selects = document.querySelectorAll('[data-inquiry-select]');
  if (!selects.length) return;

  selects.forEach((select) => {
    const panel = findFollowupPanel(select);
    if (!panel) return;

    select.addEventListener('change', () => {
      renderFollowup(select, panel);
    });
  });
}

function findFollowupPanel(select) {
  const form = select.closest('form');
  if (!form) return null;
  return form.querySelector('[data-inquiry-followup]');
}

function renderFollowup(select, panel) {
  const value = select.value;
  if (!FOLLOWUP_INQUIRIES.has(value)) {
    panel.innerHTML = '';
    panel.hidden = true;
    return;
  }

  const scopeGroupName = `scope-${uid()}`;
  panel.hidden = false;
  panel.innerHTML = `
    <div class="inquiry-followup__inner">
      <div class="inquiry-followup__row">
        <span class="inquiry-followup__label">Where is the move?</span>
        <div class="inquiry-followup__segmented" role="radiogroup" aria-label="Move scope">
          <label><input type="radio" name="${scopeGroupName}" value="india" checked> Within India</label>
          <label><input type="radio" name="${scopeGroupName}" value="international"> International</label>
        </div>
      </div>
      <div class="inquiry-followup__pickers" data-pickers></div>
    </div>
  `;

  const radios = panel.querySelectorAll('input[type="radio"]');
  const pickers = panel.querySelector('[data-pickers]');
  const renderPickers = (scope) => {
    const list = scope === 'india' ? INDIA_CITIES : COUNTRIES;
    const labelType = scope === 'india' ? 'city' : 'country';
    pickers.innerHTML = `
      <div class="inquiry-followup__row inquiry-followup__row--two">
        ${buildComboboxMarkup('from', `From ${labelType}`)}
        ${buildComboboxMarkup('to', `To ${labelType}`)}
      </div>
    `;
    pickers.querySelectorAll('[data-combobox]').forEach((cb) => initCombobox(cb, list));
  };

  renderPickers('india');
  radios.forEach((r) => {
    r.addEventListener('change', () => renderPickers(r.value));
  });
}

let _uid = 0;
function uid() { _uid += 1; return 'fu' + _uid; }

function buildComboboxMarkup(role, label) {
  const id = uid();
  return `
    <div class="combobox" data-combobox data-role="${role}">
      <input type="text" class="combobox__input" placeholder="${label}" autocomplete="off" aria-label="${label}" id="${id}">
      <ul class="combobox__list" role="listbox" hidden></ul>
    </div>
  `;
}

function initCombobox(root, options) {
  const input = root.querySelector('.combobox__input');
  const list = root.querySelector('.combobox__list');
  if (!input || !list) return;

  const filter = (q) => {
    const norm = q.trim().toLowerCase();
    const limit = 60;
    const matched = norm
      ? options.filter((o) => o.toLowerCase().includes(norm)).slice(0, limit)
      : options.slice(0, limit);
    return matched;
  };

  const render = (q) => {
    const matched = filter(q);
    list.innerHTML = '';
    matched.forEach((opt) => {
      const li = document.createElement('li');
      li.className = 'combobox__option';
      li.role = 'option';
      li.textContent = opt;
      li.addEventListener('mousedown', (e) => {
        e.preventDefault();
        input.value = opt;
        list.hidden = true;
      });
      list.appendChild(li);
    });
    const otherLi = document.createElement('li');
    otherLi.className = 'combobox__option combobox__option--other';
    otherLi.role = 'option';
    otherLi.textContent = 'Other (type to specify)';
    otherLi.addEventListener('mousedown', (e) => {
      e.preventDefault();
      input.value = q && !options.some((o) => o.toLowerCase() === q.toLowerCase()) ? q : 'Other';
      list.hidden = true;
      input.focus();
    });
    list.appendChild(otherLi);
    list.hidden = matched.length === 0 && !q ? true : false;
  };

  input.addEventListener('focus', () => { render(input.value); list.hidden = false; });
  input.addEventListener('input', () => { render(input.value); list.hidden = false; });
  input.addEventListener('blur', () => {
    setTimeout(() => { list.hidden = true; }, 120);
  });
}

/* =============================================================
   Copy guard: block Ctrl/Cmd+C, copy/cut events, and right-click
   contextmenu globally — except on elements marked [data-allow-copy]
   (phone, email, address). Also disable text selection via CSS in
   style.css; this script is the runtime fallback.
   ============================================================= */

function initCopyGuard() {
  const isAllowed = (target) => !!(target && target.closest && target.closest('[data-allow-copy]'));
  const isFormField = (target) => {
    if (!target) return false;
    const t = target.tagName;
    return t === 'INPUT' || t === 'TEXTAREA' || t === 'SELECT' || (target.isContentEditable === true);
  };

  document.addEventListener('copy', (e) => {
    if (isAllowed(e.target) || isFormField(e.target)) return;
    e.preventDefault();
  });

  document.addEventListener('cut', (e) => {
    if (isAllowed(e.target) || isFormField(e.target)) return;
    e.preventDefault();
  });

  document.addEventListener('contextmenu', (e) => {
    if (isAllowed(e.target) || isFormField(e.target)) return;
    e.preventDefault();
  });

  document.addEventListener('keydown', (e) => {
    const ctrl = e.ctrlKey || e.metaKey;
    if (!ctrl) return;
    const k = (e.key || '').toLowerCase();
    if (k !== 'c' && k !== 'x') return;
    const target = document.activeElement;
    if (isAllowed(target) || isFormField(target)) return;
    const sel = window.getSelection && window.getSelection();
    if (sel && sel.toString()) {
      const node = sel.anchorNode && (sel.anchorNode.nodeType === 1 ? sel.anchorNode : sel.anchorNode.parentElement);
      if (isAllowed(node)) return;
    }
    e.preventDefault();
  });

  document.addEventListener('dragstart', (e) => {
    if (isAllowed(e.target) || isFormField(e.target)) return;
    e.preventDefault();
  });
}
