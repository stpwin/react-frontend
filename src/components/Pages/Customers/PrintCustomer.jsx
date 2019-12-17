import React, { Component, Fragment } from "react";

import { connect } from "react-redux";
import { customerActions } from "../../../actions";
import { translateCustomer } from "../../../helpers";

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
  state = {
    translated: {},
    verifies: [],
    verifyId: "",
    signature: null,
    appearDate: null
  };
  UNSAFE_componentWillMount() {
    const { peaId } = this.props;
    this.props.getCustomer(peaId);
    // document.title = `พิมพ์ ขอส่วนลดค่าไฟฟ้าของทหารผ่านศึก ${peaId}`;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { peaId } = this.props;
    const {
      customers: { customer, signature }
    } = nextProps;

    this.setState({
      signature
    });

    if (customer) {
      let verify;
      let appearDate;
      if (customer.verifies && customer.verifies.length > 0) {
        verify = customer.verifies[0];

        this.props.getSignature(peaId, verify._id);

        appearDate =
          verify.appearDate &&
          new Date(verify.appearDate).toLocaleDateString("th-TH", {
            year: "numeric",
            month: "long",
            day: "numeric"
          });
      }
      const translated = translateCustomer(customer);
      this.setState({
        verifies: customer.verifies || [],
        translated,
        verifyId: verify && verify._id,
        appearDate: appearDate
      });
    }
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

  handleAppearDateChange = e => {
    const { peaId } = this.props;
    this.setState(
      {
        verifyId: e.target.value,
        appearDate: e.target[e.target.selectedIndex].text
      },
      () => {
        this.props.getSignature(peaId, this.state.verifyId);
      }
    );

    console.log(e.target[e.target.selectedIndex].text);
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
                  const _appearDate = new Date(
                    data.appearDate
                  ).toLocaleDateString("th-TH", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  });
                  return (
                    <option key={`appearDate-${index}`} value={data._id}>
                      {_appearDate}
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
                onClick={this.handleBack}
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
