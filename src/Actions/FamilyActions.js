import dispatcher from '../dispatcher';
import jsonp from 'jsonp';

export function loadFamily(familyId, callback) {
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
          dispatcher.dispatch({type: 'UPDATE_FAMILY', family});
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
          dispatcher.dispatch({type: 'UPDATE_FAMILY', family});
        }

        if (callback) {
          callback();
        }
      }
    }
  });
}

export function updateFamily(family) {
  dispatcher.dispatch({type: 'UPDATE_FAMILY', family});
}
