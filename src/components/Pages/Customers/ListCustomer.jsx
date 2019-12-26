import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { customerActions } from "../../../actions";
import { translateCustomer } from "../../../helpers";

import {
  FaTrash,
  FaCheck,
  FaEdit,
  FaPrint,
  FaInfoCircle,
  FaGrimace
} from "react-icons/fa";
import { ModalConfirm } from "../../Modals";
import { DataTable } from "../../DataTable";

const filters = [
  { text: "G1", wars: ["ภายในประเทศ", "เวียดนาม", "เกาหลี"] },
  {
    text: "G2",
    wars: ["เหรียญชัยสมรภูมิ", "เอเชียบูรพา", "อินโดจีน", "ฝรั่งเศส"]
  }
];

const columns = [
  { text: "#", dataField: "index", valign: "true", style: { width: "4%" } },
  {
    text: "ลำดับ",
    dataField: "seq",
    valign: "true",
    style: { width: "4%" },
    canSearch: true
  },
  {
    text: "ชื่อ-สกุล",
    dataField: "name",
    canSearch: true,
    style: { width: "16%" }
  },
  {
    text: "หมายเลขผู้ใช้ไฟฟ้า",
    dataField: "peaId",
    valign: "true",
    canSearch: true
  },
  { text: "ที่อยู่", dataField: "address" },
  { text: "สงคราม", dataField: "war", valign: "true" },
  {
    text: "เลขทหาร",
    dataField: "soldierNo",
    valign: "true",
    style: { width: "8%" }
  },
  // { text: "ได้รับสิทธิ์วันที่", dataField: "privilegeDate", valign: "true" },
  { text: "กรณีเป็น", dataField: "authorize", valign: "true" },
  { text: "วันที่มาแสดงตน", dataField: "appearDate", valign: "true" }
];

class ListCustomer extends Component {
  state = {
    page: 1,
    pages: 0,
    limit: 10,
    perPages: [10, 20, 50, 100],
    wars: "",
    filterText: "",
    filterChecked: [true, true],
    confirmDelete: false,
    confirmDeleteText: "",
    confirmDeletePeaId: "",
    translated: []
  };

