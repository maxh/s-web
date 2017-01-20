import React, { Component } from 'react';
import {
  Button
} from 'react-bootstrap';
import { connect } from 'react-redux';

import { startSignIn } from '../actions/auth';

class SignIn extends Component {
  render() {
    return <Button onClick={this.props.startSignIn} >Sign in with Google</Button>;
  }
}

const mapStateToProps = state => ({
});

const mapDispatchToProps = {
  startSignIn,
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
