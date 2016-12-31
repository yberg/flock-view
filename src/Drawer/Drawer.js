import React, { Component } from 'react';
import './Drawer.css';
import account from '../img/account_blue.svg';
import star from '../img/star_amber.svg';
import settings from '../img/settings_gray.svg';
import exit from '../img/exit_white.svg';

export default class Drawer extends Component {
  render() {
    let props = this.props;
    return (
      <div className='drawer'>
        <div>
          <div className='list'>
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
                    props.requestOne('5804aa86795236fdc199b606', member._id);
                  }}>
                    <img src={account}
                    className='list__item__icon'
                    role='presentation' />
                    {member.name}
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
                    {favorite.name}
                  </a>
                );
              })
            }
          </div>
          <div className='list'>
            <a href='#Settings' className='list__item'>
              <img src={settings}
              className='list__item__icon'
              role='presentation' />
              Settings
            </a>
          </div>
          <div className='drawer__segment'>
            <div className='input-group'>
              <button className='button button--red center'
              onClick={this.props.signOut}>
                <img src={exit} role='presentation' />
                Sign out
              </button>
            </div>
          </div>
        </div>
        <div className='details'>
          {
            this.props.family.members &&
            this.props.family.members.map(function(member, i) {
              if (member._id === props.marked) {
                return (
                  <div key={i}>
                    <h5>{member.name}</h5>
                    <span>{member.email || member.gmail}</span>
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
                    <h5>{favorite.name}</h5>
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
