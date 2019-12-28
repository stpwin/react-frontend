import React, { Component, Fragment } from "react";

import { connect } from "react-redux";
import { customerActions } from "../../../actions";
import { arrayBufferToBase64, translateCustomer, toLocalDate } from "../../../helpers";

import {
  Row,
  Col,
  Button,
  ButtonToolbar,
  Card,
  Accordion,
  Image,
  ListGroup,
  Badge
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
  state = {
    customer: {},
    translated: {},
    isLoading: true,
    signatures: {},
    verifies: {}
  };

  componentDidMount() {
    console.log(this.props)
    this.props.getCustomer(this.props.peaId);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      customers: { customer, signature }
    } = nextProps;

    if (customer) {
      this.setState({ customer, translated: translateCustomer(customer) });
      customer.verifies.forEach(item => {
        this.props.getSignature(customer.peaId, item._id);
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

  goTo = path => {
    const { history } = this.props
    const { location: { state, pathname } } = history
    history.push(path, { from: pathname, filter: state && state.filter });
  }

  handleGotoPrint = () => {
    this.goTo(`/customers/print/${this.props.peaId}`)
  }

  handleGotoVerify = () => {
    this.goTo(`/customers/verify/${this.props.peaId}`)
  }

  handleGotoEdit = () => {
    this.goTo(`/customers/edit/${this.props.peaId}`)
  }


  handleGoBack = () => {
    const { history } = this.props
    const { location: { state, pathname } } = history
    if (state && state.from) {
      return history.push("/customers", { from: pathname, filter: state && state.filter });
    }
    history.goBack();
  }

  render() {
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
                onClick={this.handleGotoPrint}
              >
                พิมพ์
              </Button>
              <Button
                key="button-verify"
                variant="outline-secondary"
                className="pea-color"
                onClick={this.handleGotoVerify}
              >
                ยืนยันสิทธิ์
              </Button>
              <Button
                key="button-edit"
                variant="outline-secondary"
                className="pea-color"
                onClick={this.handleGotoEdit}
              >
                แก้ไขข้อมูล
              </Button>
              <Button
                key="button-back"
                variant="outline-secondary"
                className="pea-color"
                onClick={this.handleGoBack}
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
                        <ListGroup.Item key={item.key} >
                          <span className="text-dark">{item.title}:</span>
                          <b className="ml-2">{`${
                            translated[item.field]
                            }`}</b>
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
      </Fragment >
    );
  }
}

const VerifyData = ({ appearDate, signatureUrl, index, approvedDate }) => {
  return (
    <Card>
      <Card.Header as="h5">
        <Accordion.Toggle as={Button} variant="link" eventKey={index}>
          <div>
            <span className="mr-1">วันที่แสดงตน:</span>
            <span>
              {toLocalDate(appearDate)}
            </span>
            <span className="ml-3">
              {approvedDate ?
                (<Badge variant="success">{`อนุมัติเมื่อ ${toLocalDate(approvedDate)}`}</Badge>)
                : (<Badge variant="danger">ยังไม่อนุมัติ</Badge>)
              }
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
