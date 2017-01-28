import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Drawer.css';

import Dialog from '../Dialog/Dialog';

import account from '../../img/account_blue.svg';
import star from '../../img/star_amber.svg';
import settings from '../../img/settings_gray.svg';
import people from '../../img/people_green.svg';
import exit from '../../img/exit_white.svg';
import email from '../../img/email_gray.svg';
import google from '../../img/google.svg';

import * as UserActions from '../../Actions/UserActions';
import * as AppActions from '../../Actions/AppActions';

class Drawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDialog: false
    }
  }

  openSettings() {
    this.props.dispatch(AppActions.openSettings());
  }

  requestOne(src, dest) {
    console.log('requestOne(' + src + ', ' + dest + ')');
    this.props.socket.emit('requestOne', {
      src: src,
      dest: dest
    });
  }

  signOut() {
    if (this.props.onSignOut) {
      this.props.onSignOut();
    }
    this.props.dispatch(UserActions.signOut());
  }

  render() {
    const family = this.props.family;
    const familyMembers = family.members && family.members.map((member) => {
      return (
        <a key={member._id}
        href={'#' + member.name}
        className={'list__item' + (this.props.marked === member._id ? ' active active--blue' : '')}
        onClick={() => {
          this.props.dispatch(AppActions.setMarked(member._id, 'MEMBER'));
          this.requestOne(this.props.user._id, member._id);
        }}>
          <img src={member.imageUrl || member.googleImageUrl || account}
          className='list__item__icon'
          role='presentation' />
        <span>{member.firstName}</span>
        </a>
      );
    });
    const familyFavorites = family.favorites && family.favorites.map((favorite) => {
      return (
        <a key={favorite._id}
        href={'#' + favorite.name}
        className={'list__item' + (this.props.marked === favorite._id ? ' active active--amber' : '')}
        onClick={() => this.props.dispatch(AppActions.setMarked(favorite._id, 'FAVORITE'))}>
          <img src={star}
          className='list__item__icon'
          role='presentation' />
          <span>{favorite.name}</span>
        </a>
      );
    });
    const memberDetails = family.members && family.members.map((member) => {
      if (member._id === this.props.marked) {
        return (
          <div key={member._id}>
            <span className='row'>
              <img src={member.email ? email : google} role='presentation' />
              <img src={member.imageUrl || member.googleImageUrl || account} role='presentation' />
              <h5 style={{display: 'inline-block'}}>{member.name}</h5>
            </span>
            <span className='row'>{member.name}</span>
            <span className='row'><i>lat: </i><tt>{member.lat}</tt></span>
            <span className='row'><i>long: </i><tt>{member.long}</tt></span>
            <span className='row'>
              Last updated: {member.lastUpdated}
            </span>
          </div>
        );
      } else {
        return null;
      }
    });
    const favoriteDetails = family.favorites && family.favorites.map((favorite) => {
      if (favorite._id === this.props.marked) {
        return (
          <div key={favorite._id}>
            <span className='row'>
              <img src={star} role='presentation' />
              <h5 style={{display: 'inline-block'}}>{favorite.name}</h5>
                <span className='row'><i>lat: </i><tt>{favorite.lat}</tt></span>
                <span className='row'><i>long: </i><tt>{favorite.long}</tt></span>
            </span>
          </div>
        );
      } else {
        return null;
      }
    });
    return (
      <div className='drawer'>
        <div style={{overflowY: 'auto', overflowX: 'hidden'}}>
          <div className='list list--divider'>
            <div className='list__title'>
              <h4>
                <img src={people} role='presentation' />
                { this.props.family.name }
              </h4>
            </div>
            <div className='list__header'>
              <h5>Members</h5>
            </div>
            { familyMembers }
            <div className='list__header'>
              <h5>Favorites</h5>
            </div>
            { familyFavorites }
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
            onClick={() => this.setState({showDialog: true})}>
              <img src={exit} role='presentation' />
              Sign out
            </button>
          </div>
        </div>
        {
          this.props.marked &&
          <div className='drawer__segment details'>
            { memberDetails }
            { favoriteDetails }
          </div>
        }

        <Dialog
          show={this.state.showDialog}
          title={'Sign out'}
          onConfirm={this.signOut.bind(this)}
          onClose={() => this.setState({showDialog: false})}>
          Do you really want to sign out?
        </Dialog>
      </div>
    );
  }
}

export default connect((store) => {
  return {
    user: store.user,
    family: store.family,
    marked: store.app.marked,
    settings: store.app.settings,
    socket: store.system.socket,
  }
})(Drawer);
