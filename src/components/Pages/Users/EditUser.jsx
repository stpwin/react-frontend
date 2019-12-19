import React, { Component, Fragment } from "react";

import { connect } from "react-redux";
import { userActions } from "../../../actions";
import { withRouter } from "react-router-dom";

import { UserForm } from "../../User";

class EditUser extends Component {
  constructor(props) {
    super(props);
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
    if (data && data.status === "edit_success") {
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
