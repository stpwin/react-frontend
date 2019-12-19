import React, { Component, Fragment } from "react";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { userActions } from "../../../actions";

import { UserForm } from "../../User";
// import { ModalStatus } from "../../Modals";

class CreateUser extends Component {
  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      users: { data }
    } = nextProps;
    if (data && data.status === "create_success") {
      this.props.history.goBack();
    }
  }

  handleCreateUser = user => {
    this.props.createUser(user);
  };

  render() {
    return (
      <Fragment>
        <UserForm {...this.props} handleSubmit={this.handleCreateUser} />
      </Fragment>
    );
  }
}
const mapStateToProps = state => {
  const { users } = state;
  return {
    users
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createUser: user => dispatch(userActions.create(user))
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CreateUser)
);
