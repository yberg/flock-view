import request from 'request';

export function signInWithEmail({email, password}, callback) {
  return function(dispatch) {
    request.post('http://localhost:3001/auth', {
      form: {
        email,
        password
      }
    }, (err, httpResponse, body) => {
      if (err) {
        console.log('error: ' + err.message);
      } else {
        body = JSON.parse(body);
        if (body.success) {
          console.log('User info from server (Email account): ', body);
          const user = body;
          dispatch({
            type: 'SIGN_IN',
            payload: {
              user
            }
          });
          if (callback) {
            callback(user);
          }
        } else {
          console.log(body);
        }
      }
    });
  }
}

export function signInWithGoogle(googleUser, callback) {
  return function(dispatch) {
    const userDetails = googleUser.getBasicProfile();
    console.log('Google user details: ');
    console.log(userDetails);
    request.post('http://localhost:3001/auth', {
      form: {
        gmail: userDetails.getEmail(),
        idToken: googleUser.getAuthResponse().id_token
      }
    }, (err, httpResponse, body) => {
      if (err) {
        console.log('error: ' + err.message);
      } else {
        body = JSON.parse(body);
        console.log('User info from server (Google account): ');
        console.log(body);
        const user = body;
        user.googleImageUrl = userDetails.getImageUrl();
        dispatch({
          type: 'SIGN_IN',
          payload: {
            user
          }
        });
        if (callback) {
          callback(user);
        }
      }
    });
    console.log('Logged in as: ' + googleUser.getBasicProfile().getName()
      + ' (' + googleUser.getBasicProfile().getEmail() + ')');
  }
}

export function register({email, firstName, lastName, password}, callback) {
  return function(dispatch) {
    request.post('http://localhost:3001/register', {
      form: {
        email,
        firstName,
        lastName,
        password,
      }
    }, (err, httpResponse, body) => {
      if (err) {
        console.log('error: ' + err.message);
      } else {
        body = JSON.parse(body);
        console.log('Register response', body);
        if (body.success) {
          const user = body;
          dispatch({
            type: 'SIGN_IN',
            payload: {
              user
            }
          });
          if (callback) {
            callback(user);
          }
        }
      }
    });
  }
}

export function signOut() {
  return {
    type: 'SIGN_OUT'
  }
}
