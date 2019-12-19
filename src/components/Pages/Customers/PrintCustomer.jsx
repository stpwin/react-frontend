import React, { Component, Fragment } from "react";

import { connect } from "react-redux";
import { customerActions } from "../../../actions";
import { translateCustomer, toLocalDate } from "../../../helpers";

import ReactToPrint from "react-to-print";

import {
  ButtonToolbar,
  Button,
  Row,
  Col,
  Spinner,
  Form
} from "react-bootstrap";
import CustomerPrintData from "../../Customer/Print";

class PrintCustomer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      translated: {},
      verifies: [],
      verifyId: "",
      signature: null,
      appearDate: null
    };
    this.printRef = {};
    this.toPrintRef = {};
    const { peaId } = this.props;
    this.props.getCustomer(peaId);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { peaId } = this.props;
    const {
      customers: { customer, signature }
    } = nextProps;

    if (signature) {
      this.setState({
        signature
      });
    }

    if (customer) {
      const translated = translateCustomer(customer);
      this.props.getSignature(peaId, translated.lastVerifyId);
      this.setState({
        signature,
        verifies: customer.verifies || [],
        translated,
        verifyId: translated.lastVerifyId,
        appearDate: translated.appearDate
      });
    }
  }

  setPrintRef = ref => {
    this.printRef = ref;
  };

  setToPrintRef = ref => {
    this.toPrintRef = ref;
  };

  handlePrint = () => {
    this.printRef.handlePrint();
  };

  handleAppearDateChange = e => {
    const { peaId } = this.props;
    this.setState(
      {
        signature: null,
        verifyId: e.target.value,
        appearDate: e.target[e.target.selectedIndex].text
      },
      () => {
        this.props.getSignature(peaId, this.state.verifyId);
      }
    );
  };

  render() {
    const {
      translated,
      verifies,
      verifyId,
      appearDate,
      signature
    } = this.state;

    return (
      <Fragment>
        <Row>
          <Col />
          <Col className="text-center">
            <Form.Group>
              <Form.Label>เลือกวันที่แสดงตน</Form.Label>
              <Form.Control
                as="select"
                value={verifyId}
                onChange={this.handleAppearDateChange}
              >
                {verifies.map((data, index) => {
                  return (
                    <option key={`appearDate-${index}`} value={data._id}>
                      {toLocalDate(data.appearDate)}
                    </option>
                  );
                })}
              </Form.Control>
            </Form.Group>
            <ButtonToolbar>
              <Button
                variant="outline-secondary"
                className="pea-color"
                onClick={this.handlePrint}
              >
                พิมพ์
              </Button>
              <Button
                variant="outline-secondary"
                className="pea-color"
                onClick={() => this.props.history.goBack()}
              >
                กลับ
              </Button>
            </ButtonToolbar>
          </Col>
          <Col />
        </Row>
        {translated ? (
          <Fragment>
            <ReactToPrint
              ref={this.setPrintRef}
              trigger={() => <p></p>}
              content={() => this.toPrintRef}
            />
            <CustomerPrintData
              ref={this.setToPrintRef}
              peaId={this.props.peaId}
              customer={translated}
              appearDate={appearDate}
              signature={signature}
            />
          </Fragment>
        ) : (
          <div className="text-center mt-5">
            <Spinner animation="border"></Spinner>
          </div>
        )}
      </Fragment>
    );
  }
}

const mapStateToProps = state => {
  const { customers } = state;
  return {
    customers
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getCustomer: peaId => dispatch(customerActions.get(peaId)),
    getSignature: (peaId, sigId) =>
      dispatch(customerActions.getSignature(peaId, sigId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PrintCustomer);
