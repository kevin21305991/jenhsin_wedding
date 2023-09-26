import '../css/style.sass';
import LazyLoad from 'vanilla-lazyload';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';
// import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin.js';
gsap.registerPlugin(ScrollTrigger);

/**
 * 錨點
 */
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

/**
 * GSAP 動畫相關
 */
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
      start: '0 80%',
      end: '+=60',
      scrub: 1,
      // markers: true,
    },
  });
}

function countdown() {
  let countdownInterval;
  const countdownEl = document.querySelector('.countdown');
  const minutesEl = document.querySelector('.minutes');
  const secondsEl = document.querySelector('.seconds');
  const setSeconds = Number(countdownEl.getAttribute('data-seconds'));
  let setTime = Math.floor(setSeconds / 60) + ':' + (setSeconds % 60);
  countdownInterval = setInterval(() => {
    const timer = setTime.split(':');
    let minutes = parseInt(timer[0], 10);
    let seconds = parseInt(timer[1], 10);
    --seconds;
    minutes = seconds < 0 ? --minutes : minutes;
    minutes = minutes < 10 ? (minutes = '0' + minutes) : minutes;
    if (minutes == 0 && seconds == 0) clearInterval(countdownInterval);
    seconds = seconds < 0 ? 59 : seconds;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    setTime = minutes + ':' + seconds;
    minutesEl.innerText = minutes;
    secondsEl.innerText = seconds;
  }, 1000);
}

(function () {
  const lazyLoadInstance = new LazyLoad();
  anchorHandler();
  gsapHandler();
  countdown();
})();
