import React, { Component } from "react";
import { Container } from "react-bootstrap";
import { Row, Col } from "react-bootstrap";

export default class Footer extends Component {
  render() {
    return (
      <footer className="footer">
        <Container>
          <Row>
            <Col className="text-center" style={{ fontSize: "smaller" }}>
              <div className="text-muted font-weight-light text-monospace">
                Veterans Privilege Management System v
                {process.env.REACT_APP_VERSION} build{" "}
                {process.env.REACT_APP_BUILD}
              </div>
              {/* <div className="text-muted font-weight-light text-monospace"></div> */}
              <span className="text-muted text-monospace">
                Powered by Lampang Provincial Electricity Authority
              </span>
            </Col>
          </Row>
        </Container>
      </footer>
    );
  }
}
