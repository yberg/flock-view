import { EventEmitter } from 'events';

import dispatcher from '../dispatcher.js';

class UserStore extends EventEmitter {
  constructor() {
    super();
    this.user = undefined;
  }

  getUser() {
    return this.user;
  }

  handleActions(action) {
    console.log('UserStore received an action', action);
    switch (action.type) {
      case 'UPDATE_USER':
        this.user = action.user;
        this.emit('change');
        break;
    }
  }
}

const userStore = new UserStore;
dispatcher.register(userStore.handleActions.bind(userStore));

export default userStore;
