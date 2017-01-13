import React, { Component } from 'react';
import io from 'socket.io-client';
import jsonp from 'jsonp';

import SignIn from '../SignIn/SignIn';
import Navbar from '../Navbar/Navbar';
import Drawer from '../Drawer/Drawer';
import GoogleMap from '../GoogleMap/GoogleMap';
import Settings from '../Settings/Settings';

let socket;

const initialFamily = {
  id: null,
  name: null,
  favorites: [],
  members: []
};

const initialState = {
  marked: undefined,
  family: initialFamily,
  google: undefined,
  gapi: undefined,
};

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  setMarked(marked) {
    this.setState({marked: marked});
  }

  updateState(obj) {
     this.setState(obj);
  }

  requestOne(src, dest) {
    console.log('requestOne(' + src + ', ' + dest + ')');
    socket.emit('requestOne', {
      src: src,
      dest: dest
    });
  }

  loadFamily(familyId, callback) {
    jsonp('http://localhost:3001/family/' + familyId, null, (err, data) => {
      if (err) {
        console.log('error: ' + err.message);
      } else {
        if (data.success) {
          const _family = this.state.family;
          _family.id = data._id;
          _family.name = data.name;
          _family.favorites = data.favorites;
          this.setState({
            family: _family
          });
          if (callback) {
            callback();
          }
        }
      }
      // console.log('this.state.family:');
      // console.log(this.state.family);
    });
    jsonp('http://localhost:3001/user?familyId=' + familyId, null, (err, data) => {
      if (err) {
        console.log('error: ' + err.message);
      } else {
        if (data.success) {
          const _family = this.state.family;
          _family.members = data.users;
          this.setState({
            family: _family
          });
          if (callback) {
            callback();
          }
        }
      }
      // console.log('this.state.family:');
      // console.log(this.state.family);
    });
  }

  signIn(user) {
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
      this.state.family.members.forEach((member) => {
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

    this.props.signIn(user);
  }

  signOut() {
    if (this.state.gapi) {
      this.state.gapi.auth2.getAuthInstance().signOut().then(() => {
        console.log('User signed out from Google.');
      });
    }
    socket.disconnect();
    this.setState(initialState);

    this.props.signOut();
  }

  render() {
    return (
      <div className='App'>
        {
          !this.props.isLoggedIn ?
          <SignIn
            user={this.props.user}
            signIn={this.signIn.bind(this)}
            isLoggedIn={this.props.isLoggedIn}
            gapi={this.state.gapi}
            updateState={this.updateState.bind(this)} /> : null
        }
        {
          this.props.isLoggedIn ?
          <div className='flex-container--column'>
            <Navbar
              user={this.props.user}
              family={this.state.family} />
            <div className='flex-container--row'>
              <Drawer
                user={this.props.user}
                family={this.state.family}
                setMarked={this.setMarked.bind(this)}
                marked={this.state.marked}
                updateState={this.updateState.bind(this)}
                requestOne={this.requestOne.bind(this)}
                signOut={this.signOut.bind(this)}
                isLoggedIn={this.props.isLoggedIn} />
              <GoogleMap
                user={this.props.user}
                family={this.state.family}
                loadFamily={this.loadFamily.bind(this)}
                setMarked={this.setMarked.bind(this)}
                marked={this.state.marked}
                updateState={this.updateState.bind(this)}
                requestOne={this.requestOne.bind(this)}
                isLoggedIn={this.props.isLoggedIn}
                google={this.state.google} />
            </div>
          </div> : null
        }
        {
          this.state.settings ?
          <Settings
            user={this.props.user}
            toggled={this.state.settings}
            updateState={this.updateState.bind(this)} /> : null
        }
      </div>
    )
  }
}
