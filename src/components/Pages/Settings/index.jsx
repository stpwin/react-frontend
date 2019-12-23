import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
// import { databaseActions } from "../../../actions";

import { Container } from "react-bootstrap";

import Notfound from "../NotFound";
import Database from "./Database";
import { ModalStatus } from "../../Modals";

class Settings extends Component {
  state = {
    statusModal: false,
    failText: "",
    statusModalVariant: ""
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { loading, error } = nextProps
    this.setState({
      statusModal: (loading || error) ? true : false,
      failText: `${error}`,
      statusModalVariant: loading ? "loading" : error ? "error" : ""
    })
  }

  handleStatusHide = () => {
    this.setState({
      statusModal: false
    })
  }

  render() {
    const { statusModal, failText, statusModalVariant } = this.state;
    const {
      match: {
        params: { method }
      }
    } = this.props;

    return (
      <Container>
        {method === "database" ? (
          <Fragment>
            <h1 className="header-text text-center">จัดการฐานข้อมูล</h1>
            <Database
              onSetCounter={this.handleSetCounter}
              onResetCounter={this.handleResetCounter}
            />
          </Fragment>
        ) : (
            <Notfound />
          )}
        <ModalStatus
          show={statusModal}
          onHide={this.handleStatusHide}
          failText={failText}
          status={statusModalVariant}
        />

      </Container>
    );
  }
}

const mapStateToProps = state => {
  const { database: { loading, error } } = state;
  return {
    loading,
    error
  };
};

export default connect(mapStateToProps)(Settings);
