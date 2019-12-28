import React, { Component } from "react";
import { connect } from "react-redux";
import { customerActions } from "../../../actions";
// import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

import { getPostcodeFromDistrictNo } from "../../../helpers";

import { Form } from "react-bootstrap";

import CustomerDataForm from "../../Customer/CustomerDataForm";
import CustomerVerifyForm from "../../Customer/CustomerVerifyForm";
import FormButton from "../../Customer/FormButton";

class VerifyCustomer extends Component {
  state = {
    appearDate: new Date(),
    customer: {}
  };
  sigPad = null;

  UNSAFE_componentWillMount() {
    this.props.getCustomer(this.props.peaId);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      customers: { status, customer }
    } = nextProps;

    if (status === "verify_success") {
      this.props.history.goBack();
      return
    }
    // && Object.entries(customer).length !== 0 && customer.constructor === Object
    if (customer) {
      this.setState({
        customer: {
          peaId: customer.peaId,
          title: customer.title,
          firstName: customer.firstName,
          lastName: customer.lastName,
          houseNo: customer.address && customer.address.houseNo,
          mooNo: customer.address && customer.address.mooNo,
          districtNo: customer.address && customer.address.districtNo,
          postcode: customer.address && getPostcodeFromDistrictNo(customer.address.districtNo),
          authorize: customer.authorize,
          soldierNo: customer.soldierNo,
          war: customer.war
        }
      })
    }
  }

  setSigpadRef = ref => {
    this.sigPad = ref;
  };

  handleGoBack = () => {
    const { history } = this.props
    const { location: { state, pathname } } = history
    if (state && state.from) {
      return history.replace(state.from, { from: pathname, filter: state.filter })
    }
    history.goBack()
  }
  handleAppearDateChange = date => {
    this.setState({
      appearDate: date
    });
  };

  handleVerifyCustomer = event => {
    event.preventDefault();
    const { peaId } = this.props;
    const { appearDate } = this.state;
    const signature =
      (!this.sigPad.isEmpty() &&
        this.sigPad.getTrimmedCanvas().toDataURL("image/png")) ||
      null;
    this.props.verifyCustomer(peaId, { appearDate, signature });
  };

  render() {
    const { customer } = this.state
    const { customers: { loading } } = this.props;

    return (
      <Form onSubmit={this.handleVerifyCustomer}>
        <CustomerDataForm customer={customer} readOnly={true} />
        <hr />
        <CustomerVerifyForm
          setSigpadRef={this.setSigpadRef}
          onAppearDateChange={this.handleAppearDateChange}
        />
        <FormButton loading={loading} cancel={this.handleGoBack} />
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

export default connect(mapStateToProps, mapDispatchToProps)(VerifyCustomer)
