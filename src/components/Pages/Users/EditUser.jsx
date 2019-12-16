import React, { Component, Fragment } from "react";

import { connect } from "react-redux";
import { userActions } from "../../../actions";
import { withRouter } from "react-router-dom";

import { UserForm } from "../../User";

class EditUser extends Component {
  UNSAFE_componentWillMount() {
    const {
      match: {
        params: { uid }
      }
    } = this.props;
    this.props.getUser(uid);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      users: { data }
    } = nextProps;
    console.log(data);
    if (data && data.status === "success") {
      this.props.history.goBack();
    }
  }

  handleUpdateUser = user => {
    const {
      match: {
        params: { uid }
      }
    } = this.props;
    this.props.updateUser(uid, user);
  };

  render() {
    const {
      users: { data: user }
    } = this.props;

    return (
      <Fragment>
        {user ? (
          <UserForm
            {...this.props}
            user={user}
            skipEmptyPasswordValidation={true}
            handleSubmit={this.handleUpdateUser}
          />
        ) : null}
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
    getUser: uid => dispatch(userActions.get(uid)),
    updateUser: (uid, user) => dispatch(userActions.update(uid, user))
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(EditUser)
);
