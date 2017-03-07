import 'whatwg-fetch'

export function loadFamily(familyId, callback) {
  return function(dispatch) {
    const family = {};
    fetch(`/api/family/${familyId}`, {
        credentials: 'same-origin'
      })
      .then((response) => response.json())
      .then((response) => {
        console.log('loadFamily response', response);
        if (response.success) {
          family.id = response._id;
          family.name = response.name;
          family.favorites = response.favorites;
          family.chat = response.chat;
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
      })
      .catch((error) => {
        console.log('error:', error);
      });

    fetch(`/api/user?familyId=${familyId}`, {
        credentials: 'same-origin'
      })
      .then((response) => response.json())
      .then((response) => {
        if (response.success) {
          family.members = response.users;
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
      })
      .catch((error) => {
        console.log('error:', error);
      });
  }
}

export function loadChat(familyId, callback) {
  console.log('loadChat', familyId);
  return function(dispatch) {
    fetch(`/api/family/${familyId}/chat`, {
        credentials: 'same-origin'
      })
      .then((response) => response.json())
      .then((response) => {
        if (response.success) {
          const { chat } = response;
          dispatch({
            type: 'UPDATE_CHAT',
            payload: {
              chat
            }
          });
          if (callback) {
            callback(chat);
          }
        }
      })
      .catch((error) => {
        console.log('error: ', error.message);
      });
  }
}

export function sendChatMessage(text, { _id }, familyId, callback) {
  console.log('in sendMessage')
  return function(dispatch) {
    fetch(`/api/family/${familyId}/chat/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          _id,
          text
        })
      })
      .then((response) => response.json())
      .then((response) => {
        if (response.success) {
          dispatch(addChatMessage(response));
          if (callback) {
            callback(response);
          }
        }
      })
      .catch((error) => {
        console.log('error:', error);
      });
  }
}

export function addChatMessage(message) {
  return {
    type: 'ADD_CHAT_MESSAGE',
    payload: {
      message
    }
  }
}

export function addFavorite(user, favorite, callback) {
  return function(dispatch) {
    fetch(`/api/family/${user.familyId}/addFavorite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          _id: user._id,
          name: favorite.name,
          lat: favorite.lat,
          long: favorite.long,
          radius: favorite.radius,
        })
      })
      .then((response) => response.json())
      .then((response) => {
        if (response.success) {
          delete response.success;
          delete response.message;
          dispatch({
            type: 'ADD_FAVORITE',
            payload: {
              favorite: response
            }
          });
          if (callback) {
            callback(response);
          }
        } else {
          console.log(response);
        }
      })
      .catch((error) => {
        console.log('error:', error);
      });
  }
}

export function deleteFavorite(user, favorite, callback) {
  return function(dispatch) {
    fetch('/api/family/' + user.familyId + '/deleteFavorite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin',
        body: JSON.stringify({
          _id: user._id,
          favoriteId: favorite._id,
        })
      })
      .then((response) => response.json())
      .then((response) => {
        if (response.success) {
          dispatch({
            type: 'DELETE_FAVORITE',
            payload: {
              favorite
            }
          });
          if (callback) {
            callback(response);
          }
        } else {
          console.log(response);
        }
      })
      .catch((error) => {
        console.log('error:', error);
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
