export default function reducer(state={
  google: undefined,
  gapi: undefined,
  socket: undefined
}, action) {
  switch (action.type) {
    case 'SET_GOOGLE':
      return {...state, google: action.payload.google}
    case 'SET_GAPI':
      return {...state, gapi: action.payload.gapi}
    case 'SET_SOCKET':
      return {...state, socket: action.payload.socket}
    default:
      return state
  }
}
