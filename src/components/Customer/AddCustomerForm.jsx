import React, { Component } from "react";
import { Form } from "react-bootstrap";
import { connect } from "react-redux";

import config from "../../config";
// import { userActions } from "../../actions";
import { authHeader, handleFetchError } from "../../helpers";

// import { Link } from "react-router-dom";
import ModalStatus from "./ModalStatus";
import CustomerDataForm from "./CustomerDataForm";
import CustomerVerifyForm from "./CustomerVerifyForm";

class AddCustomerForm extends Component {
  state = {
    signatureBase64: null,
    fetchPeaIdComplete: true,
    existsPeaCustomer: false,
    peaIdOk: true,
    peaWarnText: ""
  };

  // componentDidUpdate(prevProps, prevState) {
  //   if (prevState.peaId !== this.state.peaId) {
  //     this.setState({ peaId: prevState.peaId });
  //   }
  // }

  //Whattttttttt I need to add REDUX!! ----------|
  insertData = event => {
    event.preventDefault();
    // this.trimSigPad();
    const signatureData = this.sigPad.getTrimmedCanvas().toDataURL("image/png");
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeader() },
      body: JSON.stringify({
        customer: {
          title: this.state.title,
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          peaId: this.state.peaId,
          dateAppear: this.state.dateAppear,
          authorize: this.state.authorize,
          soldierNo: this.state.soldierNo,
          war: this.state.war,
          signatureBase64: signatureData,
          address: {
            houseNo: this.state.houseNo,
            mooNo: this.state.mooNo,
            districtNo: this.state.districtNo
          }
        }
      })
    };

    fetch(`${config.apiUrl}/api/customers`, requestOptions)
      .then(handleFetchError)
      .then(rep => {
        console.log(rep);
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    return (
      <div>
        {/* Customer Form */}

        <Form onSubmit={this.insertData}>
          <CustomerDataForm
            initial={{ peaId: this.props.peaId }}
            showPlaceholder={true}
            validatePeaId={true}
          />

          <hr />

          <CustomerVerifyForm />
        </Form>
      </div>
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

export default connect(mapStateToProps)(AddCustomerForm);
