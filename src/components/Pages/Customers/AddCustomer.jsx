import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { customerActions } from "../../../actions";
import { withRouter } from "react-router-dom";
import { getPostcodeFromDistrictNo } from "../../../helpers";
import { Form, Modal, Button, Row, Col } from "react-bootstrap";

import { ModalConfirm } from "../../Modals";
import CustomerDataForm from "../../Customer/CustomerDataForm";
import CustomerVerifyForm from "../../Customer/CustomerVerifyForm";
import FormButton from "../../Customer/FormButton";

import { FaCheck, FaQuestionCircle } from "react-icons/fa";

class AddCustomer extends Component {
  state = {
    appearDate: new Date(),
    peaIdInvalid: true,
    canSubmit: false,
    peaWarnText: "",
    confirmModal: false,
    customer: {
      peaId: this.props.peaId || "02",
      appearDate: null,
      title: "",
      firstName: "",
      lastName: "",
      authorize: "ทหาร",
      soldierNo: "",
      war: "ภายในประเทศ",
      houseNo: "",
      mooNo: "",
      districtNo: "520101",
      postcode: "52000",
      tel: "",
      description: ""
    },
    successModal: false,
    verifySection: true,
    customerExists: false
  };

  sigPad = null;

  componentDidMount() {
    this.validatePeaId();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      customers: { status, exists } //checking
    } = nextProps;

    if (typeof exists !== "undefined") {
      if (exists) {
        return this.setState({
          customerExists: true,
          peaIdInvalid: true,
          canSubmit: false
        });
      }
      // return this.setState({
      //   customerExists: exists
      // });
    }

