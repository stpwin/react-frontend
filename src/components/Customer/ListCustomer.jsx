import React, { Component } from "react";

import { connect } from "react-redux";
import config from "../../config";
import { userActions } from "../../actions";
import { authHeader, handleFetchError, addressToString } from "../../helpers";

import { Table, Pagination, InputGroup, FormControl } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";

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
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text id='btnGroupAddon2'>
              <FaSearch />
            </InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            type='text'
            placeholder='Input group example'
            aria-label='Input group example'
            aria-describedby='btnGroupAddon2'
          />
        </InputGroup>
        <Table striped bordered hover size='sm'>
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
                  <td>
                    {customer.title +
                      " " +
                      customer.firstName +
                      " " +
                      customer.lastName}
                  </td>
                  <td>{customer.peaId}</td>
                  <td>{addressToString(customer.address)}</td>
                  <td>{customer.authorize}</td>
                  <td>{}</td>
                  <td>{customer.soldierNo}</td>
                  <td>{customer.dateAppear[0]}</td>
                  <td>{customer.war}</td>
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

genPageination = props => {
  return (
    <Pagination>
      <Pagination.First />
      <Pagination.Prev />
      <Pagination.Item>{1}</Pagination.Item>
      <Pagination.Ellipsis />

      <Pagination.Item>{10}</Pagination.Item>
      <Pagination.Item>{11}</Pagination.Item>
      <Pagination.Item active>{12}</Pagination.Item>
      <Pagination.Item>{13}</Pagination.Item>
      <Pagination.Item disabled>{14}</Pagination.Item>

      <Pagination.Ellipsis />
      <Pagination.Item>{20}</Pagination.Item>
      <Pagination.Next />
      <Pagination.Last />
    </Pagination>
  );
};

function mapStateToProps(state) {
  const { users, authentication } = state;
  const { user } = authentication;
  return {
    user,
    users
  };
}

export default connect(mapStateToProps)(ListCustomer);
