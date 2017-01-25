import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import './index.css';

import App from './Pages/App';
import Main from './Pages/Main/Main';
import Join from './Pages/Join/Join';

ReactDOM.render(
  <Router history={browserHistory} >
    <Route path='/' component={App}>
      <IndexRoute component={Main} />
      <Route path='join' component={Join} />
    </Route>
  </Router>,
  document.getElementById('root')
);
