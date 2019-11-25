import React, { Component } from "react";
import { connect } from "react-redux";
import { customerActions } from "../../../actions";
import { withRouter } from "react-router-dom";

import { getPostcodeFromDistrictNo } from "../../../helpers";

import { Form } from "react-bootstrap";

import CustomerDataForm from "../../Customer/CustomerDataForm";
import FormButton from "../../Customer/FormButton";

class EditCustomer extends Component {
  state = {
    customer: {}
  };

  UNSAFE_componentWillMount() {
    this.props.getCustomer(this.props.peaId);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      customers: { status, customer }
    } = nextProps;
    if (status === "update_success") {
      this.props.history.goBack();
      return
    }
    if (customer) {
      this.setState({
        customer: {
          peaId: customer.peaId,
          title: customer.title,
          firstName: customer.firstName,
          lastName: customer.lastName,
          houseNo: customer.address.houseNo,
          mooNo: customer.address.mooNo,
          districtNo: customer.address.districtNo,
          postcode: getPostcodeFromDistrictNo(customer.address.districtNo),
          authorize: customer.authorize,
          soldierNo: customer.soldierNo,
          war: customer.war
        }
      })
    }
  }

  handleCancel = () => {
    this.props.history.goBack();
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

  handleUpdateCustomer = event => {
    event.preventDefault();
    this.props.updateCustomer(this.state.customer);
  };

  render() {
    const { customer } = this.state
    const { customers: { loading } } = this.props;

    return (
      <Form onSubmit={this.handleUpdateCustomer}>
        <CustomerDataForm
          peaIdReadOnly={true}
          customer={customer}
          showPlaceholder={true}
          onChange={this.handleDataChange}
        />
        <FormButton loading={loading} cancel={this.handleCancel} />
      </Form>
    );
  }
}

const mapStateToProps = state => {
  const { customers } = state;
  return { customers };
};

const mapDispatchToProps = dispatch => {
  return {
    getCustomer: peaId => dispatch(customerActions.get(peaId)),
    updateCustomer: customer => dispatch(customerActions.update(customer))
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(EditCustomer)
);
