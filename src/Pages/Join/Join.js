import React, { Component } from 'react';

import SignIn from '../../Components/SignIn/SignIn';

export default class Join extends Component {
  register() {
    
  }

  render() {
    return (
      <div className='App'>
        <SignIn
          register={false}
          onSignIn={this.register.bind(this)} />
      </div>
    )
  }
}
