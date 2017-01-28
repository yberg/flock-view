import jsonp from 'jsonp';
import request from 'request';

export function loadFamily(familyId, callback) {
  return function(dispatch) {
    const family = {};
    jsonp('http://localhost:3001/family/' + familyId, null, (err, data) => {
      if (err) {
        console.log('error: ' + err.message);
      } else {
        if (data.success) {
          family.id = data._id;
          family.name = data.name;
          family.favorites = data.favorites;
          if (family.members) {
            dispatch({
              type: 'UPDATE_FAMILY',
              payload: {
                family
              }
            });
          }
          if (callback) {
            callback();
          }
        }
      }
    });
    jsonp('http://localhost:3001/user?familyId=' + familyId, null, (err, data) => {
      if (err) {
        console.log('error: ' + err.message);
      } else {
        if (data.success) {
          family.members = data.users;
          if (family.favorites) {
            dispatch({
              type: 'UPDATE_FAMILY',
              payload: {
                family
              }
            });
          }
          if (callback) {
            callback();
          }
        }
      }
    });
  }
}

export function addFavorite(user, favorite, callback) {
  return function(dispatch) {
    request.post('http://localhost:3001/family/' + user.familyId + '/addFavorite', {
      form: {
        _id: user._id,
        name: favorite.name,
        lat: favorite.lat,
        long: favorite.long,
        radius: favorite.radius,
      }
    }, (err, httpResponse, body) => {
      if (err) {
        console.log('error: ' + err.message);
      } else {
        body = JSON.parse(body);
        const favorites = body;
        if (body.success) {
          delete body.success;
          delete body.message;
          dispatch({
            type: 'ADD_FAVORITE',
            payload: {
              favorite: body
            }
          });
          if (callback) {
            callback(body);
          }
        } else {
          console.log(body);
        }
      }
    });
  }
}

export function updateFamily(family) {
  return {
    type: 'UPDATE_FAMILY',
    payload: {
      family
    }
  }
}
