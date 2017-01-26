import React, { Component } from 'react';
import './App.css';

export default class App extends Component {
  updateState(obj) {
     this.setState(obj);
  }

  render() {
    const childrenWithProps = React.Children.map(this.props.children, child =>
      React.cloneElement(child, {
        user: this.props.user
      })
    );
    return (
      <div style={{width: '100%', height: '100%'}}>
        { childrenWithProps }
      </div>
    )
  }
}
