import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import config from "../../config";
import { authHeader, handleFetchError, addressToString } from "../../helpers";

// import ScrollPositionManager from "../../helpers/scroll-mamager";
import { ModalConfirm, ModalStatus } from "../Modals";
import { DataTable } from "../DataTable";

class ListCustomer extends Component {
  state = {
    pageNo: 1,
    maxPage: 0,
    perPage: 10,
    perPages: [10, 20, 50, 100],
    customers: [],
    // customers: [],
    filterText: "",
    filterChecked: [true, true],
    filters: [
      { text: "G1", wars: ["ภายในประเทศ", "เวียดนาม", "เกาหลี"] },
      { text: "G2", wars: ["เอเชียบูรพา", "อินโดจีน", "ฝรั่งเศส"] }
    ],
    confirmDelete: false,
    confirmDeleteText: "",
    confirmDeletePeaId: "",
    statusModal: true,
    statusModalState: "getting",
    statusModalFailText: ""
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

    fetch(
      `${
        config.apiUrl
      }/api/customers/all?war=${this.getWarFilter()}&page=${pageNo}&limit=${perPage}`,
      reqConf
    )
      .then(handleFetchError)
      .then(rep => {
        if (rep.status === 204) {
          this.setState({
            customers: [],
            pageNo: 1,
            maxPage: 1,
            statusModal: false
          });
          return;
        }
        // if (rep.status === 200) {
        return rep.json().then(result => {
          const pages = parseInt(result.metadata.pages);
          const page = parseInt(result.metadata.page);
          const startNumber = page > 1 ? (page - 1) * perPage : 0;
          this.setState({
            statusModal: false,
            maxPage: pages,
            pageNo: page,
            customers: result.customers.map((key, index) => {
              return {
                index: startNumber + index + 1,
                name: `${key.title} ${key.firstName} ${key.lastName}`,
                peaId: key.peaId,
                address: addressToString(key.address),
                authorize: key.authorize,
                soldierNo: key.soldierNo,
                war: key.war
              };
            })
          });
        });
        // }
        // this.setState({
        //   statusModal: false
        // });
      })
      .catch(() => {
        this.setState({
          statusModal: true,
          statusModalState: "getfail",
          statusModalFailText: "ไม่สามารถติดต่อเซิฟเวอร์ได้"
        });
        // console.log(err);
      });
  };

  fillCustomer = () => {
    const { pageNo, perPage, filterText } = this.state;
    const reqConf = {
      method: "GET",
      headers: authHeader()
    };

    fetch(
      `${
        config.apiUrl
      }/api/customers/filter/${filterText}?war=${this.getWarFilter()}&page=${pageNo}&limit=${perPage}`,
      reqConf
    )
      .then(handleFetchError)
      .then(rep => {
        if (rep.status === 204) {
          this.setState({
            customers: [],
            pageNo: 1,
            maxPage: 1,
            statusModal: false
          });
          return;
        }
        return rep.json().then(result => {
          const page = (result.metadata && parseInt(result.metadata.page)) || 1;
          const pages =
            (result.metadata && parseInt(result.metadata.pages)) || 1;

          const startNumber = page > 1 ? (page - 1) * perPage : 0;

          this.setState({
            statusModal: false,
            maxPage: pages,
            pageNo: page,
            customers:
              (result.customers &&
                result.customers.map((key, index) => {
                  return {
                    index: startNumber + index + 1,
                    name: `${key.title} ${key.firstName} ${key.lastName}`,
                    peaId: key.peaId,
                    address: addressToString(key.address),
                    authorize: key.authorize,
                    soldierNo: key.soldierNo,
                    war: key.war
                  };
                })) ||
              []
          });
        });
      })
      .catch(() => {
        this.setState({
          statusModal: true,
          statusModalState: "getfail",
          statusModalFailText: "ไม่สามารถติดต่อเซิฟเวอร์ได้"
        });
      });
  };

  deleteCustomer = peaId => {
    const reqConf = {
      method: "DELETE",
      headers: authHeader()
    };
    return fetch(`${config.apiUrl}/api/customers/${peaId}`, reqConf)
      .then(handleFetchError)
      .then(response => {
        if (response.status === 200) {
          response.json().then(result => {
            this.setState({
              statusModalState: "deleted"
            });
          });
        }

        setTimeout(() => {
          this.setState({
            statusModal: false
          });
          this.fetchNew();
        }, config.statusShowTime);
      })
      .catch(() => {
        this.setState({
          statusModalState: "deleteFail",
          statusModalFailText: "ไม่สามารถติดต่อเซิฟเวอร์ได้"
        });
        setTimeout(() => {
          this.setState({
            statusModal: false
          });
          this.fetchNew();
        }, config.statusShowTime);
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
        perPage: parseInt(value)
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
        filterChecked: newChecked,
        pageNo: 1
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
    if (!peaId) return;

    this.setState({
      confirmDelete: true,
      confirmDeleteText: peaId,
      confirmDeletePeaId: peaId
    });
    // this.props.history.push(`/customers/verify/${peaId}`);
  };

  handleDeleteModalClose = () => {
    this.setState({
      confirmDelete: false
    });
  };

  handleConfirmClick = () => {
    this.setState({
      confirmDelete: false,
      statusModal: true,
      statusModalState: "deleting"
    });
    this.deleteCustomer(this.state.confirmDeletePeaId);

    // console.log(this.state.confirmDeletePeaId);
  };

  render() {
    // console.log(this.props);
    const {
      customers,
      maxPage,
      pageNo,
      perPage,
      perPages,
      filterChecked,
      filters,
      confirmDelete,
      confirmDeleteText,
      statusModal,
      statusModalState,
      statusModalFailText
    } = this.state;
    return (
      <Fragment>
        {/* <ScrollPositionManager /> */}
        <DataTable
          filterPlaceholder="ค้นหาชื่อ หรือ รหัสผู้ใช้ไฟ CA"
          columns={this.columns}
          data={customers}
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
        <ModalConfirm
          show={confirmDelete}
          onHide={this.handleDeleteModalClose}
          confirm={this.handleConfirmClick}
          status="delete"
          confirmtext={confirmDeleteText}
        />
        <ModalStatus
          show={statusModal}
          status={statusModalState}
          failtext={statusModalFailText}
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
