import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import * as firebase from 'firebase';

var config = {
  apiKey: "AIzaSyDWfqUNimZ4wLc3BR5o7vVDchVRYwBsfpc",
  authDomain: "wakemeup-4a568.firebaseapp.com",
  databaseURL: "https://wakemeup-4a568.firebaseio.com",
  storageBucket: "wakemeup-4a568.appspot.com",
  messagingSenderId: "182089602631"
};
firebase.initializeApp(config);

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
