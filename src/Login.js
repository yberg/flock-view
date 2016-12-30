import React, { Component } from 'react';
import request from 'request';
import './Login.css';
import account from './img/account_gray.svg';
import lock from './img/lock_gray.svg';
import done from './img/done_white.svg';
import google from './img/google.svg';
const CLIENT_ID = require('../config').clientId;

var self;

export default class Login extends Component {
  constructor(props) {
    super(props);
    self = this;
  }

  componentDidMount() {
    //loadMeta('google-signin-scope', 'profile email');
    //loadMeta('google-signin-client_id', CLIENT_ID + '.apps.googleusercontent.com');
    window.onSuccess = onSuccess;
    window.onFailure = onFailure;
    window.start = this.start;
    loadJS('https://apis.google.com/js/client:platform.js?onload=start');
  }

  start() {
    console.log(this);
    self.props.setGapi(this.gapi);
    let gapi = this.gapi;
    gapi.load('auth2', () => {
      gapi.auth2.init({
        client_id: CLIENT_ID + '.apps.googleusercontent.com',
      });
    });
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 180,
      'height': 36,
      'longtitle': true,
      'theme': 'dark',
      'onsuccess': onSuccess,
      'onfailure': onFailure
    });
  }

  signInWithGoogle() {
    let auth = self.props.gapi.auth2.getAuthInstance();
    //
    // console.log(user.getBasicProfile());
    // console.log(user.getBasicProfile().getGivenName());
    // console.log(user.getBasicProfile().getFamilyName());
    // let userDetails = user.getBasicProfile();
    // this.props.setUser({
    //   gmail: userDetails.getEmail(),
    //   name: userDetails.getName(),
    //   firstName: userDetails.getGivenName(),
    //   lastName: userDetails.getFamilyName()
    // });
    // auth.grantOfflineAccess({'redirect_uri': 'postmessage'}).then(res => {
    //   console.log(res);
    //   let user = auth.currentUser.get();
    //   let userDetails = user.getBasicProfile();
    //   request.post('http://localhost:3001/auth', {
    //     form: {
    //       gmail: userDetails.getEmail(),
    //       idToken: res.code
    //     }
    //   }, (err, httpResponse, body) => {
    //     if (err) {
    //       console.log('error: ' + err.message);
    //     } else {
    //       console.log(body);
    //       self.props.setUser({
    //         gmail: userDetails.getEmail(),
    //         name: userDetails.getName(),
    //         firstName: userDetails.getGivenName(),
    //         lastName: userDetails.getFamilyName()
    //       });
    //     }
    //   });
    // });
  }

  render() {
    return (
      <div className='login'>
        <div className='card'>
          <div className='card__header'>
            <h4>Sign in</h4>
          </div>
          <div className='card__body'>
            <form>
              <div className='input-group'>
                <span className='input-label'>
                  <span>@</span>
                </span>
                <input type='email' className=''
                placeholder='Email' required />
              </div>
              <div className='input-group'>
                <span className='input-label'>
                  <img src={lock} role='presentation' />
                </span>
                <input type='password' className=''
                placeholder='Password' required />
              </div>
              <div>
                <button className='button button--blue'
                onClick={this.props.login}>
                  <img src={done} role='presentation' />
                  Sign in
                </button>
                <span style={{marginLeft: '10px', color: '#333'}}>or...</span>
                <p></p>
                <div id='my-signin2'></div>
                {/* <button className='google-sign-in'
                onClick={this.signInWithGoogle.bind(this)}>
                  <div>
                    <div>
                      <img src={google} role='presentation' />
                    </div>
                  </div>
                  <span>Sign in with Google</span>
                </button> */}
              </div>
            </form>
          </div>
          <div className='card__footer'>
            <h4>Register</h4>
            <form>
              <div className='input-group'>
                <span className='input-label'>
                  <span>@</span>
                </span>
                <input type='email' className=''
                placeholder='Email' required />
              </div>
              <div className='input-group'>
                <span className='input-label'>
                  <img src={account} role='presentation' />
                </span>
                <input type='text' className=''
                placeholder='Name' required />
              </div>
              <div className='input-group'>
                <span className='input-label'>
                  <img src={lock} role='presentation' />
                </span>
                <input type='password' className=''
                placeholder='Password' required />
              </div>
              <div className='input-group'>
                <span className='input-label'>
                  <img src={lock} role='presentation' />
                </span>
                <input type='password' className=''
                placeholder='Repeat password' required />
              </div>
              <button className='button button--green'
              href='#'>
                <img src={done} role='presentation' />
                Register
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

function loadJS(src) {
  for (let s of window.document.getElementsByTagName('script')) {
    if (s.src === src) {
      s.remove();
    }
  }
  let script = window.document.createElement('script');
  script.src = src;
  script.async = true;
  script.defer = true;
  let ref = window.document.getElementsByTagName('script')[0];
  ref.parentNode.insertBefore(script, ref);
}

function loadMeta(name, content) {
  for (let m of window.document.getElementsByTagName('meta')) {
    if (m.name === name) {
      m.remove();
    }
  }
  let meta = window.document.createElement('meta');
  meta.name = name;
  meta.content = content;
  let ref = window.document.getElementsByTagName('meta')[0];
  ref.parentNode.insertBefore(meta, ref);
}

function onSuccess(googleUser) {
  let userDetails = googleUser.getBasicProfile();
  request.post('http://localhost:3001/auth', {
    form: {
      gmail: userDetails.getEmail(),
      idToken: googleUser.getAuthResponse().id_token
    }
  }, (err, httpResponse, body) => {
    if (err) {
      console.log('error: ' + err.message);
    } else {
      console.log(body);
      self.props.setUser({
        gmail: userDetails.getEmail(),
        name: userDetails.getName(),
        firstName: userDetails.getGivenName(),
        lastName: userDetails.getFamilyName()
      });
      self.props.login();
    }
  });
  console.log('Logged in as: ' + googleUser.getBasicProfile().getName()
    + ' (' + googleUser.getBasicProfile().getEmail() + ')');
}

function onFailure(error) {
  console.log(error);
}
