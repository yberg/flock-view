import React, { Component } from 'react';
import request from 'request';
import './SignIn.css';
import email from '../img/email_gray.svg';
import account from '../img/account_gray.svg';
import lock from '../img/lock_gray.svg';
import done from '../img/done_white.svg';
const CLIENT_ID = require('../../config').clientId;

var self;

export default class SignIn extends Component {
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
    self.props.updateState({gapi: this.gapi});
    let gapi = this.gapi;
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
    request.post('http://localhost:3001/auth', {
      form: {
        email: e.target.email.value,
        password: e.target.password.value
      }
    }, (err, httpResponse, body) => {
      if (err) {
        console.log('error: ' + err.message);
      } else {
        body = JSON.parse(body);
        if (body.success) {
          console.log('User info from server (Email account): ');
          console.log(body);
          let user = {
            _id: body._id,
            email: body.email,
            name: body.name,
            firstName: body.firstName,
            lastName: body.lastName,
            familyId: body.familyId
          }
          self.props.signIn(user);
        } else {
          console.log(body);
        }
      }
    });
  }

  render() {
    return (
      <div className='sign-in'>
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
              <div>
                <button className='button button--blue'>
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
              <div className='input-group input-group--elevated'>
                <div className='input-group__row'>
                  <img src={email} role='presentation' />
                  <input type='email' placeholder='Email' required />
                </div>
                <div className='input-group__row'>
                  <img src={account} role='presentation' />
                  <input type='text' placeholder='First name' required />
                </div>
                <div className='input-group__row'>
                  <img src={account} role='presentation' />
                  <input type='text' placeholder='Last name' required />
                </div>
                <div className='input-group__row'>
                  <img src={lock} role='presentation' />
                  <input type='password' placeholder='Password' required />
                </div>
                <div className='input-group__row'>
                  <img src={lock} role='presentation' />
                  <input type='password' placeholder='Repeat password' required />
                </div>
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

function onGoogleSignIn(googleUser) {
  const userDetails = googleUser.getBasicProfile();
  console.log('Google user details: ');
  console.log(userDetails);
  request.post('http://localhost:3001/auth', {
    form: {
      gmail: userDetails.getEmail(),
      idToken: googleUser.getAuthResponse().id_token
    }
  }, (err, httpResponse, body) => {
    if (err) {
      console.log('error: ' + err.message);
    } else {
      body = JSON.parse(body);
      console.log('User info from server (Google account): ');
      console.log(body);
      const user = {
        _id: body._id,
        gmail: body.gmail,
        name: body.name,
        firstName: body.firstName,
        lastName: body.lastName,
        familyId: body.familyId,
        imageUrl: userDetails.getImageUrl()
      }
      self.props.signIn(user);
    }
  });
  console.log('Logged in as: ' + googleUser.getBasicProfile().getName()
    + ' (' + googleUser.getBasicProfile().getEmail() + ')');
}

function onFailure(error) {
  console.log(error);
}