    if (status === "create_success") {
      console.log("Created...");
      if (!this.state.verifySection) {
        console.log("Skip verify.");
        return this.setState({
          successModal: true
        });
      }

      console.log("Verifying...");
      return this.handleVerifyCustomer();
    } else if (status === "verify_success") {
      return this.setState({
        successModal: true
      });
    }
  }

  setSigpadRef = ref => (this.sigPad = ref);

  handleCancel = () => {
    this.setState({
      confirmModal: true
    });
  };

  handleConfirmModalClose = () => {
    this.setState({
      confirmModal: false
    });
  };

  handleCreateCustomer = event => {
    console.log("Creating...");
    event.preventDefault();
    const { customer, canSubmit } = this.state;
    canSubmit && this.props.createCustomer(customer);
  };

  handleVerifyCustomer = () => {
    const {
      customer: { peaId },
      appearDate
    } = this.state;
    const signature =
      (!this.sigPad.isEmpty() &&
        this.sigPad.getTrimmedCanvas().toDataURL("image/png")) ||
      null;
    this.props.verifyCustomer(peaId, { appearDate, signature });
  };

  handleAppearDateChange = date => {
    this.setState({
      appearDate: date
    });
  };

  handleDataChange = e => {
    const { name, value } = e.target;
    if (name === "districtNo") {
      this.setState({
        customer: {
          ...this.state.customer,
          districtNo: value,
          postcode: getPostcodeFromDistrictNo(value)
        }
      });
    } else if (name === "peaId") {
      this.setState(
        {
          customer: {
            ...this.state.customer,
            peaId: value
          }
        },
        this.validatePeaId
      );
    } else {
      this.setState({
        customer: {
          ...this.state.customer,
          [name]: value
        }
      });
    }
  };

  validatePeaId = () => {
    this.setState(
      {
        peaIdInvalid: this.state.customer.peaId.length < 12,
        customerExists: false,
        canSubmit: this.state.customer.peaId.length === 12
      },
      () => this.state.canSubmit && this.checkExists(this.state.customer.peaId)
    );
  };

  handleHideSuccessModal = () => {
    this.setState({ successModal: false });
  };

  handleGotoPrint = () => {
    const {
      history,
      location: { state }
    } = this.props;
    history.replace(`/customers/print/${this.state.customer.peaId}`, {
      from: state && state.from,
      filter: state && state.filter
    });
  };

  handleGoBack = () => {
    const { history } = this.props;
    const {
      location: { state }
    } = history;
    if (state && state.from) {
      return history.replace(state.from, {
        from: state.from,
        filter: state.filter
      });
    }
    history.replace("/customers");
  };

  handleVerifySectionChange = e => {
    console.log(e);
    this.setState({
      verifySection: e.target.checked
    });
  };

  checkExists = peaId => {
    this.props.checkExists(peaId);
  };

  gotoViewCustomer = () => {
    const {
      history,
      location: { state }
    } = this.props;
    history.replace(`/customers/view/${this.state.customer.peaId}`, {
      from: state && state.from,
      filter: state && state.filter
    });
  };

  gotoVerifyCustomer = () => {
    const {
      history,
      location: { state }
    } = this.props;
    history.replace(`/customers/verify/${this.state.customer.peaId}`, {
      from: state && state.from,
      filter: state && state.filter
    });
  };

  handleModalExistsClose = () => {
    this.setState({
      customerExists: false
    });
  };

  render() {
    const {
      successModal,
      statusModal,
      confirmModal,
      customer,
      peaIdInvalid,
      verifySection,
      customerExists
    } = this.state;
    return (
      <Fragment>
        <Form onSubmit={this.handleCreateCustomer}>
          <CustomerDataForm
            peaIdInvalid={peaIdInvalid}
            customer={customer}
            showPlaceholder={true}
            onChange={this.handleDataChange}
          />
          <hr />
          <Row>
            <Col className="text-center mb-3">
              <Form.Check
                custom
                inline
                label="แสดงตน"
                checked={verifySection}
                onChange={this.handleVerifySectionChange}
                id="showVerifySection"
              />
            </Col>
          </Row>

          {verifySection ? (
            <CustomerVerifyForm
              setSigpadRef={this.setSigpadRef}
              onAppearDateChange={this.handleAppearDateChange}
            />
          ) : null}

          <FormButton loading={statusModal} cancel={this.handleCancel} />
        </Form>

        <Modal
          show={successModal}
          // onHide={this.handleHideSuccessModal}
          backdrop="static"
          centered={true}
          aria-labelledby="contained-modal-title-vcenter"
        >
          <Modal.Header>
            <Modal.Title>บันทึกข้อมูลเสร็จสิ้น</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="text-center">
              <FaCheck className="pea-color" size={48} />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="outline-secondary"
              className="pea-color"
              onClick={this.handleGotoPrint}
            >
              พิมพ์
            </Button>
            <Button variant="outline-secondary" onClick={this.handleGoBack}>
              กลับ
            </Button>
          </Modal.Footer>
        </Modal>

        <ModalConfirm
          show={confirmModal}
          status="datachanged"
          confirm={this.handleGoBack}
          close={this.handleConfirmModalClose}
        />

        <Modal
          show={customerExists}
          onHide={this.handleModalExistsClose}
          aria-labelledby="contained-modal-title-vcenter"
          centered
          backdrop="static"
        >
          <Modal.Header>
            <FaQuestionCircle className="pea-color" size={32} />
          </Modal.Header>

          <Modal.Body className="text-center">
            รหัสผู้ใช้ไฟ <b>{customer.peaId}</b> มีอยู่แล้วในระบบ
          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="outline-secondary"
              className="pea-color"
              onClick={this.gotoVerifyCustomer}
            >
              แสดงตน
            </Button>
            <Button variant="outline-secondary" onClick={this.gotoViewCustomer}>
              แสดงข้อมูล
            </Button>
            <Button
              variant="outline-secondary"
              onClick={this.handleModalExistsClose}
            >
              ปิด
            </Button>
          </Modal.Footer>
        </Modal>
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  const { customers } = state;
  return {
    customers
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createCustomer: customer => dispatch(customerActions.create(customer)),
    verifyCustomer: (peaId, verify) =>
      dispatch(customerActions.verify(peaId, verify)),
    checkExists: peaId => dispatch(customerActions.checkExists(peaId))
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AddCustomer)
);
