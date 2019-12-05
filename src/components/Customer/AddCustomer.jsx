import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import config from "../../config";
import { authHeader, handleFetchError } from "../../helpers";

import { Form } from "react-bootstrap";

import { ModalStatus, ModalConfirm } from "../Modals";
import CustomerDataForm from "./CustomerDataForm";
import CustomerVerifyForm from "./CustomerVerifyForm";
import FormButton from "./FormButton";

class AddCustomer extends Component {
  state = {
    signatureBase64: null,
    fetchPeaIdComplete: true,
    existsPeaCustomer: false,
    peaIdOk: true,
    peaWarnText: "",
    statusModal: false,
    statusModalState: "loading",
    confirmModal: false
  };

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

  insertData = event => {
    event.preventDefault();
    this.setState({
      statusModal: true,
      statusModalState: "saving"
    });
    const signatureData = this.sigPad.getTrimmedCanvas().toDataURL("image/png");
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeader() },
      body: JSON.stringify({
        customer: {
          title: event.target.title.value,
          firstName: event.target.firstName.value,
          lastName: event.target.lastName.value,
          peaId: event.target.peaId.value,
          authorize: event.target.authorize.value,
          soldierNo: event.target.soldierNo.value,
          war: event.target.war.value,
          address: {
            houseNo: event.target.houseNo.value,
            mooNo: event.target.mooNo.value,
            districtNo: event.target.districtNo.value
          }
        },
        verify: {
          dateAppear: event.target.dateAppear.value,
          signatureBase64: signatureData
        }
      })
    };

    fetch(`${config.apiUrl}/api/customers`, requestOptions)
      .then(rep => {
        if (rep.status === 422) {
          this.setState({
            statusModalState: "require"
          });
          setTimeout(() => {
            this.setState({
              statusModal: false
            });
          }, config.statusShowTime);
          return;
        }
        return rep;
      })
      .then(handleFetchError)
      .then(rep => {
        if (!rep) return;
        rep.json().then(data => {
          this.setState({
            statusModalState: "saved"
          });
          setTimeout(() => {
            this.handleSuccess();
          }, config.statusShowTime);
        });
      })
      .catch(err => {
        this.setState({
          statusModalState: "savefail"
        });
        setTimeout(() => {
          this.setState({
            statusModal: false
          });
        }, config.statusShowTime);
      });
  };

  render() {
    const { statusModal, statusModalState, confirmModal } = this.state;
    return (
      <React.Fragment>
        <Form onSubmit={this.insertData}>
          <CustomerDataForm
            initial={{ peaId: this.props.peaId }}
            showPlaceholder={true}
            validatePeaId={true}
          />
          <hr />
          <CustomerVerifyForm setSigpadRef={this.setSigpadRef} />
          <FormButton loading={statusModal} cancel={this.handleCancel} />
        </Form>
        <ModalStatus show={statusModal} status={statusModalState} />
        <ModalConfirm
          show={confirmModal}
          status='datachanged'
          confirm={this.handleSuccess}
          close={this.handleConfirmModalClose}
        />
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  const { authentication } = state;
  const { user } = authentication;
  return {
    user
  };
}

export default withRouter(connect(mapStateToProps)(AddCustomer));
