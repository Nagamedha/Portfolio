/* ================ Loader ================= */
function hideLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  loader.style.opacity = '0';
  setTimeout(() => { loader.style.display = 'none'; }, 500);
}

// Hide when everything finishes loading
window.addEventListener('load', () => {
  // small delay so the spinner doesn’t flash away instantly
  setTimeout(hideLoader, 600);
});

// Safety fallback: hide loader after 3.5s even if something stalls load
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader && loader.style.display !== 'none') hideLoader();
  }, 3500);
});

/* ================ Scroll Progress ================= */
(function setupScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  const onScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    bar.style.width = pct + '%';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ================ Navbar active link ================= */
(function setupActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const onScroll = () => {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 200;
      if (window.scrollY >= top) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ================ Reveal on scroll ================= */
(function setupReveal() {
  const animated = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
  if (!animated.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  animated.forEach(el => observer.observe(el));
})();

/* ================ Hero particles ================= */
(function particles() {
  const host = document.getElementById('hero-particles');
  if (!host) return;
  function createParticle() {
    const d = document.createElement('div');
    d.className = 'particle';
    d.style.left = Math.random() * 100 + '%';
    const s = (Math.random() * 6 + 2) + 'px';
    d.style.width = s; d.style.height = s;
    d.style.animationDuration = (Math.random() * 3 + 5) + 's';
    d.style.animationDelay = Math.random() * 2 + 's';
    host.appendChild(d);
    setTimeout(() => d.remove(), 8000);
  }
  // create gently
  const id = setInterval(createParticle, 200);
  // stop if user navigates away
  window.addEventListener('beforeunload', () => clearInterval(id));
})();

/* ================ Stat counters ================= */
(function counters() {
  const nums = document.querySelectorAll('.stat-number[data-counter]');
  if (!nums.length) return;

  function animate(el) {
    const target = +el.getAttribute('data-counter');
    if (!target || isNaN(target)) return;
    const duration = 900;
    const start = performance.now();
    const initial = 0;

    function step(now) {
      const p = Math.min(1, (now - start) / duration);
      const val = Math.floor(initial + (target - initial) * p);
      el.textContent = target >= 100 ? val + (target >= 100 ? (el.textContent.includes('%') ? '%' : '+') : '') : val + '+';
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = (target + (el.textContent.includes('%') ? '%' : '+'));
    }
    requestAnimationFrame(step);
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animate(e.target);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });

  nums.forEach(n => io.observe(n));
})();

/* ================ Smooth anchor scroll ================= */
(function smoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      const target = id && document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

/* ===== Fixed navbar offset (prevents hero being covered) ===== */
(function fixNavOffset(){
  const nav = document.getElementById('navbar');
  if (!nav) return;
  function updateNavH(){
    const h = nav.getBoundingClientRect().height;
    document.documentElement.style.setProperty('--nav-h', h + 'px');
  }
  updateNavH();
  window.addEventListener('resize', updateNavH, { passive: true });
  // Re-run after fonts load (sizes can change)
  window.addEventListener('load', updateNavH);
})();


/* ================ Navbar on scroll styling ================= */
(function navbarScrollStyle() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  const onScroll = () => {
    if (window.scrollY > 100) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* === SECTION FLOATERS (books & medals) ===
   Creates subtle animated icons that drift upwards behind content.
   Colors constrained to white/off-white/violet tints (CSS classes). */

(function initFloaters() {
  const ICONS = {
  books:  ["📘","📗","📙","📕","📚"],      // Education
  medals: ["🏅","🎖️","🏆"],               // Awards
  skills: ["⚙️","🧠","💻","📊","🧪"],      // Skills
  contact:["✉️","📞","💬","🌐","📍"]       // Contact
};


  const SECTIONS = document.querySelectorAll('.bg-floaters');
  if (!SECTIONS.length) return;

  SECTIONS.forEach(container => {
    const type = container.getAttribute('data-floaters');
    const set = ICONS[type] || [];
    const count = 12; // adjust density

    for (let i = 0; i < count; i++) {
      const span = document.createElement('span');
      span.className = 'bg-floater floater-tint-' + (1 + (i % 5));
      span.textContent = set[i % set.length];

      // randomize start
      const left = Math.random() * 100;         // %
      const delay = Math.random() * 6;          // s
      const duration = 10 + Math.random() * 10; // 10–20s
      const scale = 0.8 + Math.random() * 1.2;  // 0.8–2.0
      const horizDrift = (Math.random() - 0.5) * 40; // px side wiggle via CSS variable

      span.style.left = left + '%';
      span.style.bottom = '-40px';
      span.style.animationDuration = duration + 's';
      span.style.animationDelay = delay + 's';
      span.style.transform = `translateY(40px) translateX(${horizDrift}px) scale(${scale})`;

      // gentle alternating side sway
      span.animate(
        [
          { transform: `translateY(40px) translateX(${horizDrift}px) scale(${scale})` },
          { transform: `translateY(-120vh) translateX(${horizDrift * -1}px) scale(${scale})` }
        ],
        { duration: (duration * 1000), delay: (delay * 1000), iterations: Infinity, easing: 'linear' }
      );

      container.appendChild(span);
    }
  });
})();

// set --nav-h so hero never hides under the fixed nav
(function fixNavOffset(){
  const nav = document.getElementById('navbar');
  if(!nav) return;
  function update(){ document.documentElement.style.setProperty('--nav-h', nav.getBoundingClientRect().height + 'px'); }
  update(); window.addEventListener('resize', update, {passive:true}); window.addEventListener('load', update);
})();

// mobile hamburger toggle
(function(){
  const nav = document.getElementById('navbar');
  const btn = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  if(!nav || !btn || !menu) return;
  btn.addEventListener('click',()=>{
    const open = nav.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  // close after clicking a link
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click',()=>{
    nav.classList.remove('is-open'); btn.setAttribute('aria-expanded','false');
  }));
})();


