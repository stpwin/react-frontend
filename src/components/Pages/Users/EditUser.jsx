import React, { Component } from "react";

import { withRouter } from "react-router-dom";

import { UserForm } from "../../User";

class EditUser extends Component {
  render() {
    return <UserForm {...this.props} />;
  }
}

export default withRouter(EditUser);
