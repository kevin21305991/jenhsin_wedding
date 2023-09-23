import '../css/style.sass';
import LazyLoad from 'vanilla-lazyload';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';
// import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin.js';
gsap.registerPlugin(ScrollTrigger);

function anchorHandler() {
  function anchorTo(target) {
    const targetSection = document.querySelector(target);
    window.scrollTo({
      top: targetSection ? targetSection.offsetTop : 0,
      behavior: 'smooth',
    });
  }
  function anchorClick(e) {
    let isTarget = false;
    const allAnchorBtn = document.querySelectorAll('.anchor-btn');
    for (const targetElement of allAnchorBtn) {
      if (targetElement.contains(e.target) || e.target.closest('.anchor-btn') === targetElement) {
        isTarget = true;
        break;
      }
    }
    if (isTarget) {
      const anchorTarget = e.target.closest('.anchor-btn').getAttribute('anchor-target');
      anchorTo(anchorTarget);
    }
  }

  document.addEventListener('click', anchorClick);
}

function gsapHandler() {
  const targets = document.querySelectorAll('[data-aost]');
  targets.forEach((target, index) => {
    const defaultOptions = {
      trigger: target,
      id: index + 1,
      start: 'top center',
      end: () => `+=${target.clientHeight}`,
      // toggleActions: 'play reverse none reverse',
      // toggleClass: { targets: target, className: 'is-active' },
      onEnter: () => {
        target.classList.add('is-active');
      },
      // markers: true,
    };
    ScrollTrigger.create(defaultOptions);
  });

  gsap.to('.heart path', {
    'stroke-dashoffset': '0',
    scrollTrigger: {
      trigger: '.heart',
      start: '-=60 80%',
      end: '+=180',
      scrub: 0.5,
      // markers: true,
    },
  });
}

(function () {
  const lazyLoadInstance = new LazyLoad();
  anchorHandler();
  gsapHandler();
})();
