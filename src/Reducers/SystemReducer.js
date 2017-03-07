const initialState = {
  google: undefined,
  map: undefined,
  gapi: undefined,
  socket: undefined
}

export default function reducer(state=initialState, action) {
  switch (action.type) {
    case 'SET_GOOGLE':
      return { ...state, google: action.payload.google }
    case 'SET_MAP':
      return { ...state, map: action.payload.map}
    case 'SET_GAPI':
      return { ...state, gapi: action.payload.gapi }
    case 'INIT_SOCKET':
      return { ...state, socket: action.payload.socket }
    case 'CLOSE_SOCKET':
      return { ...state, socket: undefined }
    case 'SIGN_OUT':
      return { ...initialState }
    default:
      return state
  }
}
