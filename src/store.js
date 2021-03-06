import { applyMiddleware, createStore } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';

import reducer from './Reducers';

const middleware = applyMiddleware(promise(), thunk, logger());

export default createStore(
  reducer,
  {
    family: {
      members: [],
      favorites: [],
      chat: []
    },
    app: {
      marked: {}
    }
  },
  middleware
);
