import React, { Component } from "react";
import { Form } from "react-bootstrap";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import config from "../../config";

import ModalStatus from "./ModalStatus";
import CustomerDataForm from "./CustomerDataForm";
import CustomerVerifyForm from "./CustomerVerifyForm";

import { authHeader, handleFetchError } from "../../helpers";
// import FakeTimers from "@jest/fake-timers/build/jestFakeTimers";

// import { Link } from "react-router-dom";
import { correctPostcode } from "../../helpers";
// import axios from "axios";
// import "./VerifyCustomerForm.css";

class VerifyCustomerForm extends Component {
  state = {
    initial: { peaId: this.props.peaId },

    statusModal: true,
    statusModalState: "getting",
    redirect: false
  };
  componentWillMount() {
    this.getCustomerByPeaId(this.props.peaId)
      .then(customer => {
        // console.log(customer);
        if (!customer) return;
        this.setState({
          initial: {
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
          statusModal: false
        });
      })
      .catch(() => {
        this.setState({
          statusModal: true,
          statusModalState: "getfail"
        });
      });
  }

  componentDidMount() {
    // console.log(this.props)
  }

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
          dateAppear: this.state.dateAppear,
          authorize: this.state.authorize,
          authorizeName: this.state.authorizeName
        },
        signatureBase64: signatureData
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
          this.setState({
            redirect: true
          });
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

  getCustomerByPeaId = peaId => {
    const requestOptions = {
      method: "GET",
      headers: authHeader()
    };

    return fetch(
      `${config.apiUrl}/api/customers/peaid/${peaId}`,
      requestOptions
    )
      .then(handleFetchError)
      .then(rep => {
        if (rep.status === 200) {
          return rep.json();
        }
        return null;
      })
      .then(data => {
        // console.log(data);
        return data;
      });
  };

  render() {
    const { initial, statusModal, statusModalState, redirect } = this.state;
    // console.log(initial);
    // const { peaId } = this.props;
    return (
      <div>
        <Form onSubmit={this.verifyData}>
          <CustomerDataForm initial={initial} readOnly={true} />
          <hr />
          <CustomerVerifyForm />
        </Form>
        <ModalStatus show={statusModal} status={statusModalState} />
        {redirect ? <Redirect to="/" /> : null}
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

export default connect(mapStateToProps)(VerifyCustomerForm);
