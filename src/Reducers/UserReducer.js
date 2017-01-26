export default function reducer(state={
  user: undefined,
  fetching: false
}, action) {
  switch (action.type) {
    case 'SIGN_IN':
      return {...state, user: action.payload.user}
    case 'SIGN_OUT':
      return {...state, user: undefined}
    default:
      return state
  }
}
