import React, { Component } from 'react';
import './Navbar.css';

import star from '../../img/star_amber.svg';
import google from '../../img/google.svg';
import account from '../../img/account_blue.svg';

export default class Navbar extends Component {
  render() {
    return(
      <div className='navbar'>
        <div className='navbar__title'>
          <span>
            <img src={star} role='presentation' />
            {this.props.title}
          </span>
        </div>
        <div className='navbar__body'>
          <ul>
            <li>
              <span>
                <img src={this.props.user.gmail ? google : account} role='presentation' />
                {
                  this.props.user.imageUrl ?
                    <img src={this.props.user.imageUrl} role='presentation' /> : null
                }
                {this.props.user.name}
              </span>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}
