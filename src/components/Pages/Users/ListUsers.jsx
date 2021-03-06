import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { userActions } from "../../../actions";

import { toLocalDate } from "../../../helpers";

import { FaTrash, FaEdit } from "react-icons/fa";
import { DataTable } from "../../DataTable";
import { ModalConfirm } from "../../Modals";

const columns = [
  { text: "#", dataField: "index", valign: "true", style: { width: "4%" } },
  { text: "ชื่อ", dataField: "displayName", valign: "true", canSearch: true },
  {
    text: "Username",
    dataField: "username",
    valign: "true",
    canSearch: true
  },
  { text: "ระดับ", dataField: "role", valign: "true" },
  { text: "สร้างเมื่อง", dataField: "createdAt", valign: "true" },
  { text: "รายละเอียด", dataField: "description", valign: "true" }
];

class ListUsers extends Component {
  state = {
    page: 1,
    pages: 1,
    limit: 10,
    perPages: [10, 20, 50, 100],

    modalConfirmShow: false,
    selectedUid: "",
    confirmtext: "",
    filterText: ""
  };
  tools = [
    {
      overlaytext: "แก้ไข",
      icon: <FaEdit />,
      onclick: userId => this.handleEdit(userId),
      key: "edit"
    },
    {
      overlaytext: "ลบ",
      icon: <FaTrash />,
      onclick: (userId, customValue) => this.handleRemove(userId, customValue),
      key: "delete",
      customValue: true
    }
  ];

  topButtons = [
    {
      text: "เพิ่มผู้ใช้",
      onClick: () => this.handleCreateUser(),
      key: "createUser"
    }
  ];

  UNSAFE_componentWillMount() {
    this.fetchNew();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      users: { data, loading }
    } = nextProps;
    if (loading) {
      return
    }
    if (data) {
      if (data.metadata) {
        let { page, pages } = data.metadata;
        page = parseInt(page);
        return this.setState({
          page: page,
          pages: pages
        });
      }
      // data.status === "user_create_success" || data.status === "user_update_success" ||
      if (data.status === "user_delete_success") {
        this.fetchNew();
      }
    }

    this.setState({
      page: 1,
      pages: 1,
      users: []
    });
  }

  fetchNew = () => {
    const { page, limit, filterText } = this.state;
    if (filterText) {
      this.props.getFilterUsers(filterText, page, limit);
      return;
    }
    this.props.getAllUsers(page, limit);
  };

  handleRemove = (uid, text) => {
    if (!uid) return;
    this.setState({
      selectedUid: uid,
      confirmtext: text,
      modalConfirmShow: true
    });
  };

  handleCreateUser = () => {
    this.props.history.push("/users/create");
  };

  handleEdit = uid => {
    if (!uid) return;
    this.props.history.push(`/users/edit/${uid}`);
  };

  handleConfirmClick = () => {
    const { selectedUid } = this.state;
    this.handleConfirmClose();
    if (!selectedUid) return;

    this.props.removeUser(selectedUid);

  };

  handleConfirmClose = () => {
    this.setState({
      modalConfirmShow: false
    });
  };

  handleFilterTextChange = e => {
    this.setState(
      {
        filterText: e.target.value,
        page: 1,
        // pages: 1
      },
      this.fetchNew
    );
  };

  handleClearFilterText = () => {
    this.setState(
      {
        filterText: "",
        page: 1,
        // pages: 1
      },
      this.fetchNew
    );
  }

  handlePerPageChange = limit => {
    this.setState(
      {
        limit: limit
      },
      this.fetchNew
    );
  };

  handlePageChange = event => {
    if (!event.target.text) return;

    this.setState(
      {
        page: parseInt(event.target.text)
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

  handlePrevPage = () => {
    this.setState(
      {
        page: this.state.page > 2 ? this.state.page - 1 : this.state.page
      },
      this.fetchNew
    );
  };

  render() {
    const {
      page,
      pages,
      limit,
      perPages,
      filterText,
      modalConfirmShow,
      confirmtext
    } = this.state;

    const {
      users: { data },
      filterLoading
    } = this.props;

    const start = page > 1 ? (page - 1) * limit : 0;
    const users =
      data &&
      data.users &&
      data.users.map((userItem, index) => {
        return {
          uid: userItem._id,
          index: start + index + 1,
          displayName: userItem.displayName,
          username: userItem.username,
          role: userItem.role,
          description: userItem.description,
          createdAt: toLocalDate(userItem.createdAt)
        };
      });
    return (
      <Fragment>
        <DataTable
          filterPlaceholder={"ค้นหาชื่อ หรือ Username"}
          customValueKey="displayName"
          idKey="uid"
          columns={columns}
          tools={this.tools}
          topButtons={this.topButtons}
          data={users}
          page={page}
          pages={pages}
          limit={limit}
          perPages={perPages}
          filterLoading={filterLoading}
          filterText={filterText}
          onNextPage={this.handleNextPage}
          onPrevPage={this.handlePrevPage}
          onPageChange={this.handlePageChange}
          onPerPageChange={this.handlePerPageChange}
          onFilterTextChange={this.handleFilterTextChange}
          onClearFilterText={this.handleClearFilterText}
        />
        <ModalConfirm
          show={modalConfirmShow}
          onHide={this.handleConfirmClose}
          confirm={this.handleConfirmClick}
          status="delete"
          confirmtext={confirmtext}
        />
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  const {
    users,
    users: { filterLoading }
  } = state;
  return {
    users,
    filterLoading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getFilterUsers: (filter, page, pages) =>
      dispatch(userActions.getFilter(filter, page, pages)),
    getAllUsers: (page, pages) => dispatch(userActions.getAll(page, pages)),
    removeUser: uid => dispatch(userActions.remove(uid))
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ListUsers)
);
