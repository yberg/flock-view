export function setMarked(id, type) {
  return {
    type: 'SET_MARKED',
    payload: {
      marked: id,
      markedType: type,
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
