import moment from 'moment';
import { lock, unlock } from 'tua-body-scroll-lock';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, update, push, child, onValue, get } from 'firebase/database';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';

gsap.registerPlugin(CustomEase);
let isLogin;
/**
 * firebase 連線
 */
function firebaseConnect() {
  const firebaseConfig = {
    apiKey: 'AIzaSyAIqtjj0_M-YQ9hHWVNfJhA-oSfOPUS7pE',
    authDomain: 'jenhsin-wedding-eee11.firebaseapp.com',
    databaseURL: 'https://jenhsin-wedding-eee11-default-rtdb.firebaseio.com',
    projectId: 'jenhsin-wedding-eee11',
    storageBucket: 'jenhsin-wedding-eee11.appspot.com',
    messagingSenderId: '264586019368',
    appId: '1:264586019368:web:27fad029ad93821eac6b1d',
  };

  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);
  const auth = getAuth();
  onAuthStateChanged(auth, user => {
    if (user) {
      // 已登入
      isLogin = true;
    } else {
      // 未登入
      isLogin = false;
    }
  });
}

function login(email, password) {
  const auth = getAuth();
  signInWithEmailAndPassword(auth, email, password)
    .then(userCredential => {
      console.log('login success');
    })
    .catch(error => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
}

function logout() {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      console.log('Sign-out successful');
    })
    .catch(error => {
      console.log('An error happened');
    });
}

