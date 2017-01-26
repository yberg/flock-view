import { combineReducers } from 'redux';

import system from './SystemReducer';
import app from './AppReducer';
import user from './UserReducer';
import family from './FamilyReducer';

export default combineReducers({
  system,
  app,
  user,
  family,
});
