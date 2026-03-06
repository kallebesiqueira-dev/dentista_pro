// Gestione navbar: sfondo al scroll
const siteHeader = document.getElementById('siteHeader');
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

function setHeaderState() {
  if (siteHeader) {
    siteHeader.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', setHeaderState);
setHeaderState();

// Menu mobile
if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Fade-in elegante allo scroll
const revealElements = Array.from(document.querySelectorAll('.reveal, .reveal-delay, .reveal-delay-2')).filter(
  (element) => !element.closest('.studio-gallery')
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.2,
    rootMargin: '0px 0px -40px 0px'
  }
);

revealElements.forEach((element) => revealObserver.observe(element));

// Studio gallery: mostra una foto per scroll con movimento casuale
const studioSection = document.getElementById('studio');
const studioGalleryItems = Array.from(document.querySelectorAll('#studio .studio-gallery .gallery-item'));

if (studioSection && studioGalleryItems.length) {
  document.body.classList.add('studio-sequential');

  let revealedCount = 0;
  let lastRevealAt = 0;
  let wheelAccumulator = 0;
  const motionClasses = ['fx-from-left', 'fx-from-right', 'fx-from-up', 'fx-zoom-in', 'fx-tilt-in'];

  function sectionIsActive() {
    const rect = studioSection.getBoundingClientRect();
    return rect.top < window.innerHeight * 0.82 && rect.bottom > window.innerHeight * 0.22;
  }

  function revealNextGalleryItem() {
    if (revealedCount >= studioGalleryItems.length) {
      return;
    }

    const item = studioGalleryItems[revealedCount];
    const randomClass = motionClasses[Math.floor(Math.random() * motionClasses.length)];

    if (revealedCount === 1) {
      item.style.setProperty('--studio-reveal-duration', '1.65s');
    } else {
      item.style.setProperty('--studio-reveal-duration', '0.78s');
    }

    item.classList.add('is-random-visible', randomClass);
    revealedCount += 1;
  }

  window.addEventListener(
    'wheel',
    (event) => {
      const activeStudio = sectionIsActive();

      if (!activeStudio) {
        if (event.deltaY < 0) {
          wheelAccumulator = 0;
        }
        return;
      }

      if (event.deltaY <= 0) {
        wheelAccumulator = 0;
        return;
      }

      const now = Date.now();

      wheelAccumulator += event.deltaY;

      if (wheelAccumulator < 65) {
        return;
      }

      wheelAccumulator = 0;
      if (now - lastRevealAt > 260) {
        const previousCount = revealedCount;
        revealNextGalleryItem();

        if (revealedCount > previousCount) {
          lastRevealAt = now;
        }
      }
    },
    { passive: true }
  );

  const studioObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && revealedCount === 0) {
          revealNextGalleryItem();
          studioObserver.disconnect();
        }
      });
    },
    {
      threshold: 0.35
    }
  );

  studioObserver.observe(studioSection);
}

// Demo UX: blocca submit e mostra conferma rapida
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    alert('Grazie! Ti contatteremo al più presto per confermare la visita.');
    contactForm.reset();
  });
}
