import React, { Component } from 'react';
import {
  Checkbox,
  FormGroup,
  HelpBlock,
  ControlLabel,
  Button
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { loadPermissions, setPermission } from '../actions/permissions'


import settings from '../settings';


class GoogleDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedScopes: new Set()
    };
    this.initialScopes = new Set(props.granted.scopes);
  }

  componentWillMount() {
    this.setState({ selectedScopes: new Set(this.props.granted.scopes) });
  }

  toggleScope(scope) {
    const selectedScopes = new Set(this.state.selectedScopes);
    if (selectedScopes.has(scope)) {
      selectedScopes.delete(scope);
    } else {
      selectedScopes.add(scope);
    }
    this.setState({ selectedScopes:  selectedScopes });
  }

  render() {
    return (
      <FormGroup controlId="google">
        <ControlLabel>Google</ControlLabel>
        <HelpBlock>Specify the scopes to enable:</HelpBlock>
          { this.renderScopes(this.props.possible, this.props.granted) }
        <Button onClick={ this.setPermission.bind(this) }>Apply</Button>
      </FormGroup>
    );
  }

  setPermission() {
    const scopes = [];
    for (const scope of this.state.selectedScopes) {
      scopes.push(scope);
    }
    this.props.setPermission('google', { scopes });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ selectedScopes: new Set(nextProps.granted.scopes) });
  }

  renderScopes(possible, granted) {
    return possible.scopes.map(scope => {
      return (
        <Checkbox
          key={'checkbox' + scope}
          checked={this.state.selectedScopes.has(scope)}
          disabled={this.initialScopes.has(scope)}
          onChange={this.toggleScope.bind(this, scope)}>
          {scope}
        </Checkbox>
      );
    });
  }
}

class DropboxDetail extends Component {

  constructor(props) {
    super(props);
    this.state = { enabled: Boolean(props.granted) };
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
            onChange={this.toggleEnabled.bind(this)}>
          Scout has access
        </Checkbox>
        <Button onClick={ this.setPermission.bind(this) }>Apply</Button>
      </FormGroup>
    );
  }

  setPermission() {
    this.props.setPermission('dropbox', {});
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ enabled: Boolean(nextProps.granted) });
  }
}

const componentsByProvider = {
  google: GoogleDetail,
  dropbox: DropboxDetail,
};


class Permissions extends Component {
  render() {
    let inner;
    if (this.props.permissions.isLoading) {
      inner = 'Loading...';
    } else if (this.props.permissions.current) {
      const permissions = this.props.permissions.current;
      const possibleProviders = Object.keys(permissions.possible);
      inner = possibleProviders.map(provider => {
        const component = componentsByProvider[provider];
        return React.createElement(component, {
          key: provider + Date.now(),
          possible: permissions.possible[provider],
          granted: permissions.granted[provider],
          setPermission: this.props.setPermission,
        });
      })
    } else {
      inner = 'Error.';
    }
    return (
      <div>
        <h2>Permissions</h2>
        { inner }
      </div>
    );
  }

  componentDidMount() {
    this.props.loadPermissions();
  }

}

const mapStateToProps = state => ({
  permissions: state.permissions
});

const mapDispatchToProps = {
  loadPermissions,
  setPermission
};

export default connect(mapStateToProps, mapDispatchToProps)(Permissions);
