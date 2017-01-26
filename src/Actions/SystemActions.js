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
