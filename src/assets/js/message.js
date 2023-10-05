import moment from 'moment';
import { lock, unlock } from 'tua-body-scroll-lock';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, update, push, child, onValue } from 'firebase/database';

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
}

function messageHandler() {
  const msgWrap = $('.msg-wrap');
  const msgItemDOM = data => `<div class="msg-item">
      <div class="pic-box">
        <img src="./assets/img/${data.style}.png" alt="">
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

  function loadMessage() {
    const db = getDatabase();
    const dbRef = ref(db, '/users/');
    onValue(dbRef, snapshot => {
      console.log(snapshot.val());
      if (!snapshot.val()) return;
      // msgWrap.empty();
      for (const key in snapshot.val()) {
        console.log(key, 'key');
        if (snapshot.val()[key].status === 0) {
          msgWrap.append(msgItemDOM(snapshot.val()[key]));
          const { style, name, content, createdTime } = snapshot.val()[key];
          update(ref(db), {
            ['users/' + key]: {
              status: 1,
              style,
              name,
              content,
              createdTime,
            },
          });
        }
      }
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
      const data = formHandler.getData();
      function setData(data) {
        const db = getDatabase();
        const newKey = push(child(ref(db), 'users')).key;
        // 寫入資料
        const { style, name, content, createdTime } = data;
        set(ref(db, 'users/' + newKey), {
          status: 0,
          style,
          name,
          content,
          createdTime,
        });
      }
      setData(data);
    },
    eventHandler() {
      //留言
      const submitBtn = $('.btn.submit');
      const messageAside = $('.message-aside');
      submitBtn.on('click', function () {
        formHandler.sendMessage();
        $('form input[type="text"], form textarea').val('');
      });

      //查看所有留言
      $('.btn.view').on('click', function () {
        messageAside.addClass('show');
        lock(messageAside[0]);
      });
      messageAside.on('click', '.back', function () {
        messageAside.removeClass('show');
        unlock(messageAside[0]);
      });
    },
    all() {
      formHandler.eventHandler();
    },
  };
  formHandler.all();
  loadMessage();
}

export function messageInit() {
  firebaseConnect();
  messageHandler();
}
