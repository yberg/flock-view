import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './Drawer.css';

import Dialog from '../Dialog/Dialog';
import Settings from '../Settings/Settings';

import account from '../../img/account_blue.svg';
import star from '../../img/star_amber.svg';
import settings from '../../img/settings_gray.svg';
import people from '../../img/people_green.svg';
import exit from '../../img/exit_white.svg';
import email from '../../img/email_gray.svg';
import google from '../../img/google.svg';
import bin from '../../img/bin_white.svg';

import { deleteFavorite } from '../../Actions/FamilyActions';
import * as UserActions from '../../Actions/UserActions';
import * as AppActions from '../../Actions/AppActions';

class Drawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSignOutDialog: false,
      showDeleteFavoriteDialog: false,
      favoriteToDelete: undefined,
      showSettings: false
    }
  }

  openSettings() {
    this.setState({ showSettings: true })
  }

  closeSettings() {
    this.setState({ showSettings: false })
  }

  requestOne(src, dest) {
    console.log('requestOne(' + src + ', ' + dest + ')');
    this.props.socket.emit('requestOne', {
      src: src,
      dest: dest
    });
  }

  deleteFavorite(favorite) {
    console.log('Delete', favorite);
    this.props.dispatch(deleteFavorite(
      this.props.user,
      favorite,
      () => {
        favorite.marker.setMap(null);
        favorite.circle.setMap(null);
        this.setState({ favoriteToDelete: undefined });
      }
    ));
  }

  signOut() {
    if (this.props.onSignOut) {
      this.props.onSignOut();
    }
    this.props.dispatch(UserActions.signOut());
  }

  render() {
    const { family } = this.props;
    const familyMembers = family.members && family.members.map((member) => {
      return (
        <a key={member._id}
          href={'#' + member.name}
          className={'list__item' + (this.props.marked === member ? ' active active--blue' : '')}
          onClick={() => {
            this.props.dispatch(AppActions.setMarked(member, 'MEMBER'));
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
          className={'list__item' + (this.props.marked === favorite ? ' active active--amber' : '')}
          onClick={() => this.props.dispatch(AppActions.setMarked(favorite, 'FAVORITE'))}>
          <img src={star}
            className='list__item__icon'
            role='presentation' />
          <span>{favorite.name}</span>
        </a>
      );
    });

    let details;
    const { marked } = this.props;
    if (marked) {
      if (this.props.markerType === 'MEMBER') {
        details =
          <div key={marked._id}>
            <span className='row'>
              <img src={marked.email ? email : google} role='presentation' />
              <img src={marked.imageUrl || marked.googleImageUrl || account} role='presentation' />
              <h5 style={{display: 'inline-block'}}>{marked.name}</h5>
            </span>
            <span className='row'>{marked.name}</span>
            <span className='row'><i>lat: </i><tt>{marked.lat}</tt></span>
            <span className='row'><i>long: </i><tt>{marked.long}</tt></span>
            <span className='row'>
              Last updated: {marked.lastUpdated}
            </span>
          </div>
      } else if (this.props.markerType === 'FAVORITE') {
        details =
          <div key={marked._id}>
            <span className='row'>
              <img src={star} role='presentation' />
              <h5 style={{display: 'inline-block'}}>{marked.name}</h5>
            </span>
            <span className='row'><i>lat: </i><tt>{marked.lat}</tt></span>
            <span className='row'><i>long: </i><tt>{marked.long}</tt></span>
            <button className='button button--red button--small'
              style={{marginTop: '4px'}}
              onClick={() => this.setState({
                favoriteToDelete: marked,
                showDeleteFavoriteDialog: true
              })}>
              <img src={bin} role='presentation' />
              Delete
            </button>
          </div>
      }
    }
    return (
      <div className='drawer'>
        <ReactCSSTransitionGroup
          component='div'
          transitionName='drawer'
          style={{overflowY: 'auto', overflowX: 'hidden'}}
          transitionEnter={false}
          transitionLeave={false}
          transitionAppear={true}
          transitionAppearTimeout={500}>
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
            onClick={() => this.setState({showSignOutDialog: true})}>
              <img src={exit} role='presentation' />
              Sign out
            </button>
          </div>
        </ReactCSSTransitionGroup>
        {
          this.props.marked &&
          <div className='drawer__segment details'>
            { details }
          </div>
        }

        <Dialog
          show={this.state.showSignOutDialog}
          title={'Sign out'}
          icon={exit}
          onConfirm={this.signOut.bind(this)}
          onClose={() => this.setState({showSignOutDialog: false})}>
          Do you really want to sign out?
        </Dialog>
        <Dialog
          show={this.state.showDeleteFavoriteDialog}
          title={'Delete favorite'}
          icon={bin}
          onConfirm={this.deleteFavorite.bind(this, this.state.favoriteToDelete)}
          onClose={() => this.setState({showDeleteFavoriteDialog: false})}>
          Do you really want to delete "
          { this.state.favoriteToDelete && this.state.favoriteToDelete.name }
          "?
        </Dialog>
        <Settings
          show={this.state.showSettings}
          onClose={this.closeSettings.bind(this)} />
      </div>
    );
  }
}

export default connect((store) => {
  return {
    user: store.user,
    family: store.family,
    marked: store.app.marked,
    markerType: store.app.markerType,
    settings: store.app.settings,
    socket: store.system.socket,
  }
})(Drawer);
