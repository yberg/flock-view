import React, { Component } from 'react';
import jsonp from 'jsonp';
import './App.css';

import Drawer from './Drawer';
import GoogleMap from './GoogleMap';

var family = {
  id: null,
  name: null,
  favorites: [],
  members: []
};

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      marked: null,
      family: family
    };
    this.getFamily('5804c0fc795236fdc199b614');
    this.getFamilyMembers('5804c0fc795236fdc199b614');
  }

  render() {
    return (
      <div className='App'>
        <Drawer
          family={this.state.family}
          setMarked={this.setMarked.bind(this)}
          marked={this.state.marked}></Drawer>
        <GoogleMap
          family={this.state.family}
          setMarked={this.setMarked.bind(this)}
          marked={this.state.marked}></GoogleMap>
      </div>
    );
  }

  setMarked(marked) {
    this.setState({marked: marked});
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
