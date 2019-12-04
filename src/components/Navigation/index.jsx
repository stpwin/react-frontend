import React, { Component, Fragment } from "react";

import { connect } from "react-redux";

import { Nav, Navbar } from "react-bootstrap";

class Navigation extends Component {
  render() {
    const { user } = this.props;
    return (
      <Navbar expand="md">
        <Navbar.Brand className="text-white" href="/">
          PEA WVPMS
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            {user ? (
              <React.Fragment>
                {/* <Nav.Link href='/'>หน้าแรก</Nav.Link> */}
                <Nav.Link className="text-white" href="/customers">
                  จัดการข้อมูลลูกค้า
                </Nav.Link>
                {user.role === "administrator" ? (
                  <Nav.Link className="text-white" href="/users">
                    จัดการผู้ใช้งาน
                  </Nav.Link>
                ) : null}
              </React.Fragment>
            ) : null}
          </Nav>
          {user ? (
            <Fragment>
              <Navbar.Text className="text-light">
                ผู้ใช้งาน: {user.displayName} {"  "}ระดับ: {user.role}
              </Navbar.Text>
            </Fragment>
          ) : null}

          <Nav.Link className="text-white" href="/login">
            {user ? "ออกจากระบบ" : ""}
          </Nav.Link>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

function mapStateToProps(state) {
  const { authentication } = state;
  const { user } = authentication;
  return {
    user
  };
}

export default connect(mapStateToProps)(Navigation);
