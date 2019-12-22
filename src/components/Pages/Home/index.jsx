import React, { Component, Fragment } from "react";
import "./home.css";

import { Container } from "react-bootstrap"

import SmartSearch from "../../SmartSearch";

export class Home extends Component {
  render() {
    return (
      <Fragment>
        <div className="parallax">
          <div className="parallax__background"></div>
          <div className="parallax__overlay"></div>
        </div>
        <Container fluid>
          <div className="parallax__content">
            <SmartSearch />
          </div>
        </Container>
      </Fragment>
    );
  }
}

export default Home;
