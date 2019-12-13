import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import config from "../../../config";
import {
  authHeader,
  handleFetchError,
  handleFetchSuccessResponse,
  correctPostcode,
  getCustomerByPeaId,
  b64toBlob
} from "../../../helpers";

import { Form } from "react-bootstrap";

import { ModalStatus } from "../../Modals";
import CustomerDataForm from "../../Customer/CustomerDataForm";
import CustomerVerifyForm from "../../Customer/CustomerVerifyForm";
import FormButton from "../../Customer/FormButton";

class VerifyCustomer extends Component {
  state = {
    dateAppear: new Date(),
    privilegeDate: new Date(),
    initial: {},
    statusModal: true,
    statusModalState: "loading",
    failtext: ""
    // redirectTo: "/"
  };

  UNSAFE_componentWillMount() {
    this.setState({
      statusModal: true,
      statusModalState: "getting"
    });
    const { peaId } = this.props;
    getCustomerByPeaId(peaId)
      .then(customer => {
        if (!customer) {
          this.setState({
            statusModal: true,
            statusModalState: "nodata"
          });
          return;
        }
        const privilegeDate =
          customer.verifies &&
          customer.verifies.length > 0 &&
          customer.verifies[customer.verifies.length - 1].privilegeDate
            ? new Date(
                customer.verifies[customer.verifies.length - 1].privilegeDate
              )
            : new Date();

        this.setState({
          privilegeDate: privilegeDate,
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
      .catch(err => {
        console.error(err);
        this.setState({
          statusModal: true,
          statusModalState: "getfail",
          failtext: "ไม่สามารถติดต่อเซิร์ฟเวอร์ได้"
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

  handleAppearDateChange = date => {
    this.setState({
      dateAppear: date
    });
  };

  handlePrivilegeDateChange = date => {
    console.log("handlePrivilegeDateChange:", date);
    this.setState({
      privilegeDate: date
    });
  };

  handleStatusClose = () => {
    this.setState({
      statusModal: false
    });
  };

  verifyData = event => {
    event.preventDefault();
    this.setState({
      statusModal: true,
      statusModalState: "saving"
    });
    // this.trimSigPad();
    const { peaId } = this.props;
    const { dateAppear, privilegeDate } = this.state;
    const signatureData = this.sigPad
      .getTrimmedCanvas()
      .toDataURL("image/png")
      .replace("data:image/png;base64,", "");
    // console.log(signatureData);
    const signatureBlob = b64toBlob(signatureData, "image/png");
    // console.log(this.sigPad.toData());
    const formData = new FormData();

    formData.append("dateAppear", JSON.stringify(dateAppear));
    formData.append("privilegeDate", JSON.stringify(privilegeDate));
    formData.append("signature", signatureBlob, "signature.png");
    // console.log(signatureData);
    const requestOptions = {
      method: "PUT",
      headers: authHeader(),
      body: formData
    };

    // this.setState({
    //   saveSuccess: true
    // });

    // return;

    fetch(`${config.apiUrl}/api/customers/verify/${peaId}`, requestOptions)
      .then(handleFetchSuccessResponse)
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
          statusModalState: "savefail"
        });
      });
  };

  render() {
    const {
      initial,
      statusModal,
      statusModalState,
      failtext,
      privilegeDate
    } = this.state;
    return (
      <React.Fragment>
        <Form onSubmit={this.verifyData}>
          {statusModalState !== "getting" ? (
            <React.Fragment>
              <CustomerDataForm initial={initial} readOnly={true} />
              <hr />
              <CustomerVerifyForm
                setSigpadRef={this.setSigpadRef}
                privilegeDate={privilegeDate}
                handleAppearDateChange={this.handleAppearDateChange}
                handlePrivilegeDateChange={this.handlePrivilegeDateChange}
              />
              <FormButton loading={statusModal} cancel={this.handleCancel} />
            </React.Fragment>
          ) : null}
        </Form>
        <ModalStatus
          show={statusModal}
          status={statusModalState}
          failtext={failtext}
          onHide={this.handleStatusClose}
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

export default withRouter(connect(mapStateToProps)(VerifyCustomer));
