import React from 'react';
import {connect} from 'react-redux';
import { push } from 'react-router-redux'

const requireAuth = (Component) => {

  class AuthenticatedComponent extends React.Component {

    componentWillMount() {
      this.redirectIfNoAuth(this.props)
    }

    componentWillReceiveProps(nextProps) {
      this.redirectIfNoAuth(nextProps)
    }

    render() {
      return (
        <div>
          {this.hasValidAuth(this.props)
            ? <Component />
            : null
          }
        </div>
      )
    }

    redirectIfNoAuth(props) {
      if (this.isAuthLoading(props) || this.hasValidAuth(props)) {
        return;
      }
      const nextPath = this.props.location.pathname
      this.props.dispatch(push(`/sign-in?next=${nextPath}`));
    }

    isAuthLoading(props) {
      return props.auth.isLoading;
    }

    hasValidAuth(props) {
      return props.auth.jwt;
    }
  }

  const mapStateToProps = (state) => {
    return { auth: state.auth };
  }

  return connect(mapStateToProps)(AuthenticatedComponent)
};


export default requireAuth;
