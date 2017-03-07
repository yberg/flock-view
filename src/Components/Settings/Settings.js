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
    if (t.newPassword) {
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
                    <i className='fa fa-cog' />
                    Settings
                  </h4>
                  <a onClick={this.props.onClose} className='card__header__link'>
                    <i className='fa fa-times' />
                  </a>
                </div>

                <div className='card__body'>
                  <div className='card__body__segment'>
                    <span className='input__label'>Name</span>
                    <div className='input-container'>
                      <div className='input__icon'>
                        <i className='fa fa-user' />
                      </div>
                      <input type='text' name='name' className='input--small'
                        disabled={this.props.user.gmail}
                        placeholder={this.props.user.name} />
                    </div>
                    <span className='input__label'>Email</span>
                    <div className='input-container'>
                      <div className='input__icon'>
                        {
                          this.props.user.gmail ?
                            <img src={google} role='presentation' />
                          : <i className='fa fa-envelope' />
                        }
                      </div>
                      <input type='text' className='input--small'
                        disabled
                        placeholder={this.props.user.email || this.props.user.gmail} />
                    </div>
                  </div>

                  <div className='card__body__segment'>
                    <span className='input__label'>Picture</span>
                    <div style={{display: 'flex'}}>
                      <div>
                        {
                          this.props.user.imageUrl || this.props.user.googleImageUrl ?
                            <img src={this.props.user.imageUrl || this.props.user.googleImageUrl}
                              className='round'
                              style={{height: '100px', width: '100px'}}
                              role='presentation' />
                            : <i className='fa fa-user'
                                style={{height: '100px', width: '100px', fontSize: '100px'}} />
                        }
                      </div>
                      <div style={{flex: 1, marginLeft: '20px'}}>
                        <span className='input__label'>Image URL</span>
                        <div className='input-container'>
                          <div className='input__icon'>
                            <i className='fa fa-picture-o' />
                          </div>
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
                      <span className='input__label'>Change password</span>
                      <div className='input-group input-group--elevated'>
                        <div className='input-group__row'>
                          <div className='input__icon'>
                            <i className='fa fa-lock' />
                          </div>
                          <input type='password' name='password' className='input--small'
                            placeholder='Current password' />
                        </div>
                        <div className='input-group__row'>
                          <div className='input__icon'>
                            <i className='fa fa-lock' />
                          </div>
                          <input type='password' name='newPassword' className='input--small'
                            placeholder='New password' />
                        </div>
                        <div className='input-group__row'>
                          <div className='input__icon'>
                            <i className='fa fa-lock' />
                          </div>
                          <input type='password' name='newPasswordRepeat' className='input--small'
                            placeholder='Repeat new password' />
                        </div>
                      </div>
                    </div>
                  }
                </div>

                <div className='card__footer'>
                  <button className='button button--blue' type='submit'>
                    <i className='fa fa-check' />
                    <span>Save</span>
                  </button>
                  <button type='button' className='button'
                    onClick={this.props.onClose}>
                    <i className='fa fa-times' />
                    <span>Cancel</span>
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
