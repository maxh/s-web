import React from 'react';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';

import { startSignIn } from '../actions/auth';

const SignIn = props => (
  <Button onClick={props.startSignIn}>Sign in with Google</Button>
);

SignIn.propTypes = {
  startSignIn: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({});

const mapDispatchToProps = {
  startSignIn,
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
