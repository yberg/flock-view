import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import './index.css';

import App from './App';
import Main from './Main/Main';
import Join from './Join/Join';

ReactDOM.render(
  <Router history={browserHistory} >
    <Route path='/' component={App}>
      <IndexRoute component={Main} />
      <Route path='join' component={Join} />
    </Route>
  </Router>,
  document.getElementById('root')
);
