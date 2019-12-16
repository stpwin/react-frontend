import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { userActions } from "../../../actions";

import moment from "moment";
import "moment/locale/th";

import { FaTrash, FaEdit } from "react-icons/fa";
import { DataTable } from "../../DataTable";
import { ModalConfirm } from "../../Modals";

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

  columns = [
    { text: "ลำดับ", dataField: "index", valign: "true" },
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
      text: "สร้างผู้ใช้งาน",
      onClick: () => this.handleCreateUser(),
      key: "createUser"
    }
  ];

  UNSAFE_componentWillMount() {
    moment.locale("th");
    this.fetchNew();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      users: { data }
    } = nextProps;

    if (data && data.metadata) {
      let { page, pages } = data.metadata;
      page = parseInt(page);
      return this.setState({
        page: page,
        pages: pages
      });
    }

    this.setState({
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

  handleEdit = uid => {
    if (!uid) return;
    this.props.history.push(`/users/edit/${uid}`);
  };

  handleChangePassword = uid => {
    if (!uid) return;
    this.props.history.push(`/users/change-password/${uid}`);
  };

  handleConfirmClick = () => {
    const { selectedUid } = this.state;
    console.log("Confirmed UID:", selectedUid);
    this.handleConfirmClose();
    if (!selectedUid) return;

    this.props.removeUser(selectedUid);
    this.fetchNew();
  };

  handleConfirmClose = () => {
    this.setState({
      modalConfirmShow: false
    });
  };

  handleCreateUser = () => {
    this.props.history.push("/users/create");
  };

  handleFilterChange = text => {
    this.setState(
      {
        filterText: text,
        page: 1,
        pages: 1
      },
      this.fetchNew
    );
  };

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
      modalConfirmShow,
      confirmtext
    } = this.state;

    const {
      users: { data }
    } = this.props;

    const startNumber = page > 1 ? (page - 1) * limit : 0;
    const users =
      data &&
      data.users &&
      data.users.map((userItem, index) => {
        return {
          uid: userItem._id,
          index: startNumber + index + 1,
          displayName: userItem.displayName,
          username: userItem.username,
          role: userItem.role,
          description: userItem.description,
          createdAt: moment(userItem.createdAt).format("lll")
        };
      });
    return (
      <Fragment>
        <DataTable
          columns={this.columns}
          data={users}
          pages={pages}
          page={page}
          onNextPage={this.handleNextPage}
          onPrevPage={this.handlePrevPage}
          onPageChange={this.handlePageChange}
          onPerPageChange={this.handlePerPageChange}
          filterTextChange={this.handleFilterChange}
          limit={limit}
          perPages={perPages}
          filterPlaceholder={"ค้นหาชื่อ หรือ Username"}
          tools={this.tools}
          idKey="uid"
          customValueKey="displayName"
          topButtons={this.topButtons}
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
  const { users } = state;
  return {
    users
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
