import React, { Component } from "react";
// import AddCustomerForm from "../../Customer/AddCustomerForm";
import ListCustomer from "../../Customer/ListCustomer";

class Customers extends Component {
  render() {
    return (
      <div>
        <ListCustomer />
        {/* <AddCustomerForm /> */}
      </div>
    );
  }
}

export default Customers;

export * from "./EditCustomer";
export * from "./CreateCustomer";
export * from "./VerifyCustomer";
