import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { customerActions } from "../../../actions";
import { withRouter } from "react-router-dom";

import { correctPostcode } from "../../../helpers";

import { Form } from "react-bootstrap";

import CustomerDataForm from "../../Customer/CustomerDataForm";
import FormButton from "../../Customer/FormButton";

export class EditCustomer extends Component {
  state = {
    initial: {}
  };

  UNSAFE_componentWillMount() {
    const { peaId } = this.props;
    this.props.getCustomer(peaId);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      customers: { status }
    } = nextProps;
    if (status === "update_success") {
      this.props.history.goBack();
    }
  }

  handleSuccess = () => {
    this.props.history.goBack();
  };

  handleCancel = () => {
    this.props.history.goBack();
  };

  handleUpdateCustomer = event => {
    event.preventDefault();
    const { peaId } = this.props;

    const customer = {
      peaId,
      title: event.target.title.value,
      firstName: event.target.firstName.value,
      lastName: event.target.lastName.value,
      authorize: event.target.authorize.value,
      soldierNo: event.target.soldierNo.value,
      war: event.target.war.value,

      houseNo: event.target.houseNo.value,
      mooNo: event.target.mooNo.value,
      districtNo: event.target.districtNo.value
    };
    this.props.updateCustomer(customer);
  };

  render() {
    // const { initial } = this.state;
    const {
      customers: { loading, customer }
    } = this.props;
    let initial;
    if (customer) {
      initial = {
        peaId: customer.peaId,
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
      <Fragment>
        {!loading ? (
          <Form onSubmit={this.handleUpdateCustomer}>
            <CustomerDataForm
              peaIdReadOnly={true}
              initial={initial}
              showPlaceholder={true}
            />
            <FormButton loading={loading} cancel={this.handleCancel} />
          </Form>
        ) : null}
      </Fragment>
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
