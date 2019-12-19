import React, { Component, Fragment } from "react";

import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { Nav, Navbar } from "react-bootstrap";

class Navigation extends Component {
  render() {
    const { user, loggedIn } = this.props;
    return (
      <Navbar expand="md">
        <Navbar.Brand
          className="text-white"
          style={{ cursor: "pointer" }}
          href=""
          onClick={() => this.props.history.push("/")}
        >
          PEA WVPMS
        </Navbar.Brand>
        {loggedIn ? (
          <Fragment>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link
                  className="text-white"
                  href=""
                  onClick={() => this.props.history.push("/customers")}
                >
                  จัดการข้อมูลลูกค้า
                </Nav.Link>
                {user.role === "administrator" ? (
                  <Nav.Link
                    className="text-white"
                    href=""
                    onClick={() => this.props.history.push("/users")}
                  >
                    จัดการผู้ใช้งาน
                  </Nav.Link>
                ) : null}
              </Nav>

              <Navbar.Text className="text-warning">
                ผู้ใช้งาน: {user.displayName} ({user.role})
              </Navbar.Text>

              <Nav.Link
                className="text-white"
                href=""
                onClick={() => this.props.history.push("/login")}
              >
                ออกจากระบบ
              </Nav.Link>
            </Navbar.Collapse>
          </Fragment>
        ) : null}
      </Navbar>
    );
  }
}

function mapStateToProps(state) {
  const {
    authentication: { user, loggedIn }
  } = state;
  return {
    user,
    loggedIn
  };
}

export default withRouter(connect(mapStateToProps)(Navigation));
