import React, { Component, Fragment } from "react";

import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import config from "../../config";
// import { userActions } from "../../actions";
import { authHeader, handleFetchError, addressToString } from "../../helpers";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import ScrollPositionManager from "../../helpers/scroll-mamager";

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
    maxPage: 0,
    perPage: "10",
    perPages: [10, 20, 50, 100],
    customers: [],
    customerTranslate: [],
    filterText: "",
    filterChecked: [true, true],
    filters: [
      { text: "G1", wars: ["ภายในประเทศ", "เวียดนาม", "เกาหลี"] },
      { text: "G2", wars: ["เอเชียบูรพา", "อินโดจีน", "ฝรั่งเศส"] }
    ]
  };

  UNSAFE_componentWillMount() {
    this.fetchCustomers();
  }

  getWarFilter = () => {
    const { filters, filterChecked } = this.state;
    return filterChecked.every(v => v === true)
      ? "*"
      : filterChecked
          .map((data, index) => {
            return data === true ? filters[index].wars.join() : null;
          })
          .filter(Boolean)
          .join() || "-";
  };

  fetchCustomers = () => {
    const { pageNo, perPage } = this.state;
    const reqConf = {
      method: "GET",
      headers: authHeader()
    };

    fetch(`${config.apiUrl}/api/customers/all/${pageNo}/${perPage}`, reqConf)
      .then(handleFetchError)
      .then(rep => {
        if (rep.status === 204) {
          return null;
        }
        rep.json().then(repMsg => {
          // console.log(repMsg.pages);
          this.setState({
            maxPage: repMsg.metadata.pages,
            pageNo:
              pageNo > repMsg.metadata.pages ? repMsg.metadata.pages : pageNo
          });
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
      .catch(err => {
        console.log(err);
      });
  };

  fillCustomer = () => {
    const { pageNo, perPage, filterText } = this.state;
    const reqConf = {
      method: "GET",
      headers: authHeader()
    };
    const war = this.getWarFilter();
    console.log(war);
    fetch(
      `${config.apiUrl}/api/customers/filter/${filterText}/${war}/${pageNo}/${perPage}`,
      reqConf
    )
      .then(handleFetchError)
      .then(rep => {
        if (rep.status === 204) {
          this.setState({
            customerTranslate: []
          });
          return;
        }
        rep.json().then(repMsg => {
          console.log(repMsg);
          if (!repMsg.customers || !repMsg.metadata) return;

          this.setState({
            maxPage: repMsg.metadata.pages,
            pageNo:
              pageNo > repMsg.metadata.pages ? repMsg.metadata.pages : pageNo
          });

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
      .catch(err => {
        console.log(err);
      });
  };

  fetchNew = () => {
    if (this.state.filterText) {
      this.fillCustomer(this.state.filterText);
    } else {
      this.fetchCustomers();
    }
  };

  onPerPageChange = value => {
    // console.log(value);
    this.setState(
      {
        perPage: value
      },
      () => {
        this.fetchNew();
      }
    );
  };

  onPrevPage = () => {
    this.setState(
      {
        pageNo: this.state.pageNo > 1 ? this.state.pageNo - 1 : 1
      },
      () => {
        this.fetchNew();
      }
    );
  };

  onNextPage = () => {
    this.setState(
      {
        pageNo:
          this.state.pageNo < this.state.maxPage
            ? this.state.pageNo + 1
            : this.state.pageNo
      },
      () => {
        this.fetchNew();
      }
    );
  };

  onPageChange = event => {
    if (!event.target.text) return;

    const pageNo = parseInt(event.target.text);

    if (pageNo) {
      this.setState(
        {
          pageNo: pageNo
        },
        () => {
          this.fetchNew();
        }
      );
    }
  };

  onFilterCheckedChange = event => {
    const index = event.target.name.replace("filter-", "");
    let newChecked = this.state.filterChecked;
    newChecked[index] = event.target.checked;
    this.setState(
      {
        filterChecked: newChecked
      },
      () => {
        this.fetchNew();
      }
    );
  };

  onFilterTextChange = text => {
    this.setState(
      {
        filterText: text,
        pageNo: 1,
        maxPage: 1
      },
      () => {
        this.fetchNew();
      }
    );
  };

  onVerifyClick = peaId => {
    this.props.history.push(`/customers/verify/${peaId}`);
  };

  onEditClick = peaId => {
    this.props.history.push(`/customers/edit/${peaId}`);
  };

  onDeleteClick = peaId => {
    console.log(peaId);
    // this.props.history.push(`/customers/verify/${peaId}`);
  };

  columns = [
    { text: "ลำดับ", dataField: "index", valign: "true" },
    { text: "ชื่อ-สกุล", dataField: "name", canSearch: true },
    {
      text: "หมายเลขผู้ใช้ไฟ",
      dataField: "peaId",
      valign: "true",
      canSearch: true
    },
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
      perPages,
      filterChecked,
      filters
    } = this.state;
    return (
      <Fragment>
        <ScrollPositionManager />
        <DataTable
          filterPlaceholder="ค้นหาชื่อ หรือ รหัสผู้ใช้ไฟ CA"
          columns={this.columns}
          data={customerTranslate}
          maxPage={maxPage}
          pageNo={pageNo}
          onNextPage={this.onNextPage}
          onPrevPage={this.onPrevPage}
          onPageChange={this.onPageChange}
          onPerPageChange={this.onPerPageChange}
          onVerify={this.onVerifyClick}
          onEdit={this.onEditClick}
          onDelete={this.onDeleteClick}
          perPage={perPage}
          perPages={perPages}
          filters={filters}
          filterChecked={filterChecked}
          onFilterCheckedChange={this.onFilterCheckedChange}
          filterTextChange={this.onFilterTextChange}
          // redirectTo={"/customers"}
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

export default withRouter(connect(mapStateToProps)(ListCustomer));
