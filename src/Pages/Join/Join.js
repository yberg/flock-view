import React, { Component } from 'react';
import { connect } from 'react-redux';

import Auth from '../../Components/Auth/Auth';

import { joinFamily } from '../../Actions/UserActions';

class Join extends Component {
  join(user) {
    this.props.dispatch(joinFamily({
        _id: user._id,
        email: user.email,
        gmail: user.gmail,
      },
      this.props.routeParams.familyId,
      () => this.props.router.push('/')
    ));
  }

  render() {
    console.log(this.props);
    return (
      <div className='App'>
        <Auth
          onSignIn={this.join.bind(this)} />
      </div>
    )
  }
}

export default connect((store) => {
  return {
    user: store.user,
  }
})(Join)
