import React, { Component, Fragment } from "react";
// import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import config from "../../../config";
import {
  authHeader,
  handleFetchError,
  getCustomerByPeaId,
  correctPostcode
} from "../../../helpers";

import { Form } from "react-bootstrap";

import { ModalStatus } from "../../Modals";
import CustomerDataForm from "../../Customer/CustomerDataForm";
import FormButton from "../../Customer/FormButton";

export class EditCustomer extends Component {
  state = {
    initial: {},
    statusModal: true,
    statusModalState: "loading"
    // redirectTo: "/"
  };

  UNSAFE_componentWillMount() {
    const { peaId } = this.props;
    this.setState({
      statusModal: true,
      statusModalState: "getting"
    });
    getCustomerByPeaId(peaId)
      .then(customer => {
        if (!customer) {
          this.setState({
            statusModal: true,
            statusModalState: "nodata"
          });
          return;
        }

        this.setState({
          initial: {
            peaId: peaId,
            title: customer.title,
            firstName: customer.firstName,
            lastName: customer.lastName,
            houseNo: customer.address.houseNo,
            mooNo: customer.address.mooNo,
            districtNo: customer.address.districtNo,
            postcode: correctPostcode(customer.address.districtNo),
            authorize: customer.authorize,
            soldierNo: customer.soldierNo,
            war: customer.war
          },
          statusModal: false,
          statusModalState: "getok"
        });
      })
      .catch(() => {
        // console.log("get fail");
        this.setState({
          statusModal: true,
          statusModalState: "getfail"
        });
      });
  }

  handleSuccess = () => {
    this.props.history.goBack();
  };

  handleCancel = () => {
    this.props.history.goBack();
  };

  handleStatusClose = () => {
    this.setState({
      statusModal: false
    });
  };

  updateData = event => {
    event.preventDefault();
    this.setState({
      statusModal: true,
      statusModalState: "saving"
    });
    const { peaId } = this.props;
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeader() },
      body: JSON.stringify({
        customer: {
          title: event.target.title.value,
          firstName: event.target.firstName.value,
          lastName: event.target.lastName.value,
          authorize: event.target.authorize.value,
          soldierNo: event.target.soldierNo.value,
          war: event.target.war.value,
          address: {
            houseNo: event.target.houseNo.value,
            mooNo: event.target.mooNo.value,
            districtNo: event.target.districtNo.value
          }
        }
      })
    };

    // return;
    fetch(`${config.apiUrl}/api/customers/${peaId}`, requestOptions)
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
      .then(({ err, rep }) => {
        if (err) {
          this.setState({
            statusModalState: "savefail",
            failtext: err
          });
          return;
        }

        this.setState({
          statusModalState: "saved"
        });
        setTimeout(() => {
          this.handleSuccess();
        }, config.statusShowTime);
      })
      .catch(err => {
        console.log(err);

        this.setState({
          statusModalState: "savefail",
          failtext: "ไม่สามารถติดต่อเซิร์ฟเวอร์ได้"
        });
      });
  };

  render() {
    const { statusModal, statusModalState, initial, failtext } = this.state;
    return (
      <Fragment>
        {statusModalState !== "getting" ? (
          <Form onSubmit={this.updateData}>
            <CustomerDataForm
              peaIdReadOnly={true}
              initial={initial}
              showPlaceholder={true}
            />
            <FormButton loading={statusModal} cancel={this.handleCancel} />
          </Form>
        ) : null}

        <ModalStatus
          show={statusModal}
          status={statusModalState}
          failtext={failtext}
          onHide={this.handleStatusClose}
        />
      </Fragment>
    );
  }
}

export default withRouter(EditCustomer);
