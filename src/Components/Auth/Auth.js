import React, { Component } from 'react';
import { connect } from 'react-redux';
import cookie from 'react-cookie';
import './Auth.css';

const CLIENT_ID = require('../../../config').clientId;

import email from '../../img/email_gray.svg';
import account from '../../img/account_gray.svg';
import lock from '../../img/lock_gray.svg';
import done from '../../img/done_white.svg';

import * as UserActions from '../../Actions/UserActions';
import * as SystemActions from '../../Actions/SystemActions';

var self;

class Auth extends Component {
  constructor(props) {
    super(props);
    self = this;
  }

  componentDidMount() {
    window.onGoogleSignIn = onGoogleSignIn;
    window.onFailure = onFailure;
    window.start = this.start;
    loadJS('https://apis.google.com/js/client:platform.js?onload=start');
  }

  start() {
    let gapi = this.gapi;
    self.props.dispatch(SystemActions.setGapi(gapi));
    gapi.load('auth2', () => {
      gapi.auth2.init({
        client_id: CLIENT_ID,
      });
    });
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 180,
      'height': 36,
      'longtitle': true,
      'theme': 'dark',
      'onsuccess': onGoogleSignIn,
      'onfailure': onFailure
    });
  }

  signInWithEmail(e) {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    this.props.dispatch(UserActions.signInWithEmail(
      {email, password},
      this.props.onSignIn
    ));
  }

  register(e) {
    e.preventDefault();
    const t = e.target;
    const email = t.email.value;
    const firstName = t.firstName.value;
    const lastName = t.lastName.value;
    const password = t.password.value;
    const passwordRepeat = t.passwordRepeat.value;
    if (password === passwordRepeat) {
      this.props.dispatch(UserActions.register(
        {email, firstName, lastName, password},
        this.props.onRegister
      ));
    } else {
      console.log('Passwords do not match');
    }
  }

  render() {
    return (
      <div className='auth'>
        <div className='card'>
          <div className='card__header'>
            <h4>Sign in</h4>
          </div>
          <div className='card__body'>
            <form onSubmit={this.signInWithEmail.bind(this)}>
              <div className='input-group input-group--elevated'>
                <div className='input-group__row'>
                  <img src={email} role='presentation' />
                  <input type='email' name='email' placeholder='Email' required />
                </div>
                <div className='input-group__row'>
                  <img src={lock} role='presentation' />
                  <input type='password' name='password' placeholder='Password' />
                </div>
              </div>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <button className='button button--blue'
                  style={{float: 'left'}}>
                  <img src={done} role='presentation' />
                  Sign in
                </button>
                <div id='my-signin2'></div>
              </div>
            </form>
          </div>
          {
            this.props.register &&
            <div className='card__footer'>
              <h4>Register</h4>
              <form onSubmit={this.register.bind(this)}>
                <div className='input-group input-group--elevated'>
                  <div className='input-group__row'>
                    <img src={email} role='presentation' />
                    <input type='email' name='email' placeholder='Email' required />
                  </div>
                  <div className='input-group__row'>
                    <img src={account} role='presentation' />
                    <input type='text' name='firstName' placeholder='First name' required />
                  </div>
                  <div className='input-group__row'>
                    <img src={account} role='presentation' />
                    <input type='text' name='lastName' placeholder='Last name' required />
                  </div>
                  <div className='input-group__row'>
                    <img src={lock} role='presentation' />
                    <input type='password' name='password' placeholder='Password' required />
                  </div>
                  <div className='input-group__row'>
                    <img src={lock} role='presentation' />
                    <input type='password' name='passwordRepeat' placeholder='Repeat password' required />
                  </div>
                </div>
                <button className='button button--green'>
                  <img src={done} role='presentation' />
                  Register
                </button>
              </form>
            </div>
          }
        </div>
      </div>
    );
  }
}

export default connect()(Auth);

Auth.defaultProps = {
  register: true
};

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

function onGoogleSignIn(googleUser) {
  self.props.dispatch(UserActions.signInWithGoogle(googleUser, self.props.onSignIn));
}

function onFailure(error) {
  console.log(error);
}
