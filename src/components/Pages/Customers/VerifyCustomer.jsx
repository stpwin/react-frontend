import React, { Component } from "react";
import { connect } from "react-redux";
import { customerActions } from "../../../actions";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

import { correctPostcode } from "../../../helpers";

import { Form } from "react-bootstrap";

import CustomerDataForm from "../../Customer/CustomerDataForm";
import CustomerVerifyForm from "../../Customer/CustomerVerifyForm";
import FormButton from "../../Customer/FormButton";

class VerifyCustomer extends Component {
  state = {
    appearDate: new Date(),
    privilegeDate: null,
    initial: {}
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      customers: { status }
    } = nextProps;

    if (status === "verify_success") {
      this.props.history.goBack();
    }
  }

  UNSAFE_componentWillMount() {
    const { peaId } = this.props;
    this.props.getCustomer(peaId);
  }

  sigPad = {};
  setSigpadRef = ref => {
    this.sigPad = ref;
  };

  handleCancel = () => {
    this.props.history.goBack();
  };

  handleAppearDateChange = date => {
    this.setState({
      appearDate: date
    });
  };

  handlePrivilegeDateChange = date => {
    console.log(date)
    this.setState({
      privilegeDate: date
    });
  };

  handleVerifyCustomer = event => {
    event.preventDefault();

    const { peaId } = this.props;
    const { appearDate, privilegeDate } = this.state;
    const signature = this.sigPad.getTrimmedCanvas().toDataURL("image/png");

    this.props.verifyCustomer(peaId, { appearDate, privilegeDate, signature });
  };

  render() {
    const { peaId, customers } = this.props;
    const { customer, loading } = customers;
    let initial;
    if (customer) {
      initial = {
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
      };
    }

    return (
      <Form onSubmit={this.handleVerifyCustomer}>
        {customer ? (
          <React.Fragment>
            <CustomerDataForm initial={initial} readOnly={true} />
            <hr />
            <CustomerVerifyForm
              setSigpadRef={this.setSigpadRef}
              onAppearDateChange={this.handleAppearDateChange}
              onPrivilegeDateChange={this.handlePrivilegeDateChange}
            />
            <FormButton loading={loading} cancel={this.handleCancel} />
          </React.Fragment>
        ) : null}
      </Form>
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
    getCustomer: peaId => dispatch(customerActions.get(peaId)),
    verifyCustomer: (peaId, verify) =>
      dispatch(customerActions.verify(peaId, verify))
  };
};

VerifyCustomer.propTypes = {
  peaId: PropTypes.string.isRequired
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(VerifyCustomer)
);
