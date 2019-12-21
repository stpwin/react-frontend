import React, { Component } from "react";
import { connect } from "react-redux";
import { customerActions } from "../../../actions";
import { withRouter } from "react-router-dom";
import { getPostcodeFromDistrictNo } from "../../../helpers";
import { Form } from "react-bootstrap";

import { ModalConfirm } from "../../Modals";
import CustomerDataForm from "../../Customer/CustomerDataForm";
import CustomerVerifyForm from "../../Customer/CustomerVerifyForm";
import FormButton from "../../Customer/FormButton";

class AddCustomer extends Component {
  state = {
    appearDate: new Date(),
    peaIdOk: true,
    peaWarnText: "",
    confirmModal: false,
    customer: {
      peaId: this.props.peaId,
      appearDate: null,
      title: "",
      firstName: "",
      lastName: "",
      authorize: "ทหาร",
      soldierNo: "",
      war: "",
      houseNo: "",
      mooNo: "",
      districtNo: "",
      postcode: "52000"
    }

  };

  sigPad = null;

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      customers: { status }
    } = nextProps;

    if (status === "create_success") {
      this.handleVerifyCustomer();
    } else if (status === "verify_success") {
      this.handleSuccess()
    }
  }

  setSigpadRef = ref => this.sigPad = ref

  handleSuccess = () => this.props.history.goBack()

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
    this.props.createCustomer(this.state.customer);
  };

  handleVerifyCustomer = () => {
    const { customer: { peaId }, appearDate } = this.state;
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
    const { name, value } = e.target
    if (name === "districtNo") {
      this.setState({
        customer: {
          ...this.state.customer, districtNo: value,
          postcode: getPostcodeFromDistrictNo(value)
        }
      })
    } else {
      this.setState({
        customer: {
          ...this.state.customer,
          [name]: value
        }
      });
    }
  }

  render() {
    const { statusModal, confirmModal, customer } = this.state;
    return (
      <React.Fragment>
        <Form onSubmit={this.handleCreateCustomer}>
          <CustomerDataForm
            customer={customer}
            showPlaceholder={true}
            onChange={this.handleDataChange}
          />
          <hr />
          <CustomerVerifyForm
            setSigpadRef={this.setSigpadRef}
            onAppearDateChange={this.handleAppearDateChange}
          />
          <FormButton loading={statusModal} cancel={this.handleCancel} />
        </Form>

        <ModalConfirm
          show={confirmModal}
          status="datachanged"
          confirm={this.handleSuccess}
          close={this.handleConfirmModalClose}
        />
      </React.Fragment>
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
