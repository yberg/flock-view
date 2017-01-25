import React, { Component } from 'react';
import './Drawer.css';
import account from '../../img/account_blue.svg';
import star from '../../img/star_amber.svg';
import settings from '../../img/settings_gray.svg';
import exit from '../../img/exit_white.svg';
import email from '../../img/email_gray.svg';
import google from '../../img/google.svg';

import * as UserActions from '../../Actions/UserActions';
import * as FamilyActions from '../../Actions/FamilyActions';

export default class Drawer extends Component {
  openSettings() {
    this.props.updateState({
      settings: true
    });
  }

  signOut() {
    if (this.props.onSignOut) {
      this.props.onSignOut();
    }
    UserActions.signOut();
  }

  loadFamily() {
    FamilyActions.loadFamily('5804c0fc795236fdc199b614');
  }

  render() {
    const props = this.props;
    return (
      <div className='drawer'>
        <div>
          <div className='list list--divider'>
            <div className='list__header'>
              <h5>Members</h5>
            </div>
            {
              props.family.members &&
              props.family.members.map(function(member, i) {
                return (
                  <a key={i}
                  href={'#' + member.name}
                  className={'list__item' + (props.marked === member._id ? ' active active--blue' : '')}
                  onClick={() => {
                    props.setMarked(member._id);
                    props.requestOne(props.user._id, member._id);
                  }}>
                    <img src={member.imageUrl || member.googleImageUrl || account}
                    className='list__item__icon'
                    role='presentation' />
                    <span>{member.name}</span>
                  </a>
                );
              })
            }
            <div className='list__header'>
              <h5>Favorites</h5>
            </div>
            {
              props.family.favorites &&
              props.family.favorites.map(function(favorite, i) {
                return (
                  <a key={i}
                  href={'#' + favorite.name}
                  className={'list__item' + (props.marked === favorite._id ? ' active active--amber' : '')}
                  onClick={() => props.setMarked(favorite._id)}>
                    <img src={star}
                    className='list__item__icon'
                    role='presentation' />
                    <span>{favorite.name}</span>
                  </a>
                );
              })
            }
          </div>
          <div className='list list--divider'>
            <a onClick={this.openSettings.bind(this)} href='#Settings' className='list__item'>
              <img src={settings}
              className='list__item__icon'
              role='presentation' />
              <span>Settings</span>
            </a>
          </div>
          <div className='drawer__segment'>
            <button className='button button--red center'
            onClick={this.signOut.bind(this)}>
              <img src={exit} role='presentation' />
              Sign out
            </button>
          </div>
        </div>
        <div className='drawer__segment details'>
          {
            this.props.family.members &&
            this.props.family.members.map(function(member, i) {
              if (member._id === props.marked) {
                return (
                  <div key={i}>
                    <span>
                      <img src={member.email ? email : google} role='presentation' />
                      <img src={member.imageUrl || member.googleImageUrl || account} role='presentation' />
                      <h5 style={{display: 'inline-block'}}>{member.name}</h5>
                    </span>
                  </div>
                );
              } else {
                return null;
              }
            })
          }
          {
            this.props.family.favorites &&
            this.props.family.favorites.map(function(favorite, i) {
              if (favorite._id === props.marked) {
                return (
                  <div key={i}>
                    <span>
                      <img src={star} role='presentation' />
                      <h5 style={{display: 'inline-block'}}>{favorite.name}</h5>
                    </span>
                  </div>
                );
              } else {
                return null;
              }
            })
          }
        </div>
      </div>
    );
  }
}
