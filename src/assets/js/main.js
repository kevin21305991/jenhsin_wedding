import '../css/style.sass';
import $ from 'jquery';
window.jQuery = window.$ = $;
import LazyLoad from 'vanilla-lazyload';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';
import { Fancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';
import { messageInit } from './message';
import './anchor';

/**
 * 滑鼠游標跟隨
 */
function followMouseCursor() {
  const body = $('body');
  const cursor = $('.cursor');
  const cursorItems = $('.cursor .cursor-item');

  cursorItems.each((index, item) => {
    const scale = (10 - index) / 10;
    const delay = index / 10;
    const opacityDelay = (cursorItems.length - 1 - index) / 20;
    const zIndex = cursorItems.length - index;
    $(item).css('--scale', scale);
    $(item).css('--delay', `${delay}s`);
    $(item).css('--zIndex', `${zIndex}`);
    $(item).css('--opacity-delay', `${opacityDelay}s`);
  });

  function mousemoveHandler(e) {
    const x = e.clientX;
    const y = e.clientY;
    cursor.css('--x', `${x - 10}px`);
    cursor.css('--y', `${y - 10}px`);
  }
  function mouseenterHandler() {
    cursorItems.addClass('hover');
  }
  function mouseleaveHandler() {
    cursorItems.removeClass('hover');
  }
  body.on('mousemove', mousemoveHandler);
  body.on('mouseenter', '[interactive]', mouseenterHandler);
  body.on('mouseleave', '[interactive]', mouseleaveHandler);
}

/**
 * GSAP 動畫相關
 */
function gsapHandler() {
  gsap.registerPlugin(ScrollTrigger);
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

/**
 * 活動狀態切換
 * @param {number} status 狀態 -1, 0, 1
 */
function switchEventStatus(status) {
  const statusText = $('.status-text');
  switch (status) {
    case -1:
      // console.log('敬請期待');
      statusText.text('敬請期待').fadeIn();
      break;
    case 0:
      // console.log('活動即將開始');
      statusText.fadeOut();
      $('.countdown-block').delay(1000).fadeIn();
      break;
    case 1:
      // console.log('活動開始');
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
 * @param {number} seconds 欲倒數秒數
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
      switchEventStatus(1);
      clearInterval(countdownInterval);
    }
  }, 1000);
}

/**
 * 設定活動時間
 * @param {string} prepare 活動準備開始時間(date 字串 'YYYY-MM-DDThh:mm:ss')
 * @param {string} start 活動正式開始時間(date 字串 'YYYY-MM-DDThh:mm:ss')
 * @returns
 */
function setEventTime(prepare, start) {
  const prepareDate = new Date(prepare); //活動準備開始時間
  const startDate = new Date(start); //活動正式開始時間
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
    const timeout = setTimeout(() => {
      const now = new Date();
      switchEventStatus(0);
      countdown(startDate - now);
    }, timeUntilPrepare);
  } else if (timeUntilStart < 0) {
    switchEventStatus(1);
  }
}

/**
 * 照片燈箱
 */
function photoLightbox() {
  Fancybox.bind('[data-fancybox]', {
    // Your custom options
    contentClick: false,
    Toolbar: {
      display: {
        right: ['slideshow', 'close'],
      },
    },
  });
}

/**
 * 最終測試
 */
function finalTest(prepareDate, startDate) {
  setEventTime(prepareDate, startDate);
  messageInit(prepareDate);
}

(function () {
  const lazyLoadInstance = new LazyLoad();
  followMouseCursor();
  gsapHandler();
  photoLightbox();
  // setEventTime('2023-11-11T17:00:00', '2023-11-11T18:00:00');
  // messageInit('2023-11-11T17:00:00');
  finalTest('2023-10-13T10:15:00', '2023-10-13T10:16:00');
})();
