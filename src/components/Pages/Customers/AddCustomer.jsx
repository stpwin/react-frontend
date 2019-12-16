import React, { Component } from "react";
import { connect } from "react-redux";
import { customerActions } from "../../../actions";
import { withRouter } from "react-router-dom";

import { Form } from "react-bootstrap";

import { ModalConfirm } from "../../Modals";
import CustomerDataForm from "../../Customer/CustomerDataForm";
import CustomerVerifyForm from "../../Customer/CustomerVerifyForm";
import FormButton from "../../Customer/FormButton";

class AddCustomer extends Component {
  state = {
    peaId: this.props.peaId,
    peaIdOk: true,
    peaWarnText: "",

    confirmModal: false,
    appearDate: new Date(),
    privilegeDate: new Date()
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      customers: { status }
    } = nextProps;

    if (status === "create_success") {
      this.handleVerifyCustomer();
    } else if (status === "verify_success") {
      this.props.history.goBack();
    }
  }

  sigPad = {};

  setSigpadRef = ref => {
    this.sigPad = ref;
  };

  handleSuccess = () => {
    this.props.history.goBack();
  };

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

    const title = event.target.title.value;
    const firstName = event.target.firstName.value;
    const lastName = event.target.lastName.value;
    const peaId = event.target.peaId.value;
    const authorize = event.target.authorize.value;
    const soldierNo = event.target.soldierNo.value;
    const war = event.target.war.value;
    const houseNo = event.target.houseNo.value;
    const mooNo = event.target.mooNo.value;
    const districtNo = event.target.districtNo.value;

    this.props.createCustomer({
      title,
      firstName,
      lastName,
      peaId,
      authorize,
      soldierNo,
      war,
      houseNo,
      mooNo,
      districtNo
    });
  };

  handleVerifyCustomer = () => {
    const { peaId } = this.state;
    const { appearDate, privilegeDate } = this.state;
    const signature = this.sigPad.getTrimmedCanvas().toDataURL("image/png");
    this.props.verifyCustomer(peaId, { appearDate, privilegeDate, signature });
  };

  handleAppearDateChange = date => {
    this.setState({
      appearDate: date
    });
  };

  handlePrivilegeDateChange = date => {
    this.setState({
      privilegeDate: date
    });
  };

  handlePeaIdChange = peaId => {
    this.setState({
      peaId
    });
  };

  render() {
    const { statusModal, confirmModal } = this.state;
    const { peaId } = this.props;
    return (
      <React.Fragment>
        <Form onSubmit={this.handleCreateCustomer}>
          <CustomerDataForm
            initial={{ peaId }}
            showPlaceholder={true}
            validatePeaId={true}
            onPeaIdChange={this.handlePeaIdChange}
          />
          <hr />
          <CustomerVerifyForm
            setSigpadRef={this.setSigpadRef}
            onAppearDateChange={this.handleAppearDateChange}
            onPrivilegeDateChange={this.handlePrivilegeDateChange}
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
