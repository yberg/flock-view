import 'whatwg-fetch'

export function editUser(user, callback) {
  return function(dispatch) {
    fetch('/api/user/' + user._id + '/edit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          _id: user._id,
          password: user.password,
          newPassword: user.newPassword
        })
      })
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        if (response.success) {
          callback(user);
        }
      })
      .catch((error) => {
        console.log('error: ' + error.message);
      });
  }
}

export function signInWithEmail({email, password}, callback) {
  return function(dispatch) {
    fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          email,
          password
        })
      })
      .then((response) => response.json())
      .then((response) => {
        const user = response;
        if (user.success) {
          console.log('User info from server (Email account):', user);
          callback(user);
        } else {
          console.log(user);
        }
      })
      .catch((error) => {
        console.log('error: ' + error.message);
      });
  }
}

export function signInWithGoogle(googleUser, callback) {
  return function(dispatch) {
    const userDetails = googleUser.getBasicProfile();
    console.log('Google user details:', userDetails);
    fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          gmail: userDetails.getEmail(),
          idToken: googleUser.getAuthResponse().id_token
        })
      })
      .then((response) => response.json())
      .then((response) => {
        console.log('User info from server (Google account):', response);
        const user = response;
        user.googleImageUrl = userDetails.getImageUrl();
        callback(user);
      })
      .catch((error) => {
        console.log('error: ' + error.message);
      });
    console.log('Logged in as: ' + googleUser.getBasicProfile().getName()
      + ' (' + googleUser.getBasicProfile().getEmail() + ')');
  }
}

export function register({email, firstName, lastName, password}, callback) {
  return function(dispatch) {
    fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          email,
          firstName,
          lastName,
          password
        })
      })
      .then((response) => response.json())
      .then((response) => {
        console.log('Register response:', response);
        if (response.success) {
          callback(response);
        }
      })
      .catch((error) => {
        console.log('error: ' + error.message);
      });
  }
}

export function signIn(user) {
  return {
    type: 'SIGN_IN',
    payload: {
      user
    }
  }
}

export function signOut() {
  return function(dispatch) {
    fetch('/api/logout', {
        credentials: 'same-origin',
      })
      .then(() => {
        dispatch({
          type: 'SIGN_OUT'
        });
      })
      .catch((error) => {
        console.log('error: ' + error.message);
      });
  }
}

export function joinFamily({_id, email, gmail}, familyId, callback) {
  return function(dispatch) {
    fetch('/api/family/' + familyId + '/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          _id,
          email,
          gmail
        })
      })
      .then((response) => response.json())
      .then((response) => {
        console.log('Join response:', response);
        if (response.success) {
          const user = response;
          dispatch({
            type: 'JOIN_FAMILY',
            payload: {
              user
            }
          });
          signIn(user);
          if (callback) {
            callback(user);
          }
        }
      })
      .catch((error) => {
        console.log('error: ' + error.message);
      });
  }
}
