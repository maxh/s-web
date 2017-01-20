import React from 'react';

import { IndexRoute, Redirect, Router, Route } from 'react-router';

import Permissions from './Permissions';
import SignIn from './SignIn';

import requireAuth from '../infra/requireAuth';

const Main = (props) => {
  return (
    <div className={props.location.pathname}>
      <h1>Scout</h1>
      <div className="container content-container">
        {props.children}
      </div>
    </div>
  );
}

const NotFound = () => {
  return <div>Oops! We couldn't find that page.</div>;
}

const App = (props) => {
  return (
    <Router history={props.history}>
      <Route path="/" component={Main}>
        <IndexRoute component={requireAuth(Permissions)} />
        <Route path="/sign-in" component={SignIn} />
        <Route path='/404' component={NotFound} />
        <Redirect from='*' to='/404' />
      </Route>
    </Router>
  );
}

export default App;
