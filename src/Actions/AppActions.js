export function setMarked(user, type) {
  return {
    type: 'SET_MARKED',
    payload: {
      marked: user,
      markerType: type,
    }
  }
}

export function openSettings() {
  return {
    type: 'OPEN_SETTINGS'
  }
}

export function closeSettings() {
  return {
    type: 'CLOSE_SETTINGS'
  }
}
