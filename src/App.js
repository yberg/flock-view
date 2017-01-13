import React, { Component } from 'react';
import { Router, Route, browserHistory } from 'react-router';
import './App.css';

import Main from './Main/Main';

const initialState = {
  isLoggedIn: false,
  user: undefined
};

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  render() {
    return (
      // <Router history={browserHistory} >
      //   <Route path='/' component={Main}
      //     isLoggedIn={this.state.isLoggedIn}
      //     user={this.state.user}
      //     updateState={this.updateState.bind(this)}
      //     signIn={this.signIn.bind(this)}
      //     signOut={this.signOut.bind(this)} />
      // </Router>
      <Main
        isLoggedIn={this.state.isLoggedIn}
        user={this.state.user}
        updateState={this.updateState.bind(this)}
        signIn={this.signIn.bind(this)}
        signOut={this.signOut.bind(this)} />
    );
  }

  signIn(user) {
    this.setState({
      isLoggedIn: true,
      user: user,
    });
  }

  signOut() {
    this.setState(initialState);
  }

  updateState(obj) {
     this.setState(obj);
  }
}
