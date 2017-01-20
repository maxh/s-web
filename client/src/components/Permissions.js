import React, { Component } from 'react';
import {
  Checkbox,
  FormGroup,
  HelpBlock,
  ControlLabel,
  Button
} from 'react-bootstrap';
import { connect } from 'react-redux';
import { loadPermissions } from '../actions/permissions'


const renderPermissions = (permissions) => {
  const { granted, possible } = permissions;

  return possible.map(permission => {
    const { scopes, provider } = permission;
    const grantedPermission = granted.find(permission => permission.provider === provider);
    let inner;
    if (scopes) {
      const scopesJsx = scopes.map(scope => {
        const isGranted = grantedPermission && grantedPermission.scopes.indexOf(scope) !== -1;
        return (
          <Checkbox key={'checkbox' + provider + scope} checked={isGranted || undefined} disabled={isGranted} >
            {scope}
          </Checkbox>
        );
      });
      inner = [<HelpBlock key={'help' + provider}>Specify the scopes to enable:</HelpBlock>];
      inner = inner.concat(scopesJsx);
    } else {
      inner = <Checkbox checked={grantedPermission}>Scout has access</Checkbox>;
    }
    return (
      <FormGroup controlId={permission.provider} key={'group' + provider}>
        <ControlLabel>{permission.provider}</ControlLabel>
        {inner}
        <Button>Apply</Button>
      </FormGroup>
    );
  });
};

const settings = {
  serviceUrl: 'http://localhost:5000'
};


class Permissions extends Component {
  render() {
    return (
      <div>
        <h2>Permissions</h2>
        { this.props.permissions.isLoading && 'Loading...' }
        { this.props.permissions.current && renderPermissions(this.props.permissions.current) }
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
  loadPermissions
};

export default connect(mapStateToProps, mapDispatchToProps)(Permissions);
