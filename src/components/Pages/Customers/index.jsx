import React, { Component, Fragment } from "react";

import { withRouter } from "react-router-dom";

import { Container } from "react-bootstrap";

import ListCustomer from "./ListCustomer";
import AddCustomer from "./AddCustomer";
import VerifyCustomer from "./VerifyCustomer";
import EditCustomer from "./EditCustomer";
import PrintCustomer from "./PrintCustomer";

class Customers extends Component {
  render() {
    const {
      match: {
        params: { method, peaId }
      }
    } = this.props;

    // const { method, peaId } = this.props.params;
    return (
      <Container>
        {method === "add" ? (
          <Fragment>
            <h1 className="header-text text-center">เพิ่มลูกค้า</h1>
            <AddCustomer peaId={peaId} />
          </Fragment>
        ) : method === "edit" ? (
          peaId ? (
            <Fragment>
              <h1 className="header-text text-center">แก้ไขข้อมูลลูกค้า</h1>
              <EditCustomer peaId={peaId} />
            </Fragment>
          ) : (
            <NoPeaID />
          )
        ) : method === "verify" ? (
          peaId ? (
            <Fragment>
              <h1 className="header-text text-center">ยืนยันสิทธิ์</h1>
              <VerifyCustomer peaId={peaId} />
            </Fragment>
          ) : (
            <NoPeaID />
          )
        ) : method === "print" ? (
          <Fragment>
            <h1 className="header-text text-center">พิมพ์ข้อมูลลูกค้า</h1>
            <PrintCustomer peaId={peaId} history={this.props.history} />
          </Fragment>
        ) : (
          <Fragment>
            <h1 className="header-text text-center">จัดการข้อมูลลูกค้า</h1>
            <ListCustomer />
          </Fragment>
        )}
      </Container>
    );
  }
}

const NoPeaID = () => {
  return <h3 className="text-center">กรุณาระบุ peaId</h3>;
};

export default withRouter(Customers);
