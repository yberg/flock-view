import React, { Component } from 'react';
import './Login.css';
import account from './img/account_gray.svg';
import lock from './img/lock_gray.svg';

export default class Login extends Component {
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
                  <img src={account} role='presentation' />
                </span>
                <input type='email' placeholder='Email' required />
              </div>
              <div className='input-group'>
                <span className='input-label'>
                  <img src={lock} role='presentation' />
                </span>
                <input type='password' placeholder='Password' required />
              </div>
            </form>
          </div>
          <div className='card__footer'>
            <button className='button--blue push-right'
            onClick={this.props.login}>Login</button>
          </div>
        </div>
      </div>
    );
  }
}
