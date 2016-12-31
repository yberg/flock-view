import React, { Component } from 'react';
import jsonp from 'jsonp';
import io from 'socket.io-client';
import './App.css';

import SignIn from './SignIn/SignIn';
import Navbar from './Navbar/Navbar';
import Drawer from './Drawer/Drawer';
import GoogleMap from './GoogleMap/GoogleMap';

let socket = io('http://localhost:3001', {query: '_id=5804aa86795236fdc199b606'});

let initialFamily = {
  id: null,
  name: null,
  favorites: [],
  members: []
};

let initialState = {
  marked: undefined,
  family: initialFamily,
  isLoggedIn: false,
  google: undefined,
  gapi: undefined,
  user: undefined
};

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidMount() {
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
      // Socket error
    });
  }

  render() {
    return (
      <div className='App'>
        {
          !this.state.isLoggedIn ?
          <SignIn
            user={this.state.user}
            signIn={this.signIn.bind(this)}
            isLoggedIn={this.state.isLoggedIn}
            gapi={this.state.gapi}
            updateState={this.updateState.bind(this)}></SignIn> : null
        }
        {
          this.state.isLoggedIn ?
          <div className='flex-container--column'>
            <Navbar
              user={this.state.user}
              family={this.state.family}></Navbar>
            <div className='flex-container--row'>
              <Drawer
                user={this.state.user}
                family={this.state.family}
                setMarked={this.setMarked.bind(this)}
                marked={this.state.marked}
                requestOne={this.requestOne.bind(this)}
                signOut={this.signOut.bind(this)}
                isLoggedIn={this.state.isLoggedIn}></Drawer>
              <GoogleMap
                user={this.state.user}
                family={this.state.family}
                loadFamily={this.loadFamily.bind(this)}
                setMarked={this.setMarked.bind(this)}
                marked={this.state.marked}
                updateState={this.updateState.bind(this)}
                requestOne={this.requestOne.bind(this)}
                isLoggedIn={this.state.isLoggedIn}
                google={this.state.google}></GoogleMap>
            </div>
          </div> : null
        }
      </div>
    );
  }

  signIn(user) {
    this.setState({
      isLoggedIn: true,
      user: user
    });
  }

  signOut() {
    if (this.state.gapi) {
      this.state.gapi.auth2.getAuthInstance().signOut().then(() => {
        console.log('User signed out from Google.');
      });
    }
    this.setState(initialState);
  }

  setMarked(marked) {
    this.setState({marked: marked});
  }

  updateState(obj) {
     this.setState(obj);
  }

  requestOne(src, dest) {
    socket.emit('requestOne', {
      src: src,
      dest: dest
    });
  }

  getFamilyMembers(familyId) {
    jsonp('http://localhost:3001/user?familyid=' + familyId, null, (err, data) => {
      if (err) {
        console.log('error: ' + err.message);
      } else {
        if (data.success) {
          var _family = this.state.family;
          _family.members = data.users;
          this.setState({
            family: _family
          });
        }
      }
      console.log('this.state.family:');
      console.log(this.state.family);
    });
  }

  loadFamily(familyId, callback) {
    jsonp('http://localhost:3001/family/' + familyId, null, (err, data) => {
      if (err) {
        console.log('error: ' + err.message);
      } else {
        if (data.success) {
          var _family = this.state.family;
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
      console.log('this.state.family:');
      console.log(this.state.family);
    });
    jsonp('http://localhost:3001/user?familyId=' + familyId, null, (err, data) => {
      if (err) {
        console.log('error: ' + err.message);
      } else {
        if (data.success) {
          var _family = this.state.family;
          _family.members = data.users;
          this.setState({
            family: _family
          });
          if (callback) {
            callback();
          }
        }
      }
      console.log('this.state.family:');
      console.log(this.state.family);
    });
  }
}
