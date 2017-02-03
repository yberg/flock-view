export default function reducer(state={}, action) {
  switch (action.type) {
    case 'SIGN_IN':
      return { ...action.payload.user }
    case 'SIGN_OUT':
      return {}
    default:
      return state
  }
}
