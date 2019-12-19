import React, { Component, Fragment } from "react";

import { connect } from "react-redux";
import { customerActions } from "../../../actions";
import { arrayBufferToBase64, translateCustomer } from "../../../helpers";

import {
  Row,
  Col,
  Button,
  ButtonToolbar,
  Card,
  Accordion,
  Image,
  ListGroup
} from "react-bootstrap";

const basicDataRow = [
  { field: "peaId", title: "หมายเลขผู้ใช้ไฟ(CA)", key: "peaId" },
  { field: "name", title: "ชื่อ-สกุล", key: "name" },
  { field: "address", title: "ที่อยู่", key: "address" },
  { field: "authorize", title: "กรณีเป็น", key: "authorize" },
  { field: "soldierNo", title: "หมายเลขทหาร", key: "soldierNo" },
  { field: "war", title: "ลดสิทธิ์สงคราม", key: "war" }
];

class ViewCustomer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      customer: null,
      translated: null,
      isLoading: true,
      signatures: null,
      verifies: null
    };

    const { peaId } = this.props;
    this.props.getCustomer(peaId);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { peaId } = this.props;
    const {
      customers: { customer, signature }
    } = nextProps;

    if (customer) {
      this.setState({ customer, translated: translateCustomer(customer) });
      customer.verifies.forEach(item => {
        this.props.getSignature(peaId, item._id);
      });
    }

    if (signature) {
      this.setState({
        signatures: {
          ...this.state.signatures,
          [signature.id]: arrayBufferToBase64(signature.data)
        }
      });
    }
  }

  render() {
    const { peaId } = this.props;
    const { translated, customer, signatures } = this.state;
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
                key="button-verify"
                variant="outline-secondary"
                className="pea-color"
                onClick={() => {
                  this.props.history.push(`/customers/verify/${peaId}`);
                }}
              >
                ยืนยันสิทธิ์
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
              <Col>
                <ListGroup variant="flush">
                  {translated &&
                    basicDataRow.map(item => {
                      return (
                        <ListGroup.Item key={item.key}>
                          <span>{item.title}</span>
                          <span className="ml-1">{`${
                            translated[item.field]
                          }`}</span>
                        </ListGroup.Item>
                      );
                    })}
                </ListGroup>
              </Col>
            </Row>
          </Col>
          <Col>
            <h4 className="text-center">ข้อมูลการยืนยัน</h4>
            <Row>
              <Col>
                {customer &&
                customer.verifies &&
                customer.verifies.length > 0 ? (
                  <Accordion>
                    {customer.verifies.map((data, index) => {
                      return (
                        <VerifyData
                          key={`card-${index}`}
                          index={index}
                          signatureUrl={signatures && signatures[data._id]}
                          {...data}
                        />
                      );
                    })}
                  </Accordion>
                ) : (
                  <div className="text-center">
                    <span className="text-secondary">ไม่มีข้อมูลการยืนยัน</span>
                  </div>
                )}
              </Col>
            </Row>
          </Col>
        </Row>
      </Fragment>
    );
  }
}

const VerifyData = ({ appearDate, signatureUrl, index }) => {
  return (
    <Card>
      <Card.Header as="h5">
        <Accordion.Toggle as={Button} variant="link" eventKey={index}>
          <div>
            <span className="mr-1">วันที่แสดงตน:</span>
            <span>
              {new Date(appearDate).toLocaleDateString("th-TH", {
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </span>
          </div>
        </Accordion.Toggle>
      </Card.Header>
      <Accordion.Collapse eventKey={index}>
        <Card.Body>
          <div>
            {signatureUrl ? (
              <Image
                fluid
                alt="signature"
                src={`data:image/png;base64,${signatureUrl}`}
              />
            ) : (
              <span className="text-secondary">ไม่พบไฟล์ภาพ</span>
            )}
          </div>
        </Card.Body>
      </Accordion.Collapse>
    </Card>
  );
};

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

export default connect(mapStateToProps, mapDispatchToProps)(ViewCustomer);
