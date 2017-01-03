import React, { Component } from 'react';
import './Navbar.css';
import people from '../img/people_green.svg';
import google from '../img/google.svg';
import account from '../img/account_blue.svg';

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
              {
                this.props.user.gmail ?
                <span>
                  <img src={google} role='presentation' />
                  {this.props.user.name}
                </span> : null
              }
              {
                this.props.user.email ?
                <span>
                  <img src={account} role='presentation' />
                  {this.props.user.name}
                </span> : null
              }
            </li>
          </ul>
        </div>
      </div>
    )
  }
}
