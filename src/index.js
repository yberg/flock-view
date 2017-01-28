import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import './index.css';

import App from './Pages/App';
import Main from './Pages/Main/Main';
import Join from './Pages/Join/Join';

import store from './store';

ReactDOM.render(
  <Provider store={store}>
    <Router history={browserHistory} >
      <Route path='/' component={App}>
        <IndexRoute component={Main} />
        <Route path='join/:familyId' component={Join} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
);

// TODO:
// Dialog component (Do you really want to...) popup window (like Settings)
