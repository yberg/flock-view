const initialFamily = {
  family: {
    id: undefined,
    name: undefined,
    favorites: [],
    members: [],
  },
  fetching: false
}

export default function reducer(state=initialFamily, action) {
  switch (action.type) {
    case 'UPDATE_FAMILY':
      return {...state, family: action.payload.family}
    case 'SIGN_OUT':
      return {...state, family: initialFamily}
    default:
      return state
  }
}
