import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { customerActions } from "../../../actions";
import { translateCustomer } from "../../../helpers";

import moment from "moment";
import "moment/locale/th";

import {
  FaTrash,
  FaCheck,
  FaEdit,
  FaPrint,
  FaExternalLinkAlt
} from "react-icons/fa";
import { ModalConfirm } from "../../Modals";
import { DataTable } from "../../DataTable";

class ListCustomer extends Component {
  state = {
    page: 1,
    pages: 0,
    limit: 10,
    wars: "",
    perPages: [10, 20, 50, 100],

    filterText: "",
    filterChecked: [true, true],

    confirmDelete: false,
    confirmDeleteText: "",
    confirmDeletePeaId: "",

    translated: []
  };

  filters = [
    { text: "G1", wars: ["ภายในประเทศ", "เวียดนาม", "เกาหลี"] },
    { text: "G2", wars: ["เอเชียบูรพา", "อินโดจีน", "ฝรั่งเศส"] }
  ];

  columns = [
    { text: "ลำดับ", dataField: "index", valign: "true" },
    { text: "ชื่อ-สกุล", dataField: "name", canSearch: true },
    {
      text: "หมายเลขผู้ใช้ไฟฟ้า",
      dataField: "peaId",
      valign: "true",
      canSearch: true
    },
    { text: "ที่อยู่", dataField: "address" },
    { text: "ลดสิทธิ์สงคราม", dataField: "war", valign: "true" },
    { text: "บัตรประจำตัวเลขที่", dataField: "soldierNo", valign: "true" },
    // { text: "ได้รับสิทธิ์วันที่", dataField: "privilegeDate", valign: "true" },
    { text: "กรณีเป็น", dataField: "authorize", valign: "true" },
    { text: "วันที่มาแสดงตน", dataField: "appearDate", valign: "true" }
  ];

  tools = [
    {
      overlaytext: "พิมพ์",
      icon: <FaPrint />,
      key: "print",
      onclick: peaId => this.onPrintClick(peaId)
    },
    {
      overlaytext: "ยืนยันสิทธิ์",
      icon: <FaCheck />,
      key: "verify",
      onclick: peaId => this.onVerifyClick(peaId)
    },
    {
      overlaytext: "แก้ไข",
      icon: <FaEdit />,
      onclick: peaId => this.onEditClick(peaId),
      key: "edit"
    },
    {
      overlaytext: "แสดงข้อมูล",
      icon: <FaExternalLinkAlt />,
      onclick: peaId => this.onViewClick(peaId),
      key: "view"
    },
    {
      overlaytext: "ลบ",
      icon: <FaTrash />,
      onclick: (peaId, customValue) => this.onDeleteClick(peaId, customValue),
      key: "delete",
      customValue: true
    }
  ];

  topButtons = [
    {
      text: "เพิ่มลูกค้า",
      onClick: () => this.handleAddCustomer(),
      key: "createCustomer"
    }
  ];

  UNSAFE_componentWillMount() {
    moment.locale("th");
    this.fetchNew();
  }

  getWarFilter = () => {
    const { filterChecked } = this.state;
    return filterChecked.every(v => v === true)
      ? "*"
      : filterChecked
        .map((data, index) => {
          return data === true ? this.filters[index].wars.join() : null;
        })
        .filter(Boolean)
        .join() || "-";
  };

  fetchNew = () => {
    const { filterText, page, limit, wars } = this.state;
    if (filterText) {
      this.props.getFilterCustomer(filterText, page, limit, wars);
    } else {
      this.props.getAllCustomer(page, limit, wars);
    }
  };

  onPerPageChange = value => {
    this.setState(
      {
        page: 1,
        limit: parseInt(value)
      },
      () => {
        this.fetchNew();
      }
    );
  };

  onPrevPage = () => {
    this.setState(
      {
        page: this.state.page > 1 ? this.state.page - 1 : 1
      },
      () => {
        this.fetchNew();
      }
    );
  };

