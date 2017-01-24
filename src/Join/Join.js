import React, { Component } from 'react';

import SignIn from '../SignIn/SignIn';

export default class Join extends Component {
  render() {
    return (
      <div className='App'>
        <SignIn
          register={false}
          user={this.props.user}
          signIn={this.signIn.bind(this)}
          isLoggedIn={this.props.isLoggedIn}
          gapi={undefined}
          updateState={this.props.updateState.bind(this)} />
      </div>
    )
  }
}
