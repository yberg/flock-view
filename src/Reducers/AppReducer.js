export default function reducer(state={
  marked: undefined,
  settings: false
}, action) {
  switch (action.type) {
    case 'SET_MARKED':
      return {
        ...state,
        marked: action.payload.marked,
        markerType: action.payload.markerType
      }
    case 'OPEN_SETTINGS':
      return {...state, settings: true}
    case 'CLOSE_SETTINGS':
      return {...state, settings: false}
    default:
      return state
  }
}
