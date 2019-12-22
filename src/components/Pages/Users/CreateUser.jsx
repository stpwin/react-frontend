import React, { Component } from "react";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { userActions } from "../../../actions";

import { UserForm } from "../../User";

const roles = ["administrator", "supervisor"]

class CreateUser extends Component {
  state = {
    user: { role: "supervisor" },
    validate: {},
    canSubmit: false
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      users: { data }
    } = nextProps;
    if (data && data.status === "user_create_success") {
      return this.props.history.push("/users");
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
    const { canSubmit } = this.state
    canSubmit && this.props.createUser(this.state.user);

  }

  handleReset = () => {
    return this.props.history.push("/users");
  }

  validate = () => {
    const { user: { username, displayName, password, confirmPassword }, validate } = this.state;

    const usernameErrorText = !username || username.length < 3 ? "อย่างน้อย 3 ตัวอักษร" : ""
    const displayNameErrorText = !displayName || displayName.length < 3 ? "อย่างน้อย 3 ตัวอักษร" : ""
    const passwordMismatch = password && password.length >= 6 && password !== confirmPassword
    const passwordErrorText = !password || password.length < 6 ? "รหัสผ่านอย่างน้อย 6 ตัวอักษร" : passwordMismatch ? "รหัสผ่านไม่ตรงกัน" : ""

    this.setState({
      validate: { ...validate, usernameErrorText, displayNameErrorText, passwordErrorText, passwordMismatch },
      canSubmit: !usernameErrorText && !displayNameErrorText && !passwordErrorText
    })
  }

  render() {
    const { user, validate, canSubmit } = this.state
    return (
      <UserForm roles={roles} user={user} validate={validate} onSubmit={this.handleSubmit} onReset={this.handleReset} onChange={this.handleChange} onRoleChange={this.handleRoleChange} canSubmit={canSubmit} />
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
