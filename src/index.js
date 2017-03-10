import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import * as firebase from 'firebase';

import { myConfig } from './firebase_config';
// Setup yours.

firebase.initializeApp( myConfig );

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
