import React, { Component } from "react";

import { connect } from "react-redux";
import { userActions } from "../../../actions";
import { withRouter } from "react-router-dom";

import { UserForm } from "../../User";

const roles = ["administrator", "supervisor"]

class EditUser extends Component {
  state = {
    user: {},
    validate: {},
    canSubmit: false
  }

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
    if (data) {
      if (data.status === "user_update_success") {
        return this.props.history.push("/users");
      }
      this.setState({
        user: data
      }, this.validate)
    }
  }

  handleChange = e => {
    const name = e.target.name
    const value = e.target.value
    this.setState({
      user: { ...this.state.user, [name]: value }
    }, this.validate)
  }

  handleRoleChange = role => {
    this.setState({
      user: { ...this.state.user, role }
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    const { match: { params: { uid } } } = this.props;
    const { canSubmit } = this.state
    canSubmit && this.props.updateUser(uid, this.state.user);
  }

  handleReset = () => {
    return this.props.history.push("/users");
  }

  validate = () => {
    const { user: { username, displayName, password, confirmPassword }, validate } = this.state;

    const usernameErrorText = !username || username.length < 3 ? "อย่างน้อย 3 ตัวอักษร" : ""
    const displayNameErrorText = !displayName || displayName.length < 3 ? "อย่างน้อย 3 ตัวอักษร" : ""
    const passwordMismatch = password && password.length >= 6 && password !== confirmPassword
    const passwordErrorText = password && password.length < 6 ? "รหัสผ่านอย่างน้อย 6 ตัวอักษร" : passwordMismatch ? "รหัสผ่านไม่ตรงกัน" : ""

    this.setState({
      validate: { ...validate, usernameErrorText, displayNameErrorText, passwordErrorText, passwordMismatch },
      canSubmit: !usernameErrorText && !displayNameErrorText && !passwordErrorText
    })
  }

  render() {
    const { canSubmit, user, validate } = this.state

    return (
      <UserForm
        roles={roles}
        user={user}
        validate={validate}
        canSubmit={canSubmit}
        onSubmit={this.handleSubmit}
        onReset={this.handleReset}
        onChange={this.handleChange}
        onRoleChange={this.handleRoleChange}
      />
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
