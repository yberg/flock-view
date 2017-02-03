const initialState = {
  marked: undefined,
};

export default function reducer(state=initialState, action) {
  switch (action.type) {
    case 'SIGN_OUT':
      return { ...initialState }
    case 'SET_MARKED':
      return {
        ...state,
        marked: action.payload.marked,
        markerType: action.payload.markerType
      }
    case 'DELETE_FAVORITE':
      return { ...state, marked: undefined, markerType: undefined }
    default:
      return state
  }
}
