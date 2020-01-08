import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { customerActions } from "../../../actions";
import {
  arrayBufferToBase64,
  translateCustomer,
  toLocalDate
} from "../../../helpers";

import { FaTrash } from "react-icons/fa";

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

import { ModalConfirm } from "../../Modals";

const basicDataRow = [
  { field: "peaId", title: "หมายเลขผู้ใช้ไฟ(CA)", key: "peaId" },
  { field: "name", title: "ชื่อ-สกุล", key: "name" },
  { field: "address", title: "ที่อยู่", key: "address" },
  { field: "tel", title: "โทรศัพท์", key: "tel" },
  { field: "authorize", title: "กรณีเป็น", key: "authorize" },
  { field: "soldierNo", title: "หมายเลขทหาร", key: "soldierNo" },
  { field: "war", title: "ลดสิทธิ์สงคราม", key: "war" },
  { field: "description", title: "เพิ่มเติม", key: "description" }
];

class ViewCustomer extends Component {
  state = {
    customer: {},
    translated: {},
    isLoading: true,
    signatures: {},
    verifies: {},
    confirmShow: false,
    selectedVerifyId: "",
    confirmText: ""
  };

  componentDidMount() {
    // console.log(this.props);
    this.props.getCustomer(this.props.peaId);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      customers: { customer, signature, verify }
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

    if (verify) {
      if (verify.status === "remove_verify_success") {
        this.props.getCustomer(this.props.peaId);
      }
    }
  }

  goTo = path => {
    const { history } = this.props;
    const {
      location: { state, pathname }
    } = history;
    history.push(path, { from: pathname, filter: state && state.filter });
  };

  handleGotoPrint = () => {
    this.goTo(`/customers/print/${this.props.peaId}`);
  };

  handleGotoVerify = () => {
    this.goTo(`/customers/verify/${this.props.peaId}`);
  };

  handleGotoEdit = () => {
    this.goTo(`/customers/edit/${this.props.peaId}`);
  };

  handleGoBack = () => {
    const { history } = this.props;
    const {
      location: { state, pathname }
    } = history;
    if (state && state.from) {
      return history.push("/customers", {
        from: pathname,
        filter: state && state.filter
      });
    }
    history.goBack();
  };

  handleVerifyRemove = (id, title) => {
    this.setState({
      selectedVerifyId: id,
      confirmShow: true,
      confirmText: (
        <Fragment>
          <br />
          {`การแสดงตนเมื่อ ${title}`}
        </Fragment>
      )
    });
  };

  handleConfirmHide = () => {
    this.setState({
      confirmShow: false
    });
  };

  handleConfirm = () => {
    this.setState({
      confirmShow: false,
      confirmText: ""
    });
    this.props.removeVerify(this.props.peaId, this.state.selectedVerifyId);
    // console.log(this.state.selectedVerifyId);
  };

  render() {
    const {
      translated,
      customer,
      signatures,
      confirmShow,
      confirmText
    } = this.state;
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
        <Row className="mt-4 mb-5">
          <Col>
            <h4 className="text-center">ข้อมูลพื้นฐาน</h4>
            <Row>
              <Col>
                <ListGroup variant="flush">
                  {translated &&
                    basicDataRow.map(item => {
                      return (
                        <ListGroup.Item key={item.key}>
                          <Row>
                            <Col sm={5}>
                              <span className="text-dark">{item.title}:</span>
                            </Col>
                            <Col>
                              <b style={{ whiteSpace: "pre-wrap" }}>
                                {`${translated[item.field] || "-"}`}
                              </b>
                            </Col>
                          </Row>
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
                          onRemove={() =>
                            this.handleVerifyRemove(
                              data._id,
                              toLocalDate(data.appearDate)
                            )
                          }
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
        <ModalConfirm
          show={confirmShow}
          status="delete"
          confirm={this.handleConfirm}
          confirmtext={confirmText}
          onHide={this.handleConfirmHide}
        />
      </Fragment>
    );
  }
}

const VerifyData = ({
  appearDate,
  signatureUrl,
  index,
  approvedDate,
  onRemove
}) => {
  return (
    <Card>
      <Card.Header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <Accordion.Toggle as={Button} variant="link" eventKey={index}>
          <span className="mr-1">วันที่แสดงตน:</span>
          <span>{toLocalDate(appearDate)}</span>
          <span className="ml-3">
            {approvedDate ? (
              <Badge variant="success">{`อนุมัติเมื่อ ${toLocalDate(
                approvedDate
              )}`}</Badge>
            ) : (
              <Badge variant="danger">ยังไม่อนุมัติ</Badge>
            )}
          </span>
        </Accordion.Toggle>
        <Button
          size="sm"
          className="mr-1"
          variant="outline-light"
          onClick={() => onRemove()}
        >
          <FaTrash />
        </Button>
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
      dispatch(customerActions.getSignature(peaId, sigId)),
    removeVerify: (peaId, verifyId) =>
      dispatch(customerActions.removeVerify(peaId, verifyId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewCustomer);
