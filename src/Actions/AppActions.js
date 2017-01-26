export function setMarked(id) {
  return {
    type: 'SET_MARKED',
    payload: {
      marked: id
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
