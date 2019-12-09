import React, { Component, Fragment } from "react";

import { Button } from "react-bootstrap";

import ReactToPrint from "react-to-print";

import PrintPage from "../../Customer/PrintPage";

class PrintCustomer extends Component {
  toPrintRef = {};
  setToPrintRef = ref => {
    this.toPrintRef = ref;
  };

  render() {
    return (
      <Fragment>
        <ReactToPrint
          trigger={() => (
            <Button variant="outline-primary" className="pea-color">
              Print
            </Button>
          )}
          content={() => this.toPrintRef}
        />
        <PrintPage ref={this.setToPrintRef} />
        {/* <Container className="print-page-bg">
          
        </Container> */}
      </Fragment>
    );
  }
}

export default PrintCustomer;
