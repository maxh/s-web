import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';


const requireAuth = (Component) => {
  class AuthenticatedComponent extends React.Component {

    componentWillMount() {
      this.redirectIfNoAuth(this.props);
    }

    componentWillReceiveProps(nextProps) {
      this.redirectIfNoAuth(nextProps);
    }

    redirectIfNoAuth(props) {
      if (props.isAuthLoading || props.hasValidAuth) {
        return;
      }
      const nextPath = this.props.location.pathname;
      this.props.push(`/sign-in?next=${nextPath}`);
    }

    render() {
      let inner = null;
      if (this.props.hasValidAuth) {
        inner = <Component />;
      } else if (this.props.isAuthLoading) {
        inner = 'Loading...';
      }
      return <div>{inner}</div>;
    }
  }

  AuthenticatedComponent.propTypes = {
    location: React.PropTypes.object.isRequired,
    isAuthLoading: React.PropTypes.bool.isRequired,
    hasValidAuth: React.PropTypes.bool.isRequired,
    push: React.PropTypes.func.isRequired,
  };

  const mapStateToProps = state => ({
    isAuthLoading: state.auth.isLoading,
    hasValidAuth: Boolean(state.auth.jwt),
  });

  const mapDispatchToProps = dispatch => ({
    push: path => dispatch(push(path)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(AuthenticatedComponent);
};


export default requireAuth;
