import React, { Component, Fragment } from "react";

import {
  Row,
  Col,
  Button,
  ButtonToolbar,
  Card,
  Accordion
} from "react-bootstrap";

import { getCustomerByPeaId } from "../../../helpers";

export default class ViewCustomer extends Component {
  state = {
    customer: null,
    isLoading: true
  };
  componentDidMount() {
    const { peaId } = this.props;
    if (!peaId) return;
    getCustomerByPeaId(peaId).then(data => {
      // console.log(data);
      this.setState({
        customer: data,
        isLoading: false
      });
    });
  }
  render() {
    const { peaId } = this.props;
    const { customer } = this.state;

    return (
      <Fragment>
        <Row>
          <Col className="text-center">
            <ButtonToolbar>
              <Button
                key="button-print"
                variant="outline-secondary"
                className="pea-color"
                onClick={() => {
                  this.props.history.push(`/customers/print/${peaId}`);
                }}
              >
                พิมพ์
              </Button>
              <Button
                key="button-edit"
                variant="outline-secondary"
                className="pea-color"
                onClick={() => {
                  this.props.history.push(`/customers/edit/${peaId}`);
                }}
              >
                แก้ไข
              </Button>
              <Button
                key="button-back"
                variant="outline-secondary"
                className="pea-color"
                onClick={() => {
                  this.props.history.goBack();
                }}
              >
                กลับ
              </Button>
            </ButtonToolbar>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <h4 className="text-center">ข้อมูลพื้นฐาน</h4>
            <Row>
              <Col>Hello</Col>
            </Row>
          </Col>
          <Col>
            <h4 className="text-center">ข้อมูลการยืนยัน</h4>
            <Row>
              <Col>
                <Accordion defaultActiveKey="0">
                  {customer &&
                    customer.verifies &&
                    customer.verifies.map((data, index) => {
                      return (
                        <VerifyData
                          key={`card-${index}`}
                          index={index}
                          {...data}
                        />
                      );
                    })}
                </Accordion>
              </Col>
            </Row>
          </Col>
        </Row>
      </Fragment>
    );
  }
}

const VerifyData = ({ dateAppear, privilegeDate, signature, index }) => {
  return (
    <Card>
      <Card.Header as="h5">
        <Accordion.Toggle as={Button} variant="link" eventKey={index}>
          {new Date(privilegeDate).toLocaleDateString("th-TH", {
            year: "numeric"
          })}
        </Accordion.Toggle>
      </Card.Header>
      <Accordion.Collapse eventKey={index}>
        <Card.Body>
          <span className="mr-1">วันที่แสดงตน:</span>
          {new Date(dateAppear).toLocaleDateString("th-TH", {
            year: "numeric",
            month: "long",
            day: "numeric"
          })}
        </Card.Body>
      </Accordion.Collapse>
    </Card>
  );
};
