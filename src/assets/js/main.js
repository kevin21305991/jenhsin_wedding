import '../css/style.sass';
import $ from 'jquery';
window.jQuery = window.$ = $;
import LazyLoad from 'vanilla-lazyload';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';
import { Fancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';
import './anchor';

gsap.registerPlugin(ScrollTrigger);

/**
 * GSAP 動畫相關
 */
function gsapHandler() {
  const targets = document.querySelectorAll('[data-aost]');
  targets.forEach((target, index) => {
    const start = target.getAttribute('data-aost-start') || '75%';
    const defaultOptions = {
      trigger: target,
      id: index + 1,
      start: `top ${start}`,
      end: () => `+=${target.clientHeight}`,
      // toggleActions: 'play reverse none reverse',
      // toggleClass: { targets: target, className: 'is-active' },
      onEnter: () => {
        target.classList.add('is-active');
      },
      onLeaveBack: () => {
        target.classList.remove('is-active');
      },
      // markers: true,
    };
    ScrollTrigger.create(defaultOptions);
  });

  gsap.to('footer .heart path', {
    'stroke-dashoffset': '0',
    scrollTrigger: {
      trigger: 'footer .heart',
      start: '0 80%',
      end: '+=60',
      scrub: 1,
      // markers: true,
    },
  });
}

function switchEventStatus(status) {
  const statusText = $('.status-text');
  switch (status) {
    case -1:
      console.log('敬請期待');
      statusText.text('敬請期待').fadeIn();
      break;
    case 0:
      console.log('活動即將開始');
      statusText.fadeOut();
      $('.countdown-block').delay(1000).fadeIn();
      break;
    case 1:
      console.log('活動開始');
      $('.bless-section').addClass('start');
      $('.minutes').text('00');
      $('.seconds').text('00');
      statusText.fadeOut();
      $('.countdown-block').delay(1000).fadeIn();
      break;
  }
}

/**
 * 倒數計時
 */
function countdown(seconds) {
  let countdownInterval;
  const countdownEl = $('.countdown');
  const minutesEl = $('.minutes');
  const secondsEl = $('.seconds');
  const setSeconds = Number(seconds) / 1000 + 1;
  let setTime = Math.floor(setSeconds / 60) + ':' + (setSeconds % 60);
  countdownInterval = setInterval(() => {
    const timer = setTime.split(':');
    let minutes = parseInt(timer[0], 10);
    let seconds = parseInt(timer[1], 10);
    --seconds;
    minutes = seconds < 0 ? --minutes : minutes;
    minutes = minutes < 10 ? (minutes = '0' + minutes) : minutes;
    seconds = seconds < 0 ? 59 : seconds;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    setTime = minutes + ':' + seconds;
    minutesEl.text(minutes);
    secondsEl.text(seconds);
    if (minutes == 0 && seconds == 0) {
      console.log('倒數結束');
      switchEventStatus(1);
      clearInterval(countdownInterval);
    }
  }, 1000);
}

/**
 * 設定活動時間
 */
function setEventTime(prepare, start) {
  const prepareDate = new Date(prepare);
  const startDate = new Date(start); //
  const currentDate = new Date(); //進到畫面時的時間
  const timeUntilPrepare = prepareDate - currentDate;
  const timeUntilStart = startDate - currentDate;
  if (timeUntilPrepare > 0) {
    switchEventStatus(-1);
  }
  if (timeUntilStart >= 0) {
    if (timeUntilPrepare.toString().length >= 10) {
      switchEventStatus(-1);
      return;
    }
    const now = new Date();
    const timeout = setTimeout(() => {
      switchEventStatus(0);
      countdown(startDate - now);
    }, timeUntilPrepare);
  } else if (timeUntilStart < 0) {
    switchEventStatus(1);
  }
}

(function () {
  const lazyLoadInstance = new LazyLoad();
  const currentTime = new Date();
  const afterThirtySec = new Date(currentTime.getTime() + 10000);
  setEventTime(currentTime, afterThirtySec);
  // setEventTime('2023-11-11T17:00:00', '2023-11-11T18:00:00');
  gsapHandler();
  Fancybox.bind('[data-fancybox]', {
    // Your custom options
    contentClick: false,
    Toolbar: {
      display: {
        right: ['slideshow', 'close'],
      },
    },
  });
})();
