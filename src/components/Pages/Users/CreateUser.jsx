import React, { Component } from "react";

import { withRouter } from "react-router-dom";

import { UserForm } from "../../User";

class CreateUser extends Component {
  createUser = ({ username, password, description, role, displayName }) => {
    console.log(username);
    return true;
  };

  render() {
    return <UserForm {...this.props} handleSubmit={this.createUser} />;
  }
}

export default withRouter(CreateUser);
