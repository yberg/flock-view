import React, { Component } from 'react';
import './Login.css';
import account from './img/account_gray.svg';
import lock from './img/lock_gray.svg';
import done from './img/done_white.svg';
const CLIENT_ID = require('../config').clientId;

var self;

export default class Login extends Component {
  constructor(props) {
    super(props);
    self = this;
  }

  componentDidMount() {
    loadMeta('google-signin-scope', 'profile email');
    loadMeta('google-signin-client_id', CLIENT_ID + '.apps.googleusercontent.com');
    window.onSuccess = onSuccess;
    window.onFailure = onFailure;
    window.renderButton = this.renderButton;
    loadJS('https://apis.google.com/js/platform.js?onload=renderButton');
  }

  renderButton() {
    console.log('renderButton()');
    console.log(this);
    self.props.setGapi(this.gapi);
    this.gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 180,
      'height': 36,
      'longtitle': true,
      'theme': 'dark',
      'onsuccess': onSuccess,
      'onfailure': onFailure
    });
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
  self.props.login();
  console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
}

function onFailure(error) {
  console.log(error);
}
