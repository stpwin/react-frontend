import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";

// import { userActions } from "../../../actions";
// import config from "../../../config";

// import moment from "moment";

// import { FaTimes, FaEdit } from "react-icons/fa";

import { Container } from "react-bootstrap";
import NotFound from "../NotFound";
import CreateUser from "./CreateUser";
import EditUser from "./EditUser";
import ListUsers from "./ListUsers";

class Users extends Component {
  render() {
    const {
      match: { params }
    } = this.props;

    console.log(params.method);
    return (
      <Container>
        {!params.method ? (
          <Fragment>
            <h1 className="header-text text-center">จัดการผู้ใช้งาน</h1>
            <ListUsers />
          </Fragment>
        ) : params.method === "create" ? (
          <Fragment>
            <h1 className="header-text text-center">สร้างผู้ใช้งาน</h1>
            <CreateUser />
          </Fragment>
        ) : params.method === "edit" ? (
          <Fragment>
            <h1 className="header-text text-center">แก้ไขผู้ใช้งาน</h1>
            <EditUser />
          </Fragment>
        ) : (
          <NotFound />
        )}
      </Container>
    );
  }
}

export default withRouter(Users);
