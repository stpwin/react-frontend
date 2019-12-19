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
  FaExternalLinkAlt
} from "react-icons/fa";
import { ModalConfirm } from "../../Modals";
import { DataTable } from "../../DataTable";

const filters = [
  { text: "G1", wars: ["ภายในประเทศ", "เวียดนาม", "เกาหลี"] },
  { text: "G2", wars: ["เอเชียบูรพา", "อินโดจีน", "ฝรั่งเศส"] }
];

const columns = [
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

class ListCustomer extends Component {
  constructor(props) {
    super(props);

    this.state = {
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

    this.fetchNew();
  }

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
            return {
              index: index + start + 1,
              ...translateCustomer(customer)
            };
          });

        this.setState({
          page,
          pages,
          translated
        });
      }
    } else {
      this.setState({
        page: 1,
        pages: 1,
        translated: []
      });
    }
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
    if (filterText) {
      this.props.getFilterCustomer(filterText, page, limit, wars);
    } else {
      this.props.getAllCustomer(page, limit, wars);
    }
  };

  handlePerPageChange = value => {
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

  handlePrevPage = () => {
    this.setState(
      {
        page: this.state.page > 1 ? this.state.page - 1 : 1
      },
      () => {
        this.fetchNew();
      }
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
      () => {
        this.fetchNew();
      }
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
        () => {
          this.fetchNew();
        }
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
      () => {
        this.fetchNew();
      }
    );
  };

  handleFilterTextChange = text => {
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

  handleAddCustomer = () => {
    this.props.history.push("/customers/add");
  };

  render() {
    const {
      pages,
      page,
      limit,
      perPages,
      filterChecked,
      confirmDelete,
      confirmDeleteText,
      translated
    } = this.state;

    const { filterLoading } = this.props;

    return (
      <Fragment>
        <DataTable
          filterPlaceholder="ค้นหาชื่อ หรือ รหัสผู้ใช้ไฟฟ้า(CA)"
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
          onNextPage={this.handleNextPage}
          onPrevPage={this.handlePrevPage}
          onPageChange={this.handlePageChange}
          onPerPageChange={this.handlePerPageChange}
          onFilterCheckedChange={this.handleFilterCheckedChange}
          filterTextChange={this.handleFilterTextChange}
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
    customers: { customers, filterLoading }
  } = state;
  return {
    customers,
    filterLoading
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
