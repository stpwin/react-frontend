import React, { Component, Fragment } from "react";

import { ButtonToolbar, Button, Row, Col, Spinner } from "react-bootstrap";

import ReactToPrint from "react-to-print";

import { getCustomerByPeaId } from "../../../helpers";

import CustomerPrintData from "../../Customer/Print";

class PrintCustomer extends Component {
  state = {
    customer: null
  };
  componentDidMount() {
    const { peaId } = this.props;
    // console.log(peaId);
    if (!peaId) return;
    getCustomerByPeaId(peaId).then(data => {
      this.setState({
        customer: data
      });
      // console.log(data);
    });
  }

  printRef = {};
  toPrintRef = {};

  setPrintRef = ref => {
    this.printRef = ref;
  };

  setToPrintRef = ref => {
    this.toPrintRef = ref;
  };

  handlePrint = () => {
    this.printRef.handlePrint();
  };

  handleBack = () => {
    this.props.history.goBack();
  };

  render() {
    const { customer } = this.state;
    return (
      <Fragment>
        <Row>
          <Col className='text-center'>
            <ButtonToolbar>
              <Button
                variant='outline-primary'
                className='pea-color'
                onClick={this.handlePrint}
              >
                พิมพ์
              </Button>
              <Button
                variant='outline-secondary'
                className='pea-color'
                onClick={this.handleBack}
              >
                กลับ
              </Button>
            </ButtonToolbar>
          </Col>
        </Row>
        {customer ? (
          <Fragment>
            <ReactToPrint
              ref={this.setPrintRef}
              trigger={() => <p></p>}
              content={() => this.toPrintRef}
            />
            <CustomerPrintData
              ref={this.setToPrintRef}
              peaId={this.props.peaId}
              customer={customer}
            />
          </Fragment>
        ) : (
          <div className='text-center mt-5'>
            <Spinner animation='border'></Spinner>
          </div>
        )}
      </Fragment>
    );
  }
}

export default PrintCustomer;
