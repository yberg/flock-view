import { EventEmitter } from 'events';

import dispatcher from '../dispatcher.js';

class FamilyStore extends EventEmitter {
  constructor() {
    super();
    this.family = {
      favorites: [],
      members: []
    };
  }

  getFamily() {
    return this.family;
  }

  handleActions(action) {
    console.log('FamilyStore received an action', action);
    switch (action.type) {
      case 'UPDATE_FAMILY':
        this.family = action.family;
        this.emit('change');
        break;
    }
  }
}

const familyStore = new FamilyStore;
dispatcher.register(familyStore.handleActions.bind(familyStore));

export default familyStore;
