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
          className={'list__item' + (this.props.marked._id === member._id ? ' active active--blue' : '')}
          onClick={() => this.props.dispatch(AppActions.setMarked(member, 'MEMBER'))}>
          <div className='list__item__icon'>
            {
              member.imageUrl || member.googleImageUrl ?
                <img src={member.imageUrl || member.googleImageUrl} role='presentation' />
              : <i className='fa fa-user blue' />
            }
          </div>
          <span>{member.firstName}</span>
        </a>
      );
    });
    const familyFavorites = family.favorites && family.favorites.map((favorite) => {
      return (
        <a key={favorite._id}
          className={'list__item' + (this.props.marked._id === favorite._id ? ' active active--amber' : '')}
          onClick={() => this.props.dispatch(AppActions.setMarked(favorite, 'FAVORITE'))}>
          <div className='list__item__icon'>
            <i className='fa fa-star amber' />
          </div>
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
            <span className='row header'>
              {
                marked.gmail ?
                  <img src={google} role='presentation' />
                : <i className='fa fa-envelope gray' />
              }
              {
                marked.imageUrl || marked.googleImageUrl ?
                  <img src={marked.imageUrl || marked.googleImageUrl} role='presentation' />
                : <i className='fa fa-user blue' />
              }
              <h5 style={{display: 'inline-block'}}>{marked.firstName}</h5>
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
            <span className='row header'>
              <i className='fa fa-star amber' />
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
              <i className='fa fa-trash' />
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
                <i className='fa fa-users green' />
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
            <a onClick={this.openSettings.bind(this)} className='list__item'>
              <div className='list__item__icon'>
                <i className='fa fa-cog gray' />
              </div>
              <span>Settings</span>
            </a>
          </div>
          <div className='drawer__segment'>
            <button className='button button--red center'
            onClick={() => this.setState({showSignOutDialog: true})}>
              <i className='fa fa-sign-out list__item__icon' />
              <span>Sign out</span>
            </button>
          </div>
        </ReactCSSTransitionGroup>
        {
          this.props.marked._id &&
          <div className='drawer__segment details'>
            { details }
          </div>
        }

        <Dialog
          show={this.state.showSignOutDialog}
          title={'Sign out'}
          icon={'sign-out'}
          onConfirm={this.signOut.bind(this)}
          onClose={() => this.setState({showSignOutDialog: false})}>
          Do you really want to sign out?
        </Dialog>
        <Dialog
          show={this.state.showDeleteFavoriteDialog}
          title={'Delete favorite'}
          icon={'trash'}
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
