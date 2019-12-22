import React, { Component, Fragment } from "react";

import "./style.css";

import { translateCustomer } from "../../helpers";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import { customerActions } from "../../actions";

import {
  Row,
  Col,
  Jumbotron,
  Button,
  Form,
  Collapse,
  Spinner,
  Card,
  ListGroup,
  ListGroupItem
} from "react-bootstrap";

import { FaInfoCircle, FaExclamationTriangle } from "react-icons/fa";

export class SmartSearch extends Component {
  state = {
    peaId: "0200",
    peaIdOk: false
  };

  handleTextChange = event => {
    const peaId = event.target.value;
    this.setState(
      {
        peaId: peaId,
        peaIdOk: peaId.length === 12
      },
      () => {
        if (this.state.peaIdOk) {
          this.props.getCustomer(peaId);
        }
      }
    );
  };

  handleEdit = () => {
    this.props.history.push(`/customers/edit/${this.state.peaId}`);
  };

  handleAdd = () => {
    this.props.history.push(`/customers/add/${this.state.peaId}`);
  };

  handleVerify = () => {
    this.props.history.push(`/customers/verify/${this.state.peaId}`);
  };

  render() {
    const { peaId, peaIdOk } = this.state;
    const { customer, loading, error } = this.props;

    return (
      <Jumbotron className="text-center" >
        <h2 className="text-white">
          ระบบจัดการการขอส่วนลดค่าไฟฟ้าของทหารผ่านศึก
        </h2>
        <h4 className="text-white">
          PEA War Veterans Privilege Management System
        </h4>

        <Row className="justify-content-md-center">
          <Col >
            <Form.Group className="smart-search-input">
              <Form.Label className="text-white">
                ระบุหมายเลขผู้ใช้ไฟฟ้า(CA)
                </Form.Label>
              <Form.Control
                className="ca-text text-center"
                size="lg"
                type="text"
                placeholder="xxxxxxxxxxx"
                maxLength={12}
                onChange={this.handleTextChange}
                value={peaId}
              />
            </Form.Group>

            {peaIdOk ? (
              loading ? (
                <Fetching />
              ) : error ? (
                <FetchError statusText={error} />
              ) : customer ? (
                <Fragment>
                  <div className="search-status icon-before-text">
                    <span className="text-white">
                      <FaInfoCircle />
                    </span>
                    <span className="text-white">พบข้อมูล</span>
                  </div>

                  <CustomerView
                    customer={customer}
                  />
                </Fragment>
              ) : (
                      <NotFound />
                    )
            ) : null}
          </Col>
        </Row>

        <Collapse
          key="collapse-first-button"
          in={peaIdOk && !loading && !error && !customer ? true : false}
        >
          <Row className="justify-content-md-center">
            <Col>
              <Button
                variant="outline-light"
                size="lg"
                onClick={this.handleAdd}
                className="btn-block"
              >
                เพิ่มข้อมูล
                </Button>
            </Col>
          </Row>
        </Collapse>
        <Collapse
          key="collapse-second-button"
          in={peaIdOk && !loading && !error && customer ? true : false}
        >
          <Row className="justify-content-md-center">
            <Col xs lg="3">
              <Button
                variant="outline-light"
                size="lg"
                className="btn-block"
                onClick={this.handleEdit}
              >
                แก้ไขข้อมูล
                </Button>
            </Col>
            <Col xs lg="3">
              <Button
                variant="outline-light"
                size="lg"
                onClick={this.handleVerify}
                className="btn-block"
              >
                ยืนยันสิทธิ์
                </Button>
            </Col>
          </Row>
        </Collapse>
      </Jumbotron>
    );
  }
}

const CustomerView = ({ customer: customerData }) => {
  const customer = translateCustomer(customerData)
  return (
    <Card>
      <Card.Body>
        <Card.Title>
          {customer.name}
        </Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          สงคราม {customer.war}
        </Card.Subtitle>
        <Card.Text>{customer.address}</Card.Text>
      </Card.Body>
      <ListGroup className="list-group-flush">
        <ListGroupItem>
          หมายเลขทหาร {customer.soldierNo}
        </ListGroupItem>
      </ListGroup>
      <Card.Body>
        <Link to={`/customers/print/${customer.peaId}`}>พิมพ์</Link>
        <Link to={`/customers/view/${customer.peaId}`}>ดูข้อมูล</Link>
      </Card.Body>
      <Card.Footer>
        <small className="text-muted">
          {customer.appearDate ? (
            <span>ยืนยันสิทธิ์ครั้งล่าสุดเมื่อ {customer.appearDate}</span>
          ) : (
              <span>ไม่เคยยืนยันสิทธิ์</span>
            )}
        </small>
      </Card.Footer>
    </Card>
  );
};

const Fetching = () => {
  return (
    <div className="search-status spinner-margin">
      <Spinner
        animation="border"
        role="status"
        as="span"
        size="sm"
        aria-hidden="true"
        variant="light"
      >
        <span className="sr-only text-white">กำลังเรียกข้อมูล...</span>
      </Spinner>

      <span className="text-white">กำลังเรียกข้อมูล...</span>
    </div>
  );
};

const NotFound = () => {
  return (
    <div className="search-status icon-before-text">
      <span className="text-white">
        <FaInfoCircle />
      </span>
      <span className="text-white">ไม่พบข้อมูล</span>
    </div>
  );
};

const FetchError = ({ statusText }) => {
  return (
    <div className="search-status icon-before-text">
      <span className="text-warning">
        <FaExclamationTriangle />
      </span>
      <span className="text-warning">{`${statusText}`}</span>
    </div>
  );
};

const mapStateToProps = state => {
  const {
    customers: { customer, loading, error }
  } = state;
  return {
    customer,
    loading,
    error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getCustomer: peaId => dispatch(customerActions.get(peaId))
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SmartSearch)
);
