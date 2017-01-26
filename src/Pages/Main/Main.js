import React, { Component } from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';

import SignIn from '../../Components/SignIn/SignIn';
import Navbar from '../../Components/Navbar/Navbar';
import Drawer from '../../Components/Drawer/Drawer';
import GoogleMap from '../../Components/GoogleMap/GoogleMap';
import Settings from '../../Components/Settings/Settings';

import * as SystemActions from '../../Actions/SystemActions';

let socket;

class Main extends Component {
  init(user) {
    // Init socket
    console.log('http://localhost:3001, query:_id=' + user._id);
    socket = io('http://localhost:3001', {query: '_id=' + user._id});
    socket.on('newConnection', (data) => {
      console.log(data);
    }).on('updateRequest', (data) => {
      // Update self
      /*socket.emit('updateSelf', {
        _id: 'test_id',
      });*/
    }).on('updatedOne', (data) => {
      // Updated requested user
      console.log('updatedOne: ');
      console.log(data);
      this.props.family.members.forEach((member) => {
        if (member._id === data._id) {
          member.lat = data.lat;
          member.long = data.long;
          member.lastUpdated = data.lastUpdated;
        }
      });
      this.setState({});
    }).on('socketError', (data) => {
      console.log(data);
    });

    this.props.dispatch(SystemActions.setSocket(socket));
  }

  signOut() {
    if (this.props.gapi) {
      this.props.gapi.auth2.getAuthInstance().signOut().then(() => {
        console.log('User signed out from Google.');
      });
      this.props.dispatch(SystemActions.setGapi(undefined));
    }
    socket.disconnect();
  }

  render() {
    return (
      <div className='App'>
        {
          !this.props.user &&
          <SignIn onSignIn={this.init.bind(this)} />
        }
        {
          this.props.user &&
          <div className='flex-container--column'>
            <Navbar
              user={this.props.user}
              title={this.props.family.name} />
            <div className='flex-container--row'>
              <Drawer
                onSignOut={this.signOut.bind(this)} />
              <GoogleMap />
            </div>
          </div>
        }
        {
          this.props.settings &&
          <Settings />
        }
      </div>
    )
  }
}

export default connect((store) => {
  return {
    user: store.user.user,
    family: store.family.family,
    marked: store.app.marked,
    settings: store.app.settings,
    google: store.system.google,
    gapi: store.system.gapi,
  };
})(Main);
