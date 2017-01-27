const initialFamily = {
  id: undefined,
  name: undefined,
  favorites: [],
  members: [],
  fetching: false
}

export default function reducer(state=initialFamily, action) {
  switch (action.type) {
    case 'UPDATE_FAMILY':
      return {...state, ...action.payload.family}
    case 'SIGN_OUT':
      return {...initialFamily}
    default:
      return state
  }
}
