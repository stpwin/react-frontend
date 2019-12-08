import React, { Component, Fragment } from "react";

import { withRouter } from "react-router-dom";
import {
  authHeader,
  handleFetchError,
  handleFetchSuccessResponse
} from "../../../helpers";
import config from "../../../config";

import { UserForm } from "../../User";

import { ModalStatus } from "../../Modals";

class EditUser extends Component {
  state = {
    statusShow: false,
    status: "",
    failtext: "",
    user: null,
    uid: ""
  };

  UNSAFE_componentWillMount() {
    this.setState({
      statusShow: true,
      status: "getting"
    });

    const {
      match: {
        params: { uid }
      }
    } = this.props;

    if (!uid) {
      this.setState({
        status: "nodata"
      });
      return;
    }
    this.setState(
      {
        uid: uid
      },
      () => {
        this.fetchUser();
      }
    );
  }

  fetchUser = () => {
    const { uid } = this.state;
    const reqConf = {
      method: "GET",
      headers: authHeader()
    };

    fetch(`${config.apiUrl}/api/users/uid/${uid}`, reqConf)
      .then(handleFetchError)
      .then(({ err, rep }) => {
        if (err) {
          console.log(err);
          this.setState({
            status: "getfail",
            failtext: err
          });
          return;
        }

        // console.log(rep);
        this.setState({
          user: rep,
          statusShow: false
        });
      })
      .catch(() => {
        this.setState({
          status: "getfail",
          failtext: "server error"
        });
        // console.log("server error");
      });
  };

  updateUser = ({ username, displayName, description, role, password }) => {
    const { uid } = this.state;
    const reqConf = {
      method: "PUT",
      headers: authHeader(),
      body: JSON.stringify({
        payload: {
          uid
        },
        user: {
          username,
          displayName,
          description,
          role,
          password
        }
      })
    };

    this.setState({
      statusShow: true,
      status: "saving"
    });

    fetch(`${config.apiUrl}/api/users`, reqConf)
      .then(handleFetchSuccessResponse)
      .then(({ err, rep }) => {
        if (err) {
          this.setState({
            status: "savefail",
            failtext: err
          });
          return;
        }

        this.setState({
          status: "saved",
          failtext: ""
        });
        setTimeout(() => {
          this.props.history.goBack();
        }, config.statusShowTime);
      })
      .catch(() => {
        this.setState({
          status: "savefail",
          failtext: "ไม่สามารถติดต่อเซิร์ฟเวอร์ได้"
        });
      });
  };

  handleStatusModalClose = () => {
    this.setState({
      statusShow: false
    });
  };

  render() {
    const { statusShow, failtext, status, user } = this.state;
    return (
      <Fragment>
        {user ? (
          <UserForm
            {...this.props}
            user={user}
            skipEmptyPasswordValidation={true}
            handleSubmit={this.updateUser}
          />
        ) : null}

        <ModalStatus
          show={statusShow}
          onHide={this.handleStatusModalClose}
          failtext={failtext}
          status={status}
        />
      </Fragment>
    );
  }
}

export default withRouter(EditUser);
