import React, { Component, Fragment } from "react";

import { connect } from "react-redux";
// import { Link, useParams } from "react-router-dom";
import config from "../../config";
// import { userActions } from "../../actions";
import { authHeader, handleFetchError, addressToString } from "../../helpers";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";

// import {
//   Table,
//   InputGroup,
//   FormControl,
//   Row,
//   Col,
//   Form,
//   Pagination,
//   Button,
//   Dropdown
// } from "react-bootstrap";
// import { FaSearch, FaTimes } from "react-icons/fa";
// import { DataTable } from "react-data-components";

import { DataTable } from "../DataTable";
// import paginationFactory, { PaginationProvider, PaginationListStandalone } from "react-bootstrap-table2-paginator";
// import BootstrapTable from "react-bootstrap-table-next";

class ListCustomer extends Component {
  state = {
    pageNo: 1,
    maxPage: 10,
    perPage: "50",
    customers: [],
    customerTranslate: [],
    filterText: "",
    filterChecked: [true, true],
    filters: [{ text: "G1" }, { text: "G2" }]
  };

  componentDidMount() {
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
              index: index + 1,
              name: `${key.title} ${key.firstName} ${key.lastName}`,
              peaId: key.peaId,
              address: addressToString(key.address),
              authorize: key.authorize,
              // privilegeDate: "",
              soldierNo: key.soldierNo,
              // dateAppear: key.dateAppear,
              war: key.war
            };
          });
          this.setState({
            customerTranslate: translated
          });
          // console.log(translated);
          // console.log(repMsg.customers);
        });
      })
      .catch(err => {});
  };

  onPerPageChange = value => {
    console.log(value);
    this.setState({
      perPage: value
    });
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

  onPrevPage = event => {
    this.setState({
      pageNo: this.state.pageNo - 1
    });
  };

  onNextPage = event => {
    this.setState({
      pageNo: this.state.pageNo + 1
    });
  };

  onPageChange = event => {
    if (!event.target.text) return;

    const pageNo = parseInt(event.target.text);

    if (pageNo) {
      this.setState({
        pageNo: pageNo
      });
    }
  };

  onFilterCheckedChange = event => {
    const index = event.target.name.replace("filter-", "");
    let newChecked = this.state.filterChecked;
    newChecked[index] = event.target.checked;
    this.setState({
      filterChecked: newChecked
    });
  };

  onFilterTextChange = text => {
    // console.log(text);
    this.setState({
      filterText: text
    });
  };

  columns = [
    { text: "ลำดับ", dataField: "index", valign: "true" },
    { text: "ชื่อ-สกุล", dataField: "name" },
    { text: "หมายเลขผู้ใช้ไฟ", dataField: "peaId", valign: "true" },
    { text: "ที่อยู่", dataField: "address" },
    { text: "ลดสิทธิ์สงคราม", dataField: "war", valign: "true" },
    { text: "บัตรประจำตัวเลขที่", dataField: "soldierNo", valign: "true" },
    { text: "ได้รับสิทธิ์วันที่", dataField: "privilegeDate", valign: "true" },

    { text: "กรณีเป็น", dataField: "authorize" },
    { text: "วันที่มาแสดงตน", dataField: "laseDateAppear", valign: "true" }
  ];

  render() {
    // console.log(this.props);
    const {
      customerTranslate,
      maxPage,
      pageNo,
      perPage,
      filterChecked,
      filters
    } = this.state;
    return (
      <Fragment>
        {/* <SuperTable /> */}
        {/* <BootstrapTable
          keyField='id'
          data={customerTranslate}
          columns={this.columns}
          pagination={paginationFactory()}
        /> */}
        <DataTable
          filterPlaceholder='ค้นหาชื่อ หรือ รหัสผู้ใช้ไฟ CA'
          columns={this.columns}
          data={customerTranslate}
          maxPage={maxPage}
          pageNo={pageNo}
          onNextPage={this.onNextPage}
          onPrevPage={this.onPrevPage}
          onPageChange={this.onPageChange}
          onPerPageChange={this.onPerPageChange}
          perPage={perPage}
          filters={filters}
          filterChecked={filterChecked}
          onFilterCheckedChange={this.onFilterCheckedChange}
          filterTextChange={this.onFilterTextChange}
        />
      </Fragment>
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

export default connect(mapStateToProps)(ListCustomer);
