import React from 'react';
import ReactDOM from 'react-dom';

import { combineReducers, createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore, routerMiddleware, routerReducer } from 'react-router-redux';

import App from './components/App';

import { extractJwtFromCookie } from './actions/auth';

import reducers from './reducers/index';
import api from './middleware/api';

import './style.css';


const store = createStore(
  combineReducers({
    ...reducers,
    routing: routerReducer,
  }),
  applyMiddleware(thunk, api, routerMiddleware(browserHistory)),
);

const history = syncHistoryWithStore(browserHistory, store);

store.dispatch(extractJwtFromCookie());

ReactDOM.render(
  <Provider store={store}>
    <App history={history} />
  </Provider>,
  document.getElementById('root'),
);
