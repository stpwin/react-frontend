import React, { Component } from "react";

import { connect } from "react-redux";
import { Link, useParams } from "react-router-dom";
import config from "../../config";
import { userActions } from "../../actions";
import { authHeader, handleFetchError, addressToString } from "../../helpers";

import { Table, Pagination, InputGroup, FormControl } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { DataTable } from "react-data-components";
import "react-data-components/css/table-twbs.css";

class ListCustomer extends Component {
  state = {
    pageNo: 1,
    maxPage: 10,
    customers: [],
    customerTranslate: []
  };

  componentDidMount() {
    // this.props.dispatch(userActions.getAll());
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
          const translated = repMsg.customers.map((key, index) => {
            return {
              // index: this.i,
              name: `${key.title} ${key.firstName} ${key.lastName}`,
              peaId: key.peaId,
              address: addressToString(key.address),
              authorize: key.authorize,
              privilegeDate: "",
              soldierId: key.soldierId,
              dateAppear: key.dateAppear,
              war: key.war
            };
          });
          this.setState({
            customerTranslate: translated
          });
          console.log(translated);
          // console.log(repMsg.customers);
        });
      })
      .catch(err => {});
  };

  handleChangePage = event => {
    const pageNo = parseInt(event.target.text);
    console.log(pageNo);
    if (pageNo) {
      this.setState({
        pageNo: pageNo
      });
    }
  };

  i = 1;
  renderNumber = (val, row) => {
    let i = 1;
    return i++;
  };

  componentDidUpdate() {
    console.log("Update");
  }

  columns = [
    { title: "ลำดับ", render: this.renderNumber },
    { title: "ชื่อ-สกุล", prop: "name" },
    { title: "หมายเลขผู้ใช้ไฟ", prop: "peaId" },
    { title: "ที่อยู่", prop: "address" },
    { title: "กรณีเป็น", prop: "authorize" },
    { title: "ได้รับสิทธิ์วันที่", prop: "privilegeDate" },
    { title: "บัตรประจำตัวเลขที่", prop: "soldierId" },
    { title: "วันที่มาแสดงตน", prop: "dateAppear" },
    { title: "ลดสิทธิ์สงคราม", prop: "war" }
  ];

  render() {
    console.log(this.props);
    const { customerTranslate } = this.state;
    return (
      <div>
        {/* <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text id="btnGroupAddon2">
              <FaSearch />
            </InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            type="text"
            placeholder="Input group example"
            aria-label="Input group example"
            aria-describedby="btnGroupAddon2"
          />
        </InputGroup> */}
        <DataTable
          keys="peaId"
          columns={this.columns}
          initialData={customerTranslate}
          initialPageLength={5}
          initialSortBy={{ prop: "index", order: "ascending" }}
        />
        {/* <Table striped bordered hover size="sm">
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
          </tbody>
        </Table> */}
        {/* <Pagination onClick={this.handleChangePage}>
          {pagination(pageNo, maxPage)}
        </Pagination> */}
      </div>
    );
  }
}

function pagination(c, m) {
  var current = c,
    last = m,
    delta = 2,
    left = current - delta,
    right = current + delta + 1,
    range = [],
    pagesItem = [],
    l;

  for (let i = 1; i <= last; i++) {
    if (i == 1 || i == last || (i >= left && i < right)) {
      range.push(i);
    }
  }

  for (let i of range) {
    if (l) {
      if (i - l === 2) {
        pagesItem.push(
          <Pagination.Item active={current === l + 1}>{l + 1}</Pagination.Item>
        );
      } else if (i - l !== 1) {
        pagesItem.push(<Pagination.Ellipsis disabled={true} />);
      }
    }

    pagesItem.push(
      <Pagination.Item active={current === i}>{i}</Pagination.Item>
    );
    l = i;
  }

  return pagesItem;
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
