import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { userActions } from "../../../actions";
import config from "../../../config";
import { authHeader, handleFetchSuccessResponse } from "../../../helpers";

import moment from "moment";
import "moment/locale/th";

import { FaTrash, FaEdit } from "react-icons/fa";
import { DataTable } from "../../DataTable";
import { ModalStatus, ModalConfirm } from "../../Modals";

class ListUsers extends Component {
  state = {
    pageNo: 1,
    maxPage: 1,
    perPage: 10,
    perPages: [10, 20, 50, 100],
    users: [],
    modalStatusShow: true,
    status: "getting",
    failtext: "",
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
    // console.log("componentDidUpdate", this.props);
    const { users } = nextProps;

    if (users.error) {
      this.setState({
        status: "getfail",
        failtext: `${users.error}`
      });
      return;
    }

    if (users.loading) {
      return;
    }
    // console.log(users);
    if (users.metadata) {
      let { page, pages } = users.metadata;
      page = parseInt(page);
      const startNumber = page > 1 ? (page - 1) * this.state.perPage : 0;
      return this.setState({
        modalStatusShow: false,
        pageNo: page,
        maxPage: pages,
        users:
          users.users &&
          users.users
            // .filter(userFilter => {
            //   return user.username !== userFilter.username;
            // })
            .map((userItem, index) => {
              return {
                uid: userItem._id,
                index: startNumber + index + 1,
                displayName: userItem.displayName,
                username: userItem.username,
                role: userItem.role,
                description: userItem.description,
                createdAt: moment(userItem.createdAt).format("lll")
              };
            })
      });
    }

    this.setState({
      modalStatusShow: false,
      users: []
    });
  }

  fetchNew = () => {
    const { pageNo, perPage, filterText } = this.state;
    if (filterText) {
      this.props.getFilter(filterText, pageNo, perPage);
      // console.log("Hello");
      return;
    }
    this.props.getAll(pageNo, perPage);
    // console.log("Hello");
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

    this.setState({
      modalStatusShow: true,
      status: "deleting"
    });

    const reqConf = {
      method: "DELETE",
      headers: authHeader(),
      body: JSON.stringify({
        uid: selectedUid
      })
    };

    fetch(`${config.apiUrl}/api/users`, reqConf)
      .then(handleFetchSuccessResponse)
      .then(({ err, rep }) => {
        if (err) {
          this.setState({
            status: "deletefail",
            failtext: err
          });
          return;
        }

        this.setState(
          {
            status: "deleted",
            failtext: ""
          },
          this.fetchNew
        );
      })
      .catch(() => {
        this.setState({
          status: "deletefail",
          failtext: "ไม่สามารถติดต่อเซิร์ฟเวอร์ได้"
        });
      });
  };

  handleConfirmClose = () => {
    this.setState({
      modalConfirmShow: false
    });
  };

  handleStatusClose = () => {
    this.setState({
      modalStatusShow: false
    });
  };

  handleCreateUser = () => {
    // console.log("Create User");
    this.props.history.push("/users/create");
  };

  handleFilterChange = text => {
    this.setState(
      {
        filterText: text,
        pageNo: 1,
        maxPage: 1
      },
      this.fetchNew
    );
  };

  handlePerPageChange = perPage => {
    this.setState(
      {
        perPage: perPage
      },
      this.fetchNew
    );
    // console.log(perPage);
  };

  handlePageChange = event => {
    if (!event.target.text) return;

    const pageNo = parseInt(event.target.text);

    // console.log(pageNo);
    this.setState(
      {
        pageNo: pageNo
      },
      this.fetchNew
    );
  };

  handleNextPage = () => {
    this.setState(
      {
        pageNo:
          this.state.pageNo < this.state.maxPage
            ? this.state.pageNo + 1
            : this.state.pageNo
      },
      this.fetchNew
    );
  };

  handlePrevPage = () => {
    this.setState(
      {
        pageNo:
          this.state.pageNo > 2 ? this.state.pageNo - 1 : this.state.pageNo
      },
      this.fetchNew
    );
  };

  render() {
    const {
      pageNo,
      maxPage,
      perPage,
      perPages,
      users,
      modalStatusShow,
      status,
      modalConfirmShow,
      confirmtext,
      failtext
    } = this.state;
    // const { users } = this.props;

    return (
      <Fragment>
        <DataTable
          columns={this.columns}
          data={users}
          maxPage={maxPage}
          pageNo={pageNo}
          onNextPage={this.handleNextPage}
          onPrevPage={this.handlePrevPage}
          onPageChange={this.handlePageChange}
          onPerPageChange={this.handlePerPageChange}
          filterTextChange={this.handleFilterChange}
          perPage={perPage}
          perPages={perPages}
          filterPlaceholder={"ค้นหาชื่อ หรือ Username"}
          tools={this.tools}
          idKey="uid"
          customValueKey="displayName"
          topButtons={this.topButtons}
        />
        <ModalStatus
          show={modalStatusShow}
          status={status}
          onHide={this.handleStatusClose}
          failtext={failtext}
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
    // user,
    users
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getFilter: (filter, page, pages) =>
      dispatch(userActions.getFilter(filter, page, pages)),
    getAll: (page, pages) => dispatch(userActions.getAll(page, pages))
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ListUsers)
);
