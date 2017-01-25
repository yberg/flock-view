import dispatcher from '../dispatcher';
import jsonp from 'jsonp';
import request from 'request';

export function signInWithEmail(email, password, callback) {
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
        console.log('User info from server (Email account): ');
        console.log(body);
        const user = body;
        dispatcher.dispatch({type: 'UPDATE_USER', user});
        if (callback) {
          callback(user);
        }
      } else {
        console.log(body);
      }
    }
  });
}

export function signInWithGoogle(googleUser, callback) {
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
      dispatcher.dispatch({type: 'UPDATE_USER', user});
      callback(user);
    }
  });
  console.log('Logged in as: ' + googleUser.getBasicProfile().getName()
    + ' (' + googleUser.getBasicProfile().getEmail() + ')');
}

export function signOut() {
  dispatcher.dispatch({type: 'UPDATE_USER', user: undefined});
}
