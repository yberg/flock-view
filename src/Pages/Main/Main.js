import React, { Component } from 'react';
import io from 'socket.io-client';
import jsonp from 'jsonp';

import SignIn from '../../Components/SignIn/SignIn';
import Navbar from '../../Components/Navbar/Navbar';
import Drawer from '../../Components/Drawer/Drawer';
import GoogleMap from '../../Components/GoogleMap/GoogleMap';
import Settings from '../../Components/Settings/Settings';

import UserStore from '../../Stores/UserStore';
import FamilyStore from '../../Stores/FamilyStore';

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

  componentWillMount() {
    FamilyStore.on('change', () => {
      this.setState({
        family: FamilyStore.getFamily()
      });
    });
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

  initSocket(user) {
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
  }

  signOut() {
    if (this.state.gapi) {
      this.state.gapi.auth2.getAuthInstance().signOut().then(() => {
        console.log('User signed out from Google.');
      });
    }
    socket.disconnect();
    this.setState(initialState);
  }

  render() {
    return (
      <div className='App'>
        {
          !this.props.user &&
          <SignIn
            user={this.props.user}
            onSignIn={this.initSocket.bind(this)}
            gapi={this.state.gapi}
            updateState={this.updateState.bind(this)} />
        }
        {
          this.props.user &&
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
                onSignOut={this.signOut.bind(this)}
                isLoggedIn={this.props.isLoggedIn} />
              <GoogleMap
                user={this.props.user}
                family={this.state.family}
                setMarked={this.setMarked.bind(this)}
                marked={this.state.marked}
                updateState={this.updateState.bind(this)}
                requestOne={this.requestOne.bind(this)}
                isLoggedIn={this.props.isLoggedIn}
                google={this.state.google} />
            </div>
          </div>
        }
        {
          this.state.settings &&
          <Settings
            user={this.props.user}
            toggled={this.state.settings}
            updateState={this.updateState.bind(this)} />
        }
      </div>
    )
  }
}
