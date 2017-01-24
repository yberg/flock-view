import React, { Component } from 'react';
import './App.css';

const initialState = {
  isLoggedIn: false,
  user: undefined
};

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
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

  render() {
    const childrenWithProps = React.Children.map(this.props.children, child =>
      React.cloneElement(child, {
        isLoggedIn: this.state.isLoggedIn,
        user: this.state.user,
        updateState: this.updateState.bind(this),
        signIn: this.signIn.bind(this),
        signOut: this.signOut.bind(this)
      })
    );
    return (
      <div style={{width: '100%', height: '100%'}}>
        {childrenWithProps}
      </div>
    )
  }
}
