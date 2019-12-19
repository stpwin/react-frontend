import React, { Component, Fragment } from "react";

import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Container } from "react-bootstrap";

import { ModalStatus } from "../../Modals";

import ListCustomer from "./ListCustomer";
import AddCustomer from "./AddCustomer";
import VerifyCustomer from "./VerifyCustomer";
import EditCustomer from "./EditCustomer";
import PrintCustomer from "./PrintCustomer";
import ViewCustomer from "./ViewCustomer";

class Customers extends Component {
  state = {
    statusOpen: true,
    failText: ""
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

  handleStatusHide = () => {
    this.setState({
      statusOpen: false
    });
  };
  render() {
    const { statusOpen } = this.state;
    const {
      match: {
        params: { method, peaId }
      },
      loading,
      error
    } = this.props;
    return (
      <Container>
        {method === "add" ? (
          <Fragment>
            <h1 className="header-text text-center">เพิ่มลูกค้า</h1>
            <AddCustomer peaId={peaId} />
          </Fragment>
        ) : method === "view" ? (
          peaId ? (
            <Fragment>
              <h1 className="header-text text-center">แสดงข้อมูลลูกค้า</h1>
              <ViewCustomer peaId={peaId} history={this.props.history} />
            </Fragment>
          ) : (
              <NoPeaID />
            )
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
          peaId ? (
            <Fragment>
              <h1 className="header-text text-center">พิมพ์ข้อมูลลูกค้า</h1>
              <PrintCustomer peaId={peaId} history={this.props.history} />
            </Fragment>
          ) : (
              <NoPeaID />
            )
        ) :
                  <Fragment>
                    <h1 className="header-text text-center">จัดการข้อมูลลูกค้า</h1>
                    <ListCustomer />
                  </Fragment>
        }
        <ModalStatus
          show={statusOpen}
          status={loading ? "loading" : error ? "error" : null}
          failText={error}
          onHide={this.handleStatusHide}
        />
      </Container>
    );
  }
}

const NoPeaID = () => {
  return <h3 className="text-center mt-5">กรุณาระบุหมายเลขผู้ใช้ไฟฟ้า(CA)</h3>;
};

const mapStateToProps = state => {
  const {
    customers: { loading, error }
  } = state;
  return {
    loading,
    error
  };
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Customers)
);
