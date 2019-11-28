import React, { Component } from "react";

import { connect } from "react-redux";
import { userActions } from "../../actions";

import {
  Nav,
  Navbar,
  NavDropdown
  // Form,
  // Button,
  // FormControl
} from "react-bootstrap";

class Navigation extends Component {
  render() {
    console.log(this.props);
    const user = localStorage.getItem("user");
    return (
      <Navbar bg="light" expand="md">
        <Navbar.Brand href="/">PEA WVPMS</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="/">หน้าแรก</Nav.Link>
            <Nav.Link href="/customers">จัดการข้อมูลลูกค้า</Nav.Link>
            <Nav.Link href="/users">จัดการผู้ใช้งาน</Nav.Link>
            {/* <NavDropdown title="แอดมิน" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">
                จัดการผู้ใช้งาน
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                จัดการข้อมูลลูกค้า
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown> */}
          </Nav>
          <Nav.Link href="/login">
            {user ? "ออกจากระบบ" : "เข้าสู่ระบบ"}
          </Nav.Link>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

function mapStateToProps(state) {
  const { users, authentication } = state;
  const { user } = authentication;
  return {
    user,
    users
  };
}

export default connect(mapStateToProps)(Navigation);
