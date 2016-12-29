import React, { Component } from 'react';
import jsonp from 'jsonp';
import io from 'socket.io-client';
import './App.css';

import Login from './Login';
import Drawer from './Drawer';
import GoogleMap from './GoogleMap';

let socket = io('http://localhost:3001', {query: '_id=5804aa86795236fdc199b606'});

let family = {
  id: null,
  name: null,
  favorites: [],
  members: []
};

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      marked: undefined,
      family: family,
      isLoggedIn: false,
      google: undefined
    };
    this.getFamily('5804c0fc795236fdc199b614');
    this.getFamilyMembers('5804c0fc795236fdc199b614');
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
          <Login
            login={this.login.bind(this)}
            isLoggedIn={this.state.isLoggedIn}></Login> : null
        }
        {
          this.state.isLoggedIn ?
          <Drawer
            family={this.state.family}
            setMarked={this.setMarked.bind(this)}
            marked={this.state.marked}
            requestOne={this.requestOne.bind(this)}
            logout={this.logout.bind(this)}
            isLoggedIn={this.state.isLoggedIn}></Drawer> : null
        }
        {
          this.state.isLoggedIn ?
          <GoogleMap
            family={this.state.family}
            setMarked={this.setMarked.bind(this)}
            marked={this.state.marked}
            requestOne={this.requestOne.bind(this)}
            isLoggedIn={this.state.isLoggedIn}
            google={this.state.google}
            setGoogle={this.setGoogle.bind(this)}></GoogleMap> : null
        }
      </div>
    );
  }

  login() {
    this.setState({isLoggedIn: true});
  }

  logout() {
    this.setState({isLoggedIn: false});
  }

  setMarked(marked) {
    this.setState({marked: marked});
  }

  setGoogle(google) {
    this.setState({google: google});
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

  getFamily(familyId) {
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
        }
      }
      console.log('this.state.family:');
      console.log(this.state.family);
    });
  }
}
