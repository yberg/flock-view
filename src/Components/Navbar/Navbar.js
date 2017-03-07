import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './Navbar.css';

import star from '../../img/star_amber.svg';
import google from '../../img/google.svg';
import account from '../../img/account_blue.svg';
import chat from '../../img/chat_white.svg';

export default class Navbar extends Component {
  render() {
    let profilePic;
    if (this.props.user.gmail) {
      profilePic = <img src={this.props.user.imageUrl || this.props.user.googleImageUrl} role='presentation' />
    }
    return (
      <div className='navbar'>
        <ReactCSSTransitionGroup
          component='div'
          style={{display: 'flex', flex: 1}}
          transitionName='navbar'
          transitionEnter={false}
          transitionLeave={false}
          transitionAppear={true}
          transitionAppearTimeout={500}>
          <div className='navbar__title'>
            <i className='fa fa-star amber'/>
            { this.props.title }
          </div>
          <div className='navbar__body'>
            <ul>
              <li>
                  {
                    this.props.user.gmail ?
                      <img src={google} role='presentation' />
                    : <i className='fa fa-user gray' />
                  }
                  { profilePic }
                  { this.props.user.name }
              </li>
            </ul>
            <div className='menu'>
              <a onClick={this.props.onMenuClick} className={this.props.menuIsActive ? 'active' : ''}>
                <i className='fa fa-comments' />
              </a>
            </div>
          </div>
        </ReactCSSTransitionGroup>
      </div>
    )
  }
}
