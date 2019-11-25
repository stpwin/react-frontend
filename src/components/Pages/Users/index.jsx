import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { Container } from "react-bootstrap";
import { ModalStatus } from "../../Modals";
import NotFound from "../NotFound";
import CreateUser from "./CreateUser";
import EditUser from "./EditUser";
import ListUsers from "./ListUsers";

class Users extends Component {
  state = {
    statusOpen: true
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { loading, error } = nextProps;

    this.setState({
      statusOpen: loading || error ? true : false
    });
  }

  componentDidMount() {
    const { loading, error } = this.props;

    this.setState({
      statusOpen: loading || error ? true : false
    });
  }

  handleStatusClose = () => {
    this.setState({
      statusOpen: false
    });
  };

  render() {
    const { statusOpen } = this.state;
    const {
      match: { params },
      loading,
      error
    } = this.props;
    return (
      <Container>
        {!params.method ? (
          <Fragment>
            <h1 className="header-text text-center">จัดการผู้ใช้งาน</h1>
            <ListUsers />
          </Fragment>
        ) : params.method === "create" ? (
          <Fragment>
            <h1 className="header-text text-center">เพิ่มผู้ใช้งาน</h1>
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
        <ModalStatus
          show={statusOpen}
          status={loading ? "loading" : error ? "error" : ""}
          onHide={this.handleStatusClose}
          failText={error}
        />
      </Container>
    );
  }
}

const mapStateToProps = state => {
  const {
    users: { loading, error }
  } = state;
  return {
    loading,
    error
  };
};

export default withRouter(connect(mapStateToProps)(Users));
