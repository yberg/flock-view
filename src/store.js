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
      family: {
        members: [],
        favorites: []
      }
    }
  },
  middleware);