  onNextPage = () => {
    this.setState(
      {
        page:
          this.state.page < this.state.pages
            ? this.state.page + 1
            : this.state.page
      },
      () => {
        this.fetchNew();
      }
    );
  };

  onPageChange = event => {
    if (!event.target.text) return;

    const page = parseInt(event.target.text);

    if (page) {
      this.setState(
        {
          page: page
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
        page: 1,
        wars: this.getWarFilter()
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
        page: 1,
        pages: 1
      },
      () => {
        this.fetchNew();
      }
    );
  };

  onViewClick = peaId => {
    this.props.history.push(`/customers/view/${peaId}`);
  };

  onVerifyClick = peaId => {
    this.props.history.push(`/customers/verify/${peaId}`);
  };

  onEditClick = peaId => {
    this.props.history.push(`/customers/edit/${peaId}`);
  };

  onDeleteClick = (peaId, customValue) => {
    if (!peaId) return;

    this.setState({
      confirmDelete: true,
      confirmDeleteText: `${peaId}\n${customValue}`,
      confirmDeletePeaId: peaId
    });
  };

  onPrintClick = peaId => {
    this.props.history.push(`/customers/print/${peaId}`);
  };

  handleDeleteModalClose = () => {
    this.setState({
      confirmDelete: false
    });
  };

  handleConfirmClick = () => {
    this.setState({
      confirmDelete: false
    });
    this.props.removeCustomer(this.state.confirmDeletePeaId);
    this.fetchNew();
  };

  // handleStatusClose = () => {
  //   this.setState({
  //     statusModal: false
  //   });
  // };

  handleAddCustomer = () => {
    this.props.history.push("/customers/add");
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { customers } = nextProps;
    const { limit } = this.state;
    if (customers) {
      if (customers.metadata) {
        const page =
          (customers.metadata && parseInt(customers.metadata.page)) || 1;
        const pages =
          (customers.metadata && parseInt(customers.metadata.pages)) || 1;
        const start = page > 1 ? (page - 1) * limit : 0;



        const translated =
          customers.customers &&
          customers.customers.map((customer, index) => {
            const appearDate = customer.verifies && customer.verifies.length > 0 &&
              customer.verifies[0].appearDate &&
              new Date(customer.verifies[0].appearDate).toLocaleDateString("th-TH", {
                year: "numeric",
                month: "long",
                day: "numeric"
              });
            return {
              index: index + start + 1,
              appearDate,
              ...translateCustomer(customer)
            };
          });

        this.setState({
          page,
          pages,
          translated
        });
      }
    }
  }

  render() {
    const {
      pages,
      page,
      perPages,
      limit,
      filterChecked,
      confirmDelete,
      confirmDeleteText,
      translated
    } = this.state;

    return (
      <Fragment>
        <DataTable
          filterPlaceholder="ค้นหาชื่อ หรือ รหัสผู้ใช้ไฟฟ้า(CA)"
          columns={this.columns}
          data={translated}
          pages={pages}
          page={page}
          onNextPage={this.onNextPage}
          onPrevPage={this.onPrevPage}
          onPageChange={this.onPageChange}
          onPerPageChange={this.onPerPageChange}
          limit={limit}
          perPages={perPages}
          filters={this.filters}
          filterChecked={filterChecked}
          onFilterCheckedChange={this.onFilterCheckedChange}
          filterTextChange={this.onFilterTextChange}
          tools={this.tools}
          idKey="peaId"
          customValueKey="name"
          topButtons={this.topButtons}
        />
        <ModalConfirm
          show={confirmDelete}
          onHide={this.handleDeleteModalClose}
          confirm={this.handleConfirmClick}
          status="delete"
          confirmtext={confirmDeleteText}
        />
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  const {
    customers: { customers }
  } = state;
  return {
    customers
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAllCustomer: (page, limit, war) =>
      dispatch(customerActions.getAll(page, limit, war)),
    getFilterCustomer: (filter, page, limit, war) =>
      dispatch(customerActions.getFilter(filter, page, limit, war)),
    removeCustomer: peaId => dispatch(customerActions.remove(peaId))
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ListCustomer)
);
