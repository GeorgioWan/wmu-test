import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import * as firebase from 'firebase';

class App extends Component {
  constructor(){
    super();
    this.state={
      title: '',
      displayname: '',
      avatar: '',
      username: '',
      password: '',
      isLogin: false,
      currentVideo: ''
    };
  }
  
  componentDidMount(){
    
    // 透過 Firebase 取得 database 資料
    const rootRef = firebase.database().ref().child('react');
    const titleRef = rootRef.child('title');
    titleRef.on('value', snap => {
      this.setState({ title: snap.val() });
    });
    
    // 透過 Firebase 取得 storage 資料
    let storageRef = firebase.storage().ref().child('default-user-icon-profile.png');
    
    // 透過 Firebase 判斷 Auth 並取得 user 資訊
    firebase.auth().onAuthStateChanged(firebaseUser => {
      if (firebaseUser){
        console.log('[Firebase Auth] ', firebaseUser);
        storageRef.getMetadata().then(metadata => {
          this.setState({
            displayname: firebaseUser.displayName || firebaseUser.email,
            avatar: firebaseUser.photoURL || metadata.downloadURLs[0],
            isLogin: true
          });
        });
      }
      else{
       console.log('[Firebase Auth] Not logged in yet.');
       this.setState({
          isLogin: false
        });
      }
    });
    
    // 透過 Firebase 作 Cloud Message 推播
    const messaging = firebase.messaging();
    const dbFCMToken = firebase.database().ref().child('fcm-token');
    
    messaging.requestPermission()
    .then(()=>{
      console.log('[Permission] Status is OKAY.');
      return messaging.getToken();
    })
    .then((token)=>{
      dbFCMToken.push({token});
      console.log(token);
    })
    .catch((err)=>{
      console.log('[Permission Error] ' + err);
    });
    
    messaging.onMessage((payload)=>{
      console.log("onMessage: ", payload);
    });
  }
  handleChange(e){
    let target = e.target;
    if (target.name === 'fileButton')
    {
      // Get file
      let file = target.files[0];
      // Create storage referance
      let storageRef = firebase.storage().ref('alert_videos/' + file.name);
      // Upload task for progress
      let task = storageRef.put(file);
      let uploader = this.refs.fileUploader;
      
      task.on('state_changed', 
        function progress(snapshot){
          let perc = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          uploader.value = perc;
        },
        function error(err){
          console.log("[Error] ", err);
        },
        function complete() {
          console.log("[Success] upload " + file.name + " is done.");
        }
      );
      this.setState({
        currentVideo: file.name
      });
    }
    else
    {
      this.setState({
        [target.name]: target.value
      });
    }
  }
  handleClick(e){
    let target = e.target;
    let authListener;
    // Sign out
    if (target.name === 'signout')
      authListener = firebase.auth().signOut();
    else if (target.name === 'fb_auth'){
      let provider = new firebase.auth.FacebookAuthProvider();
      authListener = firebase.auth().signInWithPopup(provider);
    }
    else {
      const auth = firebase.auth();
      let {username, password} = this.state;
      
      // Signin
      if (target.name === 'signin')
        authListener = auth.signInWithEmailAndPassword(username, password);
      else if (target.name === 'create')
        authListener = auth.createUserWithEmailAndPassword(username, password);
    }
    
    authListener
      .then(user => this.initInfo())
      .catch(e => alert('[Failed] ' + e.message));
  }
  initInfo(){
    this.setState({
      username: '',
      password: ''
    });
  }
  handleDownload(e){
    let target = e.target;
    if (target.name === 'download'){
      let storageRef = firebase.storage().ref().child('alert_videos/' + ( this.state.currentVideo ? this.state.currentVideo : 'mov_bbb.mp4' ));
      let video = this.refs.videoTest ;
      /*
      storageRef.getMetadata().then(metadata => {
        video.src = metadata.downloadURLs[0];
      });*/
      
      storageRef.getDownloadURL().then( (url) => {
        // Insert url into an <img> tag to "download"
        video.src = url;
      })
      .catch( (error) => {
      
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case 'storage/object_not_found':
            // File doesn't exist
            console.log("[Error] ", error.code);
            break;
      
          case 'storage/unauthorized':
            // User doesn't have permission to access the object
            console.log("[Error] ", error.code);
            break;
      
          case 'storage/canceled':
            // User canceled the upload
            console.log("[Error] ", error.code);
            break;
      
          case 'storage/unknown':
            // Unknown error occurred, inspect the server response
            console.log("[Error] ", error.code);
            break;
            
          default:
            console.log("[Error] something wrong!");
        }
      });
    }
  }
  
  render() {
    const {displayname, avatar, isLogin} = this.state;
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <img src={"/images/Firebase.png"} className="App-logo" alt="logo" />
          <h2>{this.state.title}</h2>
        </div>
        <br />
        <div>
          { 
            isLogin ? 
            <h2>Hello, <img src={avatar} style={{width: '40px', height: '40px', borderRadius: '50px', verticalAlign: 'middle'}} role="presentation" /> {displayname} 歡迎！</h2> : 
            <h2>請登入或註冊...</h2>
          }
          <span style={{display: isLogin ? 'none' : ''}}>
            <input type='text' name='username' value={this.state.username} placeholder='Email' onChange={this.handleChange.bind(this)}/>
            <br />
            <input type='password' name='password' value={this.state.password} placeholder='Password' onChange={this.handleChange.bind(this)}/>
          </span>
          <span style={{display: isLogin ? 'none' : ''}}>
            <br /><br />
            <button name='signin'  onClick={this.handleClick.bind(this)}>登入</button>
            <button name='create'  onClick={this.handleClick.bind(this)}>註冊</button>
          </span>
          <span style={{display: isLogin ? '' : 'none'}}>
            <button name='signout' onClick={this.handleClick.bind(this)}>登出</button>
          </span>
          
          <span style={{display: isLogin ? 'none' : ''}}>
            <hr />
            <button name='fb_auth' onClick={this.handleClick.bind(this)}>Facebook 登入</button>
          </span>
          
          <span style={{display: isLogin ? '' : 'none'}}>
            <hr />
            <progress value="0" max="100" ref="fileUploader">0%</progress>
            <br />
            <br />
            <input name='fileButton' type="file" onChange={this.handleChange.bind(this)}></input>
          </span>
          
          <span style={{display: isLogin ? '' : 'none'}}>
            <hr />
            <iframe width="480" height="240" src="" ref="videoTest" frameBorder="0"></iframe>
            <p>Default download is <b>mov_bbb.mp4</b>.</p>
            <p>or download your upload video <b>{ this.state.currentVideo }</b></p>
            <button name='download' onClick={this.handleDownload.bind(this)}>Download</button>
          </span>
        </div>
      </div>
    );
  }
}

export default App;