function messageHandler(danmuStartDate) {
  let danmuArray = [];
  const messageAside = $('.message-aside');
  const msgWrap = $('.msg-wrap');
  const msgItemDOM = data => `<div class="msg-item">
      <div class="pic-box">
        <img src="./assets/img/balloon/${data.style}.png" alt="">
      </div>
      <div class="txt-box">
        <div class="name">${data.name}</div>
        <div class="content">
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="21" viewBox="0 0 10 21" fill="none">
            <path d="M1.83434 0.129636L10 3.90617L10 21C7.02491 15.1696 0.998786 3.34966 0.694947 2.71361C0.315149 1.91855 -0.254547 0.924696 0.125251 0.328401C0.429089 -0.148635 1.39124 -0.00287425 1.83434 0.129636Z" />
          </svg>
          <P>${data.content}</P>
        </div>
      </div>
    </div>`;

  /**
   * 載入留言
   */
  function loadMessage() {
    const db = getDatabase();
    const dbRef = ref(db, '/users/');
    onValue(dbRef, snapshot => {
      if (!snapshot.exists()) return;
      const isBottom = messageAside.scrollTop() >= messageAside.prop('scrollHeight') - $(window).innerHeight();
      msgWrap.empty();
      if (isBottom) {
        $('.new-tips').removeClass('show');
      } else {
        $('.new-tips').addClass('show');
      }
      for (const key in snapshot.val()) {
        const { status, style, name, content, createdTime } = snapshot.val()[key];
        const exists = danmuArray.some(item => item.id === key);
        msgWrap.append(msgItemDOM(snapshot.val()[key]));
        if (snapshot.val()[key].status === 0 && !exists) {
          danmuArray.push({
            id: key,
            status,
            style,
            name,
            content,
            createdTime,
          });
        }
      }
    });
  }

  /**
   * 建立彈幕
   * @param {object} data 留言相關資料
   */
  function createDanmu() {
    const db = getDatabase();
    const data = danmuArray[0];
    const { id, style, name, content, createdTime } = data;
    const danmuDOM = data => {
      let startOffset, SVGPathD;
      switch (data.style) {
        case 'sun':
          startOffset = '46%';
          SVGPathD = 'M162.6,310.4c0,0,103.4-36.1,232.1,0.5c0,0,28.4,8.5,39.4,4.8';
          break;
        case 'cloud':
          startOffset = '50%';
          SVGPathD = 'M110.9 222.2, L458.9 222.2';
          break;
        case 'moon':
          startOffset = '55%';
          SVGPathD = 'M136.2,273c0,0,100.3-36.2,260.5,20.1';
          break;
        case 'star':
          startOffset = '50%';
          SVGPathD = 'M147.9,265.5c0,0,134.5-55.2,283.8,0';
          break;
        case 'flower':
          startOffset = '50%';
          SVGPathD = 'M147.9,291.5c0,0,134.5-55.2,283.8,0';
          break;
        case 'heart':
          startOffset = '48%';
          SVGPathD = 'M138.4,238.5c0,0,168.4-50.8,310.2,57.2';
          break;
      }
      return `
        <div class="danmu-item">
          <div class="balloon-wrap ${data.style}">
            <div class="balloon-main">
              <svg class="name" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 600 500">
                <path id="${data.style}-name-path" d="${SVGPathD}" />
                <text>
                  <textPath  xlink:href="#${data.style}-name-path" startOffset="${startOffset}">${data.name}</textPath>
                </text>
              </svg>
              <img src="./assets/img/balloon/${data.style}-balloon.png" alt="">
              <img class="baseket" src="./assets/img/balloon/${data.style}-baseket.png" alt="">
            </div>
            <div class="msg-card">
              <svg class="line" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 95" fill="none">
                <path d="M21.2307 94C21.2307 94 28.6635 87.0915 26.6559 74.6184C26.6559 74.6184 26.2169 70.0392 22.6129 63.365C22.6129 63.365 21.2326 60.333 20.7468 58.2537C20.7468 58.2537 19.8371 52.8459 23.177 50.47C23.177 50.47 24.4942 49.7043 24.7923 51.1734C24.7923 51.1734 25.6199 53.4365 21.1511 55.2501C19.3587 55.8671 17.5017 56.2786 15.6159 56.4767C15.6159 56.4767 12.3942 57.1429 9.45918 56.0428C-7.6352 49.6344 6.47683 34.8099 6.47683 34.8099C21.9009 20.3948 20.1549 1 20.1549 1C20.1549 1 21.8978 20.3948 6.47367 34.8112C6.47367 34.8112 -7.63836 49.6356 9.45603 56.0441C12.3897 57.1442 15.6128 56.478 15.6128 56.478C17.4989 56.2789 19.3561 55.8663 21.1486 55.2482C25.6174 53.4346 24.7898 51.1715 24.7898 51.1715C24.4916 49.7024 23.1745 50.4681 23.1745 50.4681C19.8346 52.844 20.7443 58.2518 20.7443 58.2518C21.23 60.3299 22.6104 63.3631 22.6104 63.3631C26.2162 70.038 26.6534 74.6165 26.6534 74.6165C28.661 87.0896 21.2282 93.9981 21.2282 93.9981" stroke="#185F69" stroke-width="2" stroke-miterlimit="10"/>
              </svg>
              <div class="message">${data.content}</div>
            </div>
          </div>
        </div>
      `;
    };

    // 空的通道
    const emptyAisle = $('.aisle').filter((index, item) => $(item).children().length <= 0);
    if (emptyAisle.length <= 0) return;
    const emptyAisleRandom = Math.floor(Math.random() * emptyAisle.length);
    emptyAisle.eq(emptyAisleRandom).append(danmuDOM(data));
    danmuArray = danmuArray.slice(1);
    update(ref(db), {
      ['users/' + id]: {
        status: 1,
        style,
        name,
        content,
        createdTime,
      },
    });
    (function animationHandler() {
      const danmuItem = emptyAisle.eq(emptyAisleRandom).find('.danmu-item');
      const balloon = emptyAisle.eq(emptyAisleRandom).find('.danmu-item .balloon-wrap');
      const rotateLeft = Math.floor(Math.random() * 3) + 1;
      const rotateRight = Math.floor(Math.random() * 3) + 1;
      // 彈幕上升動畫
      const danmuRiseAnimation = gsap.fromTo(
        danmuItem,
        { transform: 'translate3d(0,0,0)' }, // From
        {
          transform: 'translate3d(0,calc(-100vh - 105%),0)', // To
          ease: 'linear',
          duration: $(danmuItem).innerHeight() / 67.556,
          delay: 0.5,
          onComplete() {
            this.targets()[0].remove();
          },
        },
      );
      CustomEase.create('float', '0.5, 0, 0.5, 1');
      const balloonFloatAnimation = gsap.to(balloon, {
        keyframes: {
          '0%': { transform: `rotate(-${rotateLeft}deg)` },
          '50%': { transform: `rotate(${rotateRight}deg)` },
          '100%': { transform: `rotate(-${rotateLeft}deg)` },
        },
        ease: 'float',
        duration: 8,
        repeat: -1,
      });
    })();
  }

  /**
   * 發送彈幕
   */
  function showDanmu() {
    let checkTimeInterval;
    let danmuReady = false;
    checkTimeInterval = setInterval(() => {
      const now = new Date();
      const startTime = new Date(danmuStartDate); // 發射彈幕開始時間
      if (startTime - now <= 0) {
        danmuReady = true;
        clearInterval(checkTimeInterval);
      }
    }, 1000);
    setInterval(() => {
      if (danmuReady) {
        if (danmuArray.length > 0) {
          $('.bless-section').addClass('has-danmu');
          createDanmu();
        } else if (danmuArray.length <= 0 && $('.danmu-item').length <= 0) {
          $('.bless-section').removeClass('has-danmu');
        }
      }
    }, 2000);
  }

  /**
   * 重播彈幕
   */
  function replayDanmu() {
    const db = getDatabase();
    const dbRef = ref(db);

    get(child(dbRef, 'users/'))
      .then(snapshot => {
        if (snapshot.exists()) {
          for (const key in snapshot.val()) {
            const { style, name, content, createdTime } = snapshot.val()[key];
            update(dbRef, {
              ['users/' + key]: {
                status: 0,
                style,
                name,
                content,
                createdTime,
              },
            });
          }
        } else {
          console.log('沒有資料');
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  // 留言表單相關
  const formHandler = {
    getData() {
      return {
        style: $('form input[type="radio"]:checked').attr('id'),
        name: $('form input#name').val(),
        content: $('form textarea#message').val(),
        createdTime: moment().format('YYYY/MM/DD HH:mm:ss'),
      };
    },
    sendMessage() {
      const { style, name, content, createdTime } = formHandler.getData();
      function setData() {
        const db = getDatabase();
        const newKey = push(child(ref(db), 'users')).key;
        // 寫入資料
        set(ref(db, 'users/' + newKey), {
          status: 0,
          style,
          name,
          content,
          createdTime,
        });
      }
      setData();
    },
    scrollBottom(duration = 0) {
      const messageAside = $('.message-aside');
      messageAside.animate(
        {
          scrollTop: messageAside.prop('scrollHeight'),
        },
        duration,
      );
    },
    eventHandler() {
      const viewBtn = $('.btn.view');
      const submitBtn = $('.btn.submit');
      const asideWrap = $('.aside-wrap');
      const messageAside = $('.message-aside');
      const newTips = $('.new-tips');

      function showSuccessTips() {
        submitBtn.find('.success-tips').remove();
        submitBtn.append('<div class="success-tips">已送出祝福</div>');
        gsap.to(submitBtn.find('.success-tips'), {
          keyframes: {
            '0%': { opacity: '0', top: '0' },
            '33.33%': { opacity: '1', top: '-10px' },
            '90%': { opacity: '1', top: '-10px' },
            '100%': { opacity: '0', top: '0' },
          },
          ease: 'linear',
          duration: 1.5,
          onComplete() {
            this.targets()[0].remove();
          },
        });
      }

      function submit() {
        showSuccessTips();
        const styleSelected = $('form input[type="radio"]:checked').length > 0;
        const inputtedName = $('form input#name').val() !== '';
        const inputtedMessage = $('form textarea#message').val() !== '';
        if (!styleSelected || !inputtedName || !inputtedMessage) return;
        formHandler.sendMessage();
        $('form textarea').val('');
      }

      function messageAsideOpen() {
        formHandler.scrollBottom();
        asideWrap.addClass('show');
        lock(messageAside[0]);
      }

      function messageAsideClose() {
        asideWrap.removeClass('show');
        unlock(messageAside[0]);
      }

      function bottomDetect() {
        const isBottom = messageAside.scrollTop() >= messageAside.prop('scrollHeight') - $(window).innerHeight();
        if (isBottom) {
          newTips.removeClass('show');
        }
      }

      //送出
      submitBtn.on('click', submit);
      //查看所有留言
      viewBtn.on('click', messageAsideOpen);
      //返回
      messageAside.on('click', '.back', messageAsideClose);
      //點擊新祝福提示
      messageAside.on('click', '.new-tips', function () {
        formHandler.scrollBottom(600);
      });
      messageAside.on('scroll', bottomDetect);
    },
    all() {
      formHandler.eventHandler();
    },
  };

  function autoScrollBottom() {
    const db = getDatabase();
    const dbRef = ref(db, '/users/');
    onValue(dbRef, snapshot => {
      if (!snapshot.exists()) return;
      formHandler.scrollBottom();
    });
  }

  formHandler.all();
  loadMessage();
  showDanmu();
  window.login = login;
  window.logout = logout;
  window.replayDanmu = replayDanmu;
  window.autoScrollBottom = autoScrollBottom;
}

export function messageInit(danmuStartDate) {
  firebaseConnect();
  messageHandler(danmuStartDate);
}
