importScripts('https://www.gstatic.com/firebasejs/3.5.2/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/3.5.2/firebase-messaging.js');

var config = {
  apiKey: "AIzaSyDWfqUNimZ4wLc3BR5o7vVDchVRYwBsfpc",
  authDomain: "wakemeup-4a568.firebaseapp.com",
  databaseURL: "https://wakemeup-4a568.firebaseio.com",
  storageBucket: "wakemeup-4a568.appspot.com",
  messagingSenderId: "182089602631"
};
firebase.initializeApp(config);

const messaging = firebase.messaging();
