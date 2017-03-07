import React, { Component } from 'react';
import { connect } from 'react-redux';
import cookie from 'react-cookie';
import './Main.css';

import Auth from '../../Components/Auth/Auth';
import Navbar from '../../Components/Navbar/Navbar';
import Drawer from '../../Components/Drawer/Drawer';
import GoogleMap from '../../Components/GoogleMap/GoogleMap';
import Chat from '../../Components/Chat/Chat';

import * as SystemActions from '../../Actions/SystemActions';
import { signIn } from '../../Actions/UserActions';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showChat: false
    };
  }

  init(user) {
    this.props.dispatch(SystemActions.initSocket(user));
    this.props.dispatch(signIn(user));
    if (user.email) {
      cookie.save('user', { _id: user._id, email: user.email }, { path: '/' });
    }
  }

  signOut() {
    if (this.props.gapi) {
      this.props.gapi.auth2.getAuthInstance().signOut().then(() => {
        console.log('User signed out from Google.');
      });
      this.props.dispatch(SystemActions.setGapi(undefined));
    }
    this.props.dispatch(SystemActions.closeSocket());
    cookie.remove('user', { path: '/' });
  }

  toggleChat() {
    if (this.state.showChat) {
      this.hideChat();
    } else {
      this.showChat();
    }
  }

  showChat() {
    this.setState({ showChat: true });
    setTimeout(() => {
      this.props.google.maps.event.trigger(this.props.map, 'resize');
    }, 200);
  }

  hideChat() {
    this.setState({ showChat: false });
    // Repaint map while chat is sliding out
    setTimeout(() => {
      this.props.google.maps.event.trigger(this.props.map, 'resize');
      setTimeout(() => {
        this.props.google.maps.event.trigger(this.props.map, 'resize');
        setTimeout(() => {
          this.props.google.maps.event.trigger(this.props.map, 'resize');
          setTimeout(() => {
            this.props.google.maps.event.trigger(this.props.map, 'resize');
          }, 50);
        }, 50);
      }, 50);
    }, 50);
  }

  render() {
    if (!this.props.user._id) {
      return (
        <div className='main'>
          <div className='container--center'>
            <Auth
              onSignIn={this.init.bind(this)}
              onRegister={this.init.bind(this)} />
          </div>
        </div>
      )
    } else {
      return (
        <div className='main'>
          <div className='flex-container--column'>
            <Navbar
              user={this.props.user}
              title={'Flock'}
              menuIsActive={this.state.showChat}
              onMenuClick={this.toggleChat.bind(this)} />
            <div className='flex-container--row'>
              <Drawer
                onSignOut={this.signOut.bind(this)} />
              <GoogleMap />
              <Chat
                show={this.state.showChat} />
            </div>
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
    google: store.system.google,
    gapi: store.system.gapi,
    map: store.system.map,
  };
})(Main);
