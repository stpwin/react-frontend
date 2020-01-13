import React, { Fragment } from "react";

import { Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

const Navigation = ({ user, loggedIn }) => {
  return (
    <Navbar expand="md" fixed="top">
      <LinkContainer to="/">
        <Navbar.Brand style={{ cursor: "pointer" }}>PEA VPMS</Navbar.Brand>
      </LinkContainer>

      {loggedIn ? (
        <Fragment>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Item>
                <LinkContainer to="/customers">
                  <Nav.Link>จัดการข้อมูลลูกค้า</Nav.Link>
                </LinkContainer>
              </Nav.Item>

              {user.role === "administrator" ? (
                <Fragment>
                  <Nav.Item>
                    <LinkContainer to="/users">
                      <Nav.Link>จัดการผู้ใช้งาน</Nav.Link>
                    </LinkContainer>
                  </Nav.Item>
                  <Nav.Item>
                    <LinkContainer to="/settings/database">
                      <Nav.Link>จัดการฐานข้อมูล</Nav.Link>
                    </LinkContainer>
                  </Nav.Item>
                </Fragment>
              ) : null}
            </Nav>

            <Nav.Item>
              <Navbar.Text className="text-warning">
                ผู้ใช้งาน: {user.displayName} ({user.role})
              </Navbar.Text>
            </Nav.Item>
            <Nav.Item>
              <LinkContainer to="/login">
                <Nav.Link>ออกจากระบบ</Nav.Link>
              </LinkContainer>
            </Nav.Item>
          </Navbar.Collapse>
        </Fragment>
      ) : null}
    </Navbar>
  );
};

export default Navigation;
