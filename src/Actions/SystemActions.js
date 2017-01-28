import io from 'socket.io-client';

export function setGoogle(google) {
  return {
    type: 'SET_GOOGLE',
    payload: {
      google
    }
  }
}

export function setGapi(gapi) {
  return {
    type: 'SET_GAPI',
    payload: {
      gapi
    }
  }
}

export function setSocket(socket) {
  return {
    type: 'SET_SOCKET',
    payload: {
      socket
    }
  }
}

export function initSocket(user) {
  return function(dispatch) {
    // Init socket
    console.log('http://localhost:3001, query:_id=' + user._id);
    const socket = io('http://localhost:3001', {query: '_id=' + user._id});
    socket.on('newConnection', (data) => {
      console.log(data);
    }).on('updateRequest', (data) => {
      // Update self
      /*socket.emit('updateSelf', {
        _id: 'test_id',
      });*/
    }).on('updatedOne', (data) => {
      // Updated requested user
      dispatch({
        type: 'UPDATE_ONE',
        payload: {
          user: data
        }
      });
    }).on('socketError', (data) => {
      console.log(data);
    });
    dispatch({
      type: 'INIT_SOCKET',
      payload: {
        socket
      }
    });
  }
}

export function closeSocket() {
  return {
    type: 'CLOSE_SOCKET'
  }
}
