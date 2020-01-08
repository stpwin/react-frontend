import React, { Component } from "react";
import { connect } from "react-redux";
import { customerActions } from "../../../actions";

import { getPostcodeFromDistrictNo } from "../../../helpers";

import { Form } from "react-bootstrap";

import CustomerDataForm from "../../Customer/CustomerDataForm";
import FormButton from "../../Customer/FormButton";

class EditCustomer extends Component {
  state = {
    customer: {}
  };

  componentDidMount() {
    this.props.getCustomer(this.props.peaId);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      customers: { status, customer }
    } = nextProps;
    if (status === "update_success") {
      this.handleGoBack();
      return;
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
          war: customer.war,
          tel: customer.tel,
          description: customer.description
        }
      });
    }
  }

  handleGoBack = () => {
    const { history } = this.props;
    const {
      location: { state, pathname }
    } = history;
    if (state && state.from) {
      return history.replace(state.from, {
        from: pathname,
        filter: state.filter
      });
    }
    history.goBack();
  };

  handleDataChange = e => {
    const { name, value } = e.target;
    if (name === "districtNo") {
      this.setState({
        customer: {
          ...this.state.customer,
          districtNo: value,
          postcode: getPostcodeFromDistrictNo(value)
        }
      });
    } else {
      this.setState({
        customer: {
          ...this.state.customer,
          [name]: value
        }
      });
    }
  };

  handleUpdateCustomer = event => {
    event.preventDefault();
    this.props.updateCustomer(this.props.peaId, this.state.customer);
  };

  render() {
    const { customer } = this.state;
    const { loading } = this.props;

    return (
      <Form onSubmit={this.handleUpdateCustomer}>
        <CustomerDataForm
          // peaIdReadOnly={true}
          customer={customer}
          showPlaceholder={true}
          onChange={this.handleDataChange}
        />
        <FormButton loading={loading} cancel={this.handleGoBack} />
      </Form>
    );
  }
}

const mapStateToProps = state => {
  const { customers } = state;
  const { loading } = customers;
  return { customers, loading };
};

const mapDispatchToProps = dispatch => {
  return {
    getCustomer: peaId => dispatch(customerActions.get(peaId)),
    updateCustomer: (peaId, customer) =>
      dispatch(customerActions.update(peaId, customer))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditCustomer);
