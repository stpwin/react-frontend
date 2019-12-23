import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { databaseActions } from "../../../actions";

import { Container } from "react-bootstrap";

import Notfound from "../NotFound";
import Database from "./Database";
import { ModalConfirm } from "../../Modals";

class Settings extends Component {
  state = {
    confirmModal: false,
    confirmText: "",
    confirmMode: "",
    database: { name: "", sequence: 0 }
  };

  UNSAFE_componentWillReceiveProps(nextProps) {}

  handleSetCounter = (name, sequence) => {
    console.log("Handle set counter:", { name, sequence });
    this.setState({
      confirmModal: true,
      confirmText: `ยืนยันเริ่มต้นการนับใหม่ ของ ${name}`,
      confirmMode: "set",
      database: { name, sequence }
    });
  };

  handleResetCounter = name => {
    console.log("Handle reset counter:", name);
    this.setState({
      confirmModal: true,
      confirmText: `ยืนยันเริ่มต้นการนับใหม่ ของ ${name}`,
      confirmMode: "reset",
      database: { name, sequence: 0 }
    });
  };

  handleConfirmHide = () => {
    this.setState({
      confirmModal: false
    });
  };

  handleConfirmOk = () => {
    const {
      confirmMode,
      database: { name, sequence }
    } = this.state;
    if (confirmMode === "set") {
      console.log("Set counter:", { name, sequence });
      // this.props.setDatabaseCounter(name, sequence);
    } else if (confirmMode === "reset") {
      console.log("Reset counter:", { name, sequence });
      // this.props.resetDatabaseCounter(name);
    }
    this.handleConfirmHide();
  };

  render() {
    const { confirmModal, confirmText } = this.state;
    const {
      match: {
        params: { method }
      }
      // database: { data }
    } = this.props;
    const data = [
      { _id: "customer_g1", sequence: 1 },
      { _id: "customer_g2", sequence: 5 }
    ];
    return (
      <Container>
        {method === "database" ? (
          <Fragment>
            <h1 className="header-text text-center">จัดการฐานข้อมูล</h1>
            <Database
              data={data}
              onSetCounter={this.handleSetCounter}
              onResetCounter={this.handleResetCounter}
            />
          </Fragment>
        ) : (
          <Notfound />
        )}
        <ModalConfirm
          show={confirmModal}
          status="risk"
          onHide={this.handleConfirmHide}
          confirm={this.handleConfirmOk}
          confirmtext={confirmText}
        />
      </Container>
    );
  }
}

const mapStateToProps = state => {
  const { database } = state;
  // console.log(database);
  return {
    database
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setDatabaseCounter: (name, sequence) =>
      dispatch(databaseActions.set(name, sequence)),
    resetDatabaseCounter: name => dispatch(databaseActions.reset(name))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
