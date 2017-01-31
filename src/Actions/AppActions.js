export function setMarked(user, type) {
  return {
    type: 'SET_MARKED',
    payload: {
      marked: user,
      markerType: type,
    }
  }
}
