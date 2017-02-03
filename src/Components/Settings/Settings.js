import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './Settings.css';

import settings from '../../img/settings_white.svg';
import done from '../../img/done_white.svg';
import clear from '../../img/clear_black.svg';
import account from '../../img/account_gray.svg';
import email from '../../img/email_gray.svg';
import google from '../../img/google.svg';
import lock from '../../img/lock_gray.svg';
import image from '../../img/image_gray.svg';
import defaultProfilePic from '../../img/account_blue.svg';

import { editUser } from '../../Actions/UserActions';

class Settings extends Component {
  editUser(e) {
    e.preventDefault();
    const t = e.target;
    if (t.newPassword.value === t.newPasswordRepeat.value) {
      this.props.dispatch(editUser({
        _id: this.props.user._id,
        name: t.name.value,
        password: t.password.value,
        newPassword: t.newPassword.value,
      }, this.props.onClose));
    } else {
      console.log('Passwords does not match');
    }
  }

  render() {
    return (
      <ReactCSSTransitionGroup
        component='div'
        className='settings'
        transitionName='settings'
        transitionEnterTimeout={200}
        transitionLeaveTimeout={200}>
        {
          this.props.show &&
          <div className='settings'>
            <div className='card'>
              <form onSubmit={this.editUser.bind(this)} style={{ margin: 0 }}>

                <div className='card__header'>
                  <h4>
                    <img src={settings} role='presentation' />
                    Settings
                    <a onClick={this.props.onClose} className='push-right'>&times;</a>
                  </h4>
                </div>

                <div className='card__body'>
                  <div className='card__body__segment'>
                    <span className='input-label'>Name</span>
                    <div className='input-container'>
                      <img src={account} role='presentation' />
                      <input type='text' name='name' className='input--small'
                        disabled={this.props.user.gmail}
                        placeholder={this.props.user.name} />
                    </div>
                    <span className='input-label'>Email</span>
                    <div className='input-container'>
                      <img src={this.props.user.gmail ? google : email} role='presentation' />
                      <input type='text' className='input--small'
                        disabled
                        placeholder={this.props.user.email || this.props.user.gmail} />
                    </div>
                  </div>

                  <div className='card__body__segment'>
                    <span className='input-label'>Picture</span>
                    <div style={{display: 'flex'}}>
                      <div>
                        <img src={this.props.user.imageUrl || this.props.user.googleImageUrl || defaultProfilePic}
                          className='round'
                          style={{height: '100px'}}
                          role='presentation' />
                      </div>
                      <div style={{flex: 1, marginLeft: '20px'}}>
                        <span className='input-label'>Image URL</span>
                        <div className='input-container'>
                          <img src={image} role='presentation' />
                          <input type='text' name='imageUrl'
                            className='input--small'
                            placeholder='Image url' />
                        </div>
                      </div>
                    </div>
                  </div>

                  {
                    this.props.user.email &&
                    <div className='card__body__segment'>
                      <span className='input-label'>Change password</span>
                      <div className='input-group input-group--elevated'>
                        <div className='input-group__row'>
                          <img src={lock} role='presentation' />
                          <input type='password' name='password' className='input--small'
                            placeholder='Current password' />
                        </div>
                        <div className='input-group__row'>
                          <img src={lock} role='presentation' />
                          <input type='password' name='newPassword' className='input--small'
                            placeholder='New password' />
                        </div>
                        <div className='input-group__row'>
                          <img src={lock} role='presentation' />
                          <input type='password' name='newPasswordRepeat' className='input--small'
                            placeholder='Repeat new password' />
                        </div>
                      </div>
                    </div>
                  }
                </div>

                <div className='card__footer'>
                  <button className='button button--blue' type='submit'>
                    <img src={done} role='presentation' />
                    Save
                  </button>
                  <button className='button'
                    onClick={this.props.onClose}>
                    <img src={clear} role='presentation' />
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        }
      </ReactCSSTransitionGroup>
    )
  }
}

export default connect((store) => {
  return {
    user: store.user,
  }
})(Settings);
