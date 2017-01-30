import React, { Component } from 'react';
import { connect } from 'react-redux';
import cookie from 'react-cookie';
import './Main.css';

import Auth from '../../Components/Auth/Auth';
import Navbar from '../../Components/Navbar/Navbar';
import Drawer from '../../Components/Drawer/Drawer';
import GoogleMap from '../../Components/GoogleMap/GoogleMap';
import Settings from '../../Components/Settings/Settings';

import * as SystemActions from '../../Actions/SystemActions';
import { signIn } from '../../Actions/UserActions';

class Main extends Component {
  init(user) {
    this.props.dispatch(SystemActions.initSocket(user));
    this.props.dispatch(signIn(user));
    cookie.save('user', user, { path: '/' });
  }

  signOut() {
    if (this.props.gapi) {
      this.props.gapi.auth2.getAuthInstance().signOut().then(() => {
        console.log('User signed out from Google.');
      });
      this.props.dispatch(SystemActions.setGapi(undefined));
    }
    this.props.dispatch(SystemActions.closeSocket());
  }

  render() {
    if (!this.props.user._id) {
      return (
        <div className='App'>
          <Auth
            onSignIn={this.init.bind(this)}
            onRegister={this.init.bind(this)} />
        </div>
      )
    } else {
      return (
        <div className='App'>
          <div className='flex-container--column'>
            <Navbar
              user={this.props.user}
              title={'Flock'} />
            <div className='flex-container--row'>
              <Drawer
                onSignOut={this.signOut.bind(this)} />
              <GoogleMap />
            </div>
            {
              this.props.settings &&
              <div className='container--center'>
                <Settings />
              </div>
            }
          </div>
        </div>
      )
    }
  }
}

export default connect((store) => {
  return {
    user: store.user,
    family: store.family,
    marked: store.app.marked,
    settings: store.app.settings,
    google: store.system.google,
    gapi: store.system.gapi,
  };
})(Main);
