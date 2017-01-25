import React, { Component } from 'react';
import './App.css';

import UserStore from '../Stores/UserStore';

const initialState = {
  user: undefined
};

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentWillMount() {
    UserStore.on('change', () => {
      this.setState({
        user: UserStore.getUser()
      });
    });
  }

  updateState(obj) {
     this.setState(obj);
  }

  render() {
    const childrenWithProps = React.Children.map(this.props.children, child =>
      React.cloneElement(child, {
        user: this.state.user
      })
    );
    return (
      <div style={{width: '100%', height: '100%'}}>
        {childrenWithProps}
      </div>
    )
  }
}
