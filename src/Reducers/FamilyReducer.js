const initialState = {
  id: undefined,
  name: undefined,
  favorites: [],
  members: [],
  fetching: false
}

export default function reducer(state=initialState, action) {
  switch (action.type) {
    case 'UPDATE_FAMILY':
      return { ...state, ...action.payload.family }
    case 'SIGN_OUT':
      return { ...initialState }
    case 'UPDATE_ONE':
      return {
        ...state,
        members: state.members.map((member) => {
          if (member._id === action.payload.user._id) {
            return {
              ...member,
              lat: action.payload.user.lat,
              long: action.payload.user.long,
              lastUpdated: action.payload.user.lastUpdated,
            }
          } else {
            return member
          }
        })
      }
    case 'ADD_FAVORITE':
      return {
        ...state,
        favorites: [ ...state.favorites, action.payload.favorite ]
      }
    case 'DELETE_FAVORITE':
      return {
        ...state,
        favorites: state.favorites.filter((favorite) => {
          return favorite._id !== action.payload.favorite._id;
        })
      }
    default:
      return state
  }
}
