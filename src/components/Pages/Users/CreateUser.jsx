import React, { Component, Fragment } from "react";

import { withRouter } from "react-router-dom";

import config from "../../../config";
import { handleFetchSuccessResponse, authHeader } from "../../../helpers";

import { UserForm } from "../../User";
import { ModalStatus } from "../../Modals";

class CreateUser extends Component {
  state = {
    statusModal: false,
    status: "",
    failtext: ""
  };

  handleStatusHide = () => {
    this.setState({
      statusModal: false
    });
  };

  createUser = ({ username, password, description, role, displayName }) => {
    this.setState({ statusModal: true, status: "saving" });

    const reqConf = {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeader() },
      body: JSON.stringify({
        username,
        password,
        description,
        role,
        displayName
      })
    };
    fetch(`${config.apiUrl}/api/users`, reqConf)
      .then(handleFetchSuccessResponse)
      .then(({ err, result }) => {
        if (err) {
          this.setState({ status: "savefail", failtext: err });
          return;
        }

        console.log(result);

        this.setState({ status: "saved", failtext: "" });
        setTimeout(() => {
          this.props.history.goBack();
        }, config.statusShowTime);
      })
      .catch(() => {
        // console.log(err);
        this.setState({
          status: "savefail",
          failtext: "ไม่สามารถติดต่อเซิร์ฟเวอร์ได้"
        });
      });
  };

  render() {
    const { statusModal, status, failtext } = this.state;
    return (
      <Fragment>
        <UserForm {...this.props} handleSubmit={this.createUser} />
        <ModalStatus
          show={statusModal}
          status={status}
          failtext={failtext}
          onHide={this.handleStatusHide}
        />
      </Fragment>
    );
  }
}

export default withRouter(CreateUser);
