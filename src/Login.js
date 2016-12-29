import React, { Component } from 'react';
import './Login.css';
import account from './img/account_gray.svg';
import lock from './img/lock_gray.svg';
import done from './img/done_white.svg';

export default class Login extends Component {
  render() {
    return (
      <div className='login'>
        <div className='card'>
          <div className='card__header'>
            <h3>Sign in</h3>
          </div>
          <div className='card__body'>
            <form>
              <div className='input-group'>
                <span className='input-label input-label--large'>
                  <img src={account} role='presentation' />
                </span>
                <input type='email' className='input--large'
                placeholder='Email' required />
              </div>
              <div className='input-group'>
                <span className='input-label input-label--large'>
                  <img src={lock} role='presentation' />
                </span>
                <input type='password' className='input--large'
                placeholder='Password' required />
              </div>
            </form>
          </div>
          <div className='card__footer'>
            <button className='button--blue push-right'
            onClick={this.props.login}>
              <img src={done} role='presentation' />
              Sign in
            </button>
          </div>
        </div>
      </div>
    );
  }
}
