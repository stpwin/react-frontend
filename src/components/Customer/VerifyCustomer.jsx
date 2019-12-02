import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import config from "../../config";
import {
  authHeader,
  handleFetchError,
  correctPostcode,
  getCustomerByPeaId
} from "../../helpers";

import { Form } from "react-bootstrap";

import { ModalStatus } from "../Modals";
import CustomerDataForm from "./CustomerDataForm";
import CustomerVerifyForm from "./CustomerVerifyForm";
import FormButton from "./FormButton";

class VerifyCustomer extends Component {
  state = {
    initial: {},
    statusModal: true,
    statusModalState: "loading"
    // redirectTo: "/"
  };

  UNSAFE_componentWillMount() {
    this.setState({
      statusModal: true,
      statusModalState: "getting"
    });
    getCustomerByPeaId(this.props.peaId)
      .then(customer => {
        if (!customer) {
          this.setState({
            statusModal: true,
            statusModalState: "nodata"
          });
          return;
        }
        // console.log(customer);
        this.setState({
          initial: {
            peaId: this.props.peaId,
            title: customer.title,
            firstName: customer.firstName,
            lastName: customer.lastName,
            houseNo: customer.address.houseNo,
            mooNo: customer.address.mooNo,
            districtNo: customer.address.districtNo,
            postcode: correctPostcode(customer.address.districtNo),
            soldierNo: customer.soldierNo,
            war: customer.war
          },
          statusModal: false,
          statusModalState: "getok"
        });
      })
      .catch(() => {
        console.log("get fail");
        this.setState({
          statusModal: true,
          statusModalState: "getfail"
        });
      });
  }

  sigPad = {};
  setSigpadRef = ref => {
    this.sigPad = ref;
  };

  handleSuccess = () => {
    // this.props.history.push(this.props.redirectTo);
    this.props.history.goBack();
  };

  handleCancel = () => {
    // this.props.history.push(this.props.redirectTo);
    this.props.history.goBack();
  };

  verifyData = event => {
    event.preventDefault();
    this.setState({
      statusModal: true,
      statusModalState: "saving"
    });
    // this.trimSigPad();
    const { peaId } = this.props;
    const signatureData = this.sigPad.getTrimmedCanvas().toDataURL("image/png");
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeader() },
      body: JSON.stringify({
        verify: {
          dateAppear: event.target.dateAppear.value,
          authorize: event.target.authorize.value,
          authorizeName: event.target.authorizeName.value,
          signatureBase64: signatureData
        }
      })
    };

    // this.setState({
    //   saveSuccess: true
    // });

    // return;

    fetch(`${config.apiUrl}/api/customers/verify/${peaId}`, requestOptions)
      .then(handleFetchError)
      .then(rep => {
        console.log(rep.status);
        if (rep.status === 200) {
          return rep.json();
        }
        return null;
      })
      .then(data => {
        console.log(data);
        this.setState({
          statusModalState: "saved"
        });
        setTimeout(() => {
          this.handleSuccess();
        }, 1000);
      })
      .catch(err => {
        console.log(err);
        this.setState({
          statusModalState: "savefail"
        });
        setTimeout(() => {
          this.setState({
            statusModal: false
          });
        }, 1000);
      });
  };

  render() {
    const { initial, statusModal, statusModalState } = this.state;
    return (
      <React.Fragment>
        <Form onSubmit={this.verifyData}>
          {statusModalState !== "getting" ? (
            <React.Fragment>
              <CustomerDataForm initial={initial} readOnly={true} />
              <hr />
              <CustomerVerifyForm setSigpadRef={this.setSigpadRef} />
              <FormButton loading={statusModal} cancel={this.handleCancel} />
            </React.Fragment>
          ) : null}
        </Form>
        <ModalStatus show={statusModal} status={statusModalState} />
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

export default withRouter(connect(mapStateToProps)(VerifyCustomer));
