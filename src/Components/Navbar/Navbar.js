import React, { Component } from 'react';
import './Navbar.css';
import people from '../../img/people_green.svg';
import google from '../../img/google.svg';
import account from '../../img/account_blue.svg';

var self;

export default class Navbar extends Component {
  constructor(props) {
    super(props);
    self = this;
  }

  render() {
    return(
      <div className='navbar'>
        <div className='navbar__title'>
          <span>
            <img src={people} role='presentation' />
            {this.props.family.name}
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