  tools = [
    {
      overlaytext: "พิมพ์",
      icon: <FaPrint />,
      key: "print",
      onclick: peaId => this.onPrintClick(peaId)
    },
    {
      overlaytext: "แสดงข้อมูล",
      icon: <FaInfoCircle />,
      onclick: peaId => this.onViewClick(peaId),
      key: "view"
    },
    {
      overlaytext: "แสดงตน",
      icon: <FaGrimace />,
      key: "verify",
      onclick: peaId => this.onVerifyClick(peaId)
    },
    {
      variable: "currentYearApproved",
      overlaytext: "อนุมัติ",
      icon: <FaCheck />,
      key: "approve",
      onclick: peaId => this.onApproveClick(peaId)
    },
    {
      overlaytext: "แก้ไข",
      icon: <FaEdit />,
      onclick: peaId => this.onEditClick(peaId),
      key: "edit"
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
    this.fetchNew();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { customers, filterLoading, loading, error, status } = nextProps;
    const { limit } = this.state;

    if (filterLoading || loading || error) {
      return;
    }

    if (status === "deleted") {
      return this.fetchNew();
    }

    if (customers) {
      let page = 1;
      let pages = 1;
      let start = 0;
      if (customers.metadata) {
        page = (customers.metadata && parseInt(customers.metadata.page)) || 1;
        pages = (customers.metadata && parseInt(customers.metadata.pages)) || 1;
        start = page > 1 ? (page - 1) * limit : 0;
      }
      const translated =
        customers.customers &&
        customers.customers.map((customer, index) => {
          return {
            index: index + start + 1,
            ...translateCustomer(customer)
          };
        });

      return this.setState({
        page,
        pages,
        translated
      });
    }
    this.setState({
      page: 1,
      pages: 1,
      translated: []
    });
  }

  getWarFilter = () => {
    const { filterChecked } = this.state;
    return filterChecked.every(v => v === true)
      ? "*"
      : filterChecked
        .map((data, index) => {
          return data === true ? filters[index].wars.join() : null;
        })
        .filter(Boolean)
        .join() || "-";
  };

  fetchNew = () => {
    const { filterText, page, limit, wars } = this.state;

    if (filterText.toLowerCase().startsWith("g") && filterText.length > 1) {
      if (filterText.length > 3) {
        const sequenceFilter = filterText.substring(3);
        const sequenceWar = filterText.substring(1, 2);
        return this.props.getCustomerBySequence(sequenceWar, sequenceFilter);
      }

      if (parseInt(filterText.substring(1))) {
        return;
      }
    }
    if (filterText) {
      return this.props.getFilterCustomer(filterText, page, limit, wars);
    }
    this.props.getAllCustomer(page, limit, wars);
  };

  handlePerPageChange = value => {
    this.setState(
      {
        page: 1,
        limit: parseInt(value)
      },
      this.fetchNew
    );
  };

  handlePrevPage = () => {
    this.setState(
      {
        page: this.state.page > 1 ? this.state.page - 1 : 1
      },
      this.fetchNew
    );
  };

  handleNextPage = () => {
    this.setState(
      {
        page:
          this.state.page < this.state.pages
            ? this.state.page + 1
            : this.state.page
      },
      this.fetchNew
    );
  };

  handlePageChange = event => {
    if (!event.target.text) return;

    const page = parseInt(event.target.text);

    if (page) {
      this.setState(
        {
          page: page
        },
        this.fetchNew
      );
    }
  };

  handleFilterCheckedChange = event => {
    const index = event.target.name.replace("filter-", "");
    let newChecked = this.state.filterChecked;
    newChecked[index] = event.target.checked;

    this.setState(
      {
        filterChecked: newChecked,
        page: 1,
        wars: this.getWarFilter()
      },
      this.fetchNew
    );
  };

  handleFilterTextChange = e => {
    const filterText = e.target.value;
    this.setState(
      {
        filterText,
        page: 1
      },
      this.fetchNew
    );
  };

  handleClearFilterText = () => {
    this.setState(
      {
        sequenceFilter: 0,
        filterText: "",
        page: 1
      },
      this.fetchNew
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
    // this.fetchNew();
  };

  handleAddCustomer = () => {
    this.props.history.push("/customers/add");
  };

  onApproveClick = peaId => {

  }

  render() {
    const {
      pages,
      page,
      limit,
      perPages,
      filterChecked,
      filterText,
      confirmDelete,
      confirmDeleteText,
      translated
    } = this.state;

    const { filterLoading } = this.props;
    return (
      <Fragment>
        <DataTable
          filterPlaceholder="ค้นหาลำดับ/ชื่อ/รหัสผู้ใช้ไฟฟ้า(CA)"
          idKey="peaId"
          customValueKey="name"
          columns={columns}
          filters={filters}
          tools={this.tools}
          topButtons={this.topButtons}
          data={translated}
          page={page}
          pages={pages}
          limit={limit}
          perPages={perPages}
          filterChecked={filterChecked}
          filterLoading={filterLoading}
          filterText={filterText}
          onNextPage={this.handleNextPage}
          onPrevPage={this.handlePrevPage}
          onPageChange={this.handlePageChange}
          onPerPageChange={this.handlePerPageChange}
          onFilterCheckedChange={this.handleFilterCheckedChange}
          onFilterTextChange={this.handleFilterTextChange}
          onClearFilterText={this.handleClearFilterText}
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
    customers: { customers, filterLoading, loading, error, status }
  } = state;
  return {
    customers,
    filterLoading,
    loading,
    error,
    status
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAllCustomer: (page, limit, war) =>
      dispatch(customerActions.getAll(page, limit, war)),
    getFilterCustomer: (filter, page, limit, war) =>
      dispatch(customerActions.getFilter(filter, page, limit, war)),
    getCustomerBySequence: (war, seq) =>
      dispatch(customerActions.getBySequence(war, seq)),
    removeCustomer: peaId => dispatch(customerActions.remove(peaId))
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ListCustomer)
);
