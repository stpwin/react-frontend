import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { customerActions } from "../../../actions";
import { withRouter } from "react-router-dom";
import { getPostcodeFromDistrictNo } from "../../../helpers";
import { Form, Modal, Button, Row, Col } from "react-bootstrap";
import { FaCheck } from "react-icons/fa";

import { ModalConfirm } from "../../Modals";
import CustomerDataForm from "../../Customer/CustomerDataForm";
import CustomerVerifyForm from "../../Customer/CustomerVerifyForm";
import FormButton from "../../Customer/FormButton";

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
    verifySection: true
  };

  sigPad = null;

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      customers: { status }
    } = nextProps;

    if (status === "create_success") {
      if (!this.state.verifySection) {
        return this.setState({
          successModal: true
        });
      }
      this.handleVerifyCustomer();
    } else if (status === "verify_success") {
      this.setState({
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
      this.setState({
        peaIdInvalid: value.length < 12,
        canSubmit: value.length === 12,
        customer: {
          ...this.state.customer,
          peaId: value
        }
      });
    } else {
      this.setState({
        customer: {
          ...this.state.customer,
          [name]: value
        }
      });
    }
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
      from: state.from,
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
    history.goBack();
  };

  handleVerifySectionChange = e => {
    console.log(e);
    this.setState({
      verifySection: e.target.checked
    });
  };

  render() {
    const {
      successModal,
      statusModal,
      confirmModal,
      customer,
      peaIdInvalid,
      verifySection
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
                label="ยืนยันสิทธิ์"
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
      dispatch(customerActions.verify(peaId, verify))
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AddCustomer)
);
