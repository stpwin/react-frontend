import React, { Component } from "react";

import { connect } from "react-redux";
import config from "../../config";
import { userActions } from "../../actions";
import { authHeader, handleFetchError, addressToString } from "../../helpers";

import { Table } from "react-bootstrap";

class ListCustomer extends Component {
  state = {
    pageNo: 1,
    customers: []
  };

  componentDidMount() {
    this.props.dispatch(userActions.getAll());
    this.fetchCustomers();
  }

  fetchCustomers = () => {
    const { pageNo } = this.state;
    const reqConf = {
      method: "GET",
      headers: authHeader()
    };

    fetch(`${config.apiUrl}/api/customers/${pageNo}`, reqConf)
      .then(handleFetchError)
      .then(rep => {
        if (rep.status === 204) {
          return null;
        }
        rep.json().then(repMsg => {
          this.setState({
            customers: repMsg.customers
          });
          console.log(repMsg.customers);
        });
      })
      .catch(err => {});
  };

  render() {
    const { customers } = this.state;
    return (
      <div>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>#</th>
              <th>ชื่อ-สกุล</th>
              <th>หมายเลขผู้ใช้ไฟ</th>
              <th>ที่อยู่</th>
              <th>กรณีเป็น</th>
              <th>ได้รับสิทธิ์วันที่</th>
              <th>บัตรประจำตัวเลขที่</th>
              <th>วันที่มาแสดงตน</th>
              <th>ลดสิทธิ์สงคราม</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{customer.firstName + " " + customer.lastName}</td>
                  <td>{customer.peaId}</td>
                  <td>{addressToString(customer.address)}</td>
                </tr>
              );
            })}

            {/* <tr>
              <td>3</td>
              <td colSpan="2">Larry the Bird</td>
              <td>@twitter</td>
            </tr> */}
          </tbody>
        </Table>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { users, authentication } = state;
  const { user } = authentication;
  return {
    user,
    users
  };
}

export default connect(mapStateToProps)(ListCustomer);
