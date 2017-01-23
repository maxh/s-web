import React, { Component } from 'react';
import {
  Checkbox,
  FormGroup,
  HelpBlock,
  ControlLabel,
  Button,
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { loadPermissions, setPermission } from '../actions/permissions';


class GoogleDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedScopes: new Set(),
    };
    this.initialScopes = new Set(props.granted.scopes);
    this.setPermission = this.setPermission.bind(this);
  }

  componentWillMount() {
    this.setState({ selectedScopes: new Set(this.props.granted.scopes) });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ selectedScopes: new Set(nextProps.granted.scopes) });
  }

  setPermission() {
    const scopes = Array.from(this.state.selectedScopes);
    this.props.setPermission('google', { scopes });
  }

  toggleScope(scope) {
    const selectedScopes = new Set(this.state.selectedScopes);
    if (selectedScopes.has(scope)) {
      selectedScopes.delete(scope);
    } else {
      selectedScopes.add(scope);
    }
    this.setState({ selectedScopes });
  }

  renderScopes(possible) {
    return possible.scopes.map((scope) => {
      const toggleScope = this.toggleScope.bind(this, scope);
      return (
        <Checkbox
          key={`checkbox-${scope}`}
          checked={this.state.selectedScopes.has(scope)}
          disabled={this.initialScopes.has(scope)}
          onChange={toggleScope}
        >
          {scope}
        </Checkbox>
      );
    });
  }

  render() {
    return (
      <FormGroup controlId="google">
        <ControlLabel>Google</ControlLabel>
        <HelpBlock>Specify the scopes to enable:</HelpBlock>
        {this.renderScopes(this.props.possible)}
        <Button onClick={this.setPermission}>Apply</Button>
      </FormGroup>
    );
  }
}

GoogleDetail.propTypes = {
  granted: React.PropTypes.object.isRequired,
  possible: React.PropTypes.object.isRequired,
  setPermission: React.PropTypes.func.isRequired,
};


// eslint-disable-next-line react/no-multi-comp
class DropboxDetail extends Component {

  constructor(props) {
    super(props);
    this.state = { enabled: Boolean(props.granted) };
    this.setPermission = this.setPermission.bind(this);
    this.toggleEnabled = this.toggleEnabled.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ enabled: Boolean(nextProps.granted) });
  }

  setPermission() {
    this.props.setPermission('dropbox', {});
  }

  toggleEnabled() {
    this.setState({ enabled: !this.state.enabled });
  }

  render() {
    return (
      <FormGroup controlId="google">
        <ControlLabel>Dropbox</ControlLabel>
        <Checkbox
          checked={this.enabled}
          disabled={this.enabled}
          onChange={this.toggleEnabled}
        >
          Scout has access
        </Checkbox>
        <Button onClick={this.setPermission}>Apply</Button>
      </FormGroup>
    );
  }
}

DropboxDetail.propTypes = {
  granted: React.PropTypes.object,
  setPermission: React.PropTypes.func.isRequired,
};

DropboxDetail.defaultProps = {
  granted: undefined,
};


const componentsByProvider = {
  google: GoogleDetail,
  dropbox: DropboxDetail,
};


// eslint-disable-next-line react/no-multi-comp
class Permissions extends Component {
  componentDidMount() {
    this.props.loadPermissions();
  }

  render() {
    let inner;
    if (this.props.isLoading) {
      inner = 'Loading...';
    } else if (this.props.permissions && this.props.permissions.possible) {
      const permissions = this.props.permissions;
      const possibleProviders = Object.keys(permissions.possible);
      inner = possibleProviders.map((provider) => {
        const component = componentsByProvider[provider];
        return React.createElement(component, {
          key: provider + Date.now(),
          possible: permissions.possible[provider],
          granted: permissions.granted[provider],
          setPermission: this.props.setPermission,
        });
      });
    } else {
      inner = this.props.error || 'Error.';
    }
    return (
      <div>
        <h2>Permissions</h2>
        { inner }
      </div>
    );
  }
}

Permissions.propTypes = {
  isLoading: React.PropTypes.bool.isRequired,
  error: React.PropTypes.string,
  permissions: React.PropTypes.object,
  loadPermissions: React.PropTypes.func.isRequired,
};

Permissions.defaultProps = {
  error: undefined,
  permissions: undefined,
};


const mapStateToProps = state => ({
  isLoading: state.permissions.isLoading,
  error: state.permissions.error,
  permissions: state.permissions.current,
});

const mapDispatchToProps = {
  loadPermissions,
  setPermission,
};

export default connect(mapStateToProps, mapDispatchToProps)(Permissions);
