import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { userActions } from "../../../actions";
import config from "../../../config";

import moment from "moment";
import "moment/locale/th";

import { FaTimes, FaEdit } from "react-icons/fa";

// import { Fragment } from "react-bootstrap";
import { DataTable } from "../../DataTable";
import { ModalStatus, ModalConfirm } from "../../Modals";

class ListUsers extends Component {
  state = {
    pageNo: 0,
    maxPage: 0,
    perPage: 10,
    perPages: [10, 20, 50, 100],
    users: [],
    modalStatusShow: false,
    modalStatusState: "getting",
    modalConfirmShow: false,
    selectedUid: "",
    confirmtext: ""
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
    { text: "สร้างเมื่อง", dataField: "createdAt", valign: "true" }
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
      icon: <FaTimes />,
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
    this.props.dispatch(userActions.getAll());
    moment.locale("th");
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    // console.log(nextProps);
    const { users, user } = nextProps;
    if (users && users.metadata) {
      const page = users.metadata.page;
      const pages = users.metadata.pages;
      this.setState({
        pageNo: page,
        maxPage: pages,
        users:
          users.users &&
          users.users
            .filter(userFilter => {
              return user.username !== userFilter.username;
            })
            .map((userItem, index) => {
              console.log(userItem._id);
              if (user.username === userItem.username) return null;
              return {
                uid: userItem._id,
                index: index + 1,
                displayName: userItem.displayName,
                username: userItem.username,
                role: userItem.role,
                createdAt: moment(userItem.createdAt).format("lll")
              };
            })
      });
    }
  }

  handleRemove = (userId, text) => {
    if (!userId) return;
    this.setState({
      selectedUid: userId,
      confirmtext: text,
      modalConfirmShow: true
    });
  };

  handleEdit = userId => {
    if (!userId) return;
    this.props.history.push(`/users/edit?uid=${userId}`);
  };

  handleConfirmClick = () => {
    console.log("Confirmed UID:", this.state.selectedUid);
    this.handleConfirmClose();
    if (!this.state.selectedUid) return;
    this.setState({
      modalStatusShow: true,
      modalStatusState: "deleting"
    });
    setTimeout(() => {
      this.setState({
        modalStatusState: "deleted"
      });
      setTimeout(() => {
        this.setState({
          modalStatusShow: false
        });
      }, config.statusShowTime);
    }, config.statusShowTime);
  };

  handleConfirmClose = () => {
    this.setState({
      modalConfirmShow: false
    });
  };

  handleCreateUser = () => {
    console.log("Create User");
    this.props.history.push("/users/create");
  };

  render() {
    const {
      pageNo,
      maxPage,
      perPage,
      perPages,
      users,
      modalStatusShow,
      modalStatusState,
      modalConfirmShow,
      confirmtext
    } = this.state;
    // const { users } = this.props;

    return (
      <Fragment>
        <DataTable
          columns={this.columns}
          data={users}
          maxPage={maxPage}
          pageNo={pageNo}
          onNextPage={this.onNextPage}
          onPrevPage={this.onPrevPage}
          onPageChange={this.onPageChange}
          onPerPageChange={this.onPerPageChange}
          perPage={perPage}
          perPages={perPages}
          filterPlaceholder={"ค้นหาชื่อ หรือ Username"}
          tools={this.tools}
          idKey="uid"
          customValueKey="displayName"
          topButtons={this.topButtons}
        />
        <ModalStatus show={modalStatusShow} status={modalStatusState} />
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

function mapStateToProps(state) {
  const { users, authentication } = state;
  const { user } = authentication;
  // console.log(users);
  return {
    user,
    users
  };
}

export default withRouter(connect(mapStateToProps)(ListUsers));
