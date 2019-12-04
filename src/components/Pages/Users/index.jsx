import React, { Component } from "react";
import { connect } from "react-redux";

import { userActions } from "../../../actions";

import moment from "moment";

import { Container } from "react-bootstrap";
import { DataTable } from "../../DataTable";
import { ModalStatus } from "../../Modals";

class Users extends Component {
  state = {
    pageNo: 0,
    maxPage: 0,
    perPage: 10,
    perPages: [10, 20, 50, 100],
    users: [],
    modalStatusShow: false,
    modalStatusState: "getting"
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
    { text: "สร้างเมื่อง", dataField: "createdAt", valign: "false" }
  ];

  UNSAFE_componentWillMount() {
    this.props.dispatch(userActions.getAll());
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    console.log(nextProps);
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
              if (user.username === userItem.username) return null;
              return {
                index: index + 1,
                displayName: userItem.displayName,
                username: userItem.username,
                role: userItem.role,
                createdAt: moment(userItem.createdAt).format("LLL")
              };
            })
      });
    }
  }

  handleRemove = userId => {};

  handleEdit = userId => {};

  render() {
    const {
      pageNo,
      maxPage,
      perPage,
      perPages,
      users,
      modalStatusShow,
      modalStatusState
    } = this.state;
    // const { users } = this.props;

    return (
      <Container>
        <h1 className="header-text text-center">จัดการผู้ใช้งาน</h1>
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
        />
        <ModalStatus show={modalStatusShow} status={modalStatusState} />
      </Container>
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

export default connect(mapStateToProps)(Users);
