import io from 'socket.io-client';

export function setGoogle(google) {
  return {
    type: 'SET_GOOGLE',
    payload: {
      google
    }
  }
}

export function setMap(map) {
  return {
    type: 'SET_MAP',
    payload: {
      map
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
    console.log('/, query:_id=' + user._id);
    const socket = io('/', {query: '_id=' + user._id});
    socket.on('newConnection', (data) => {
      console.log(data);
    }).on('updateRequest', (data) => {
      // Update self
      console.log('Received an update request:', data);
      /*socket.emit('updateSelf', {
        _id: 'test_id',
      });*/
    }).on('updatedOne', (data) => {
      // Updated requested user
      //console.log('Updated one:', data);
      dispatch({
        type: 'UPDATE_ONE',
        payload: {
          user: data
        }
      });
    }).on('socketError', (data) => {
      console.log('Error:', data);
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
