import React, { Component, Fragment } from "react";

import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap"

class Navigation extends Component {
  render() {
    const { user, loggedIn } = this.props;
    return (
      <Navbar expand="md" fixed="top">

        <LinkContainer to="/">
          <Navbar.Brand
            style={{ cursor: "pointer" }}
          >
            PEA WVPMS
        </Navbar.Brand>
        </LinkContainer>

        {loggedIn ? (
          <Fragment>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Item>
                  <LinkContainer to="/customers">
                    <Nav.Link
                    >
                      จัดการข้อมูลลูกค้า
                </Nav.Link >
                  </LinkContainer>

                </Nav.Item>

                {user.role === "administrator" ? (
                  <Nav.Item>
                    <LinkContainer to="/users">
                      <Nav.Link
                      >
                        จัดการผู้ใช้งาน
                  </Nav.Link >
                    </LinkContainer>

                  </Nav.Item>
                ) : null}
              </Nav>

              <Nav.Item>
                <Navbar.Text className="text-warning">
                  ผู้ใช้งาน: {user.displayName} ({user.role})
              </Navbar.Text>
              </Nav.Item>
              <Nav.Item>
                <LinkContainer to="/login">
                  <Nav.Link
                  >
                    ออกจากระบบ
              </Nav.Link>
                </LinkContainer>
              </Nav.Item>


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
