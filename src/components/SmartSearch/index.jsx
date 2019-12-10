import React, { Component, Fragment } from "react";

import "./style.css";
import { getCustomerByPeaId, addressToString, getWarType } from "../../helpers";
import { withRouter } from "react-router-dom";

import {
  Container,
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
  _isMounted = false;

  state = {
    createButtonOpen: false,
    editVerifyButtonOpen: false,
    peaId: "020005975806",
    statusOpen: false,
    fetching: false,
    fetchError: false,
    statusText: "",
    fetchSuccess: false,
    fetchResult: false,
    customer: null
  };

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleTextChange = event => {
    const peaId = event.target.value;

    this.setState({
      peaId: peaId,
      statusOpen: false,
      createButtonOpen: false,
      editVerifyButtonOpen: false,
      fetching: false,
      fetchSuccess: false,
      statusText: "",
      customer: null,
      fetchError: false,
      fetchResult: false
    });

    if (peaId.length === 12) {
      this.setState({
        statusOpen: true,
        fetching: true
      });

      const result = getCustomerByPeaId(peaId);
      result
        .then(data => {
          // console.log(data);
          if (!data) {
            this.setState({
              fetchSuccess: true,
              fetching: false,
              createButtonOpen: true,
              statusText: "ไม่พบข้อมูล" //ไม่พบข้อมูลของหมายเลขผู้ใช้ไฟฟ้านี้
            });
            return;
          }

          this.setState({
            fetching: false,
            editVerifyButtonOpen: true,
            fetchSuccess: true,
            customer: data,
            fetchResult: true,
            statusText: "พบข้อมูล"
          });
        })
        .catch(() => {
          this.setState({
            fetching: false,
            createButtonOpen: false,
            fetchError: true,
            statusText: "ไม่สามารถเรียกข้อมูลจากเซิร์ฟเวอร์"
          });
        });
    }
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

  handlePrint = peaId => {
    this.props.history.push(`/customers/print/${peaId}`);
  };

  render() {
    const {
      createButtonOpen,
      editVerifyButtonOpen,
      peaId,
      fetching,
      statusText,
      fetchError,
      customer,
      fetchSuccess,
      fetchResult
    } = this.state;

    return (
      <Container className='p-5 text-center'>
        <Jumbotron>
          <h2 className='text-white'>
            ระบบจัดการการขอส่วนลดค่าไฟฟ้าของทหารผ่านศึก
          </h2>
          <h4 className='text-white '>
            PEA War Veterans Privilege Management System
          </h4>

          <Row className='justify-content-md-center'>
            <Col xs lg='5'>
              <Form.Group className='smart-search-input'>
                <Form.Label className='text-white'>
                  ระบุหมายเลขผู้ใช้ไฟฟ้า(CA)
                </Form.Label>
                <Form.Control
                  className='ca-text text-center'
                  size='lg'
                  type='text'
                  placeholder='xxxxxxxxxxx'
                  maxLength={12}
                  onChange={this.handleTextChange}
                  value={peaId}
                />
              </Form.Group>
              {/* <Collapse key='collapse-customer' in={statusOpen}> */}

              {fetching ? (
                <Fetching />
              ) : fetchError ? (
                <FetchError statusText={statusText} />
              ) : fetchSuccess ? (
                fetchResult ? (
                  <Fragment>
                    <div className='search-status icon-before-text'>
                      <span className='text-white'>
                        <FaInfoCircle />
                      </span>
                      <span className='text-white'>{statusText}</span>
                    </div>

                    <CustomerView
                      customer={customer}
                      handlePrint={this.handlePrint}
                    />
                  </Fragment>
                ) : (
                  <NotFound />
                )
              ) : null}
              {/* </Collapse> */}
            </Col>
          </Row>

          <Collapse key='collapse-first-button' in={createButtonOpen}>
            <Row className='justify-content-md-center'>
              <Col>
                <Button
                  variant='outline-light'
                  size='lg'
                  // href={`/customers/add/${peaId}`}
                  onClick={this.handleAdd}
                  className='btn-block'
                >
                  เพิ่มข้อมูล
                </Button>
              </Col>
            </Row>
          </Collapse>
          <Collapse key='collapse-second-button' in={editVerifyButtonOpen}>
            <Row className='justify-content-md-center'>
              <Col xs lg='3'>
                <Button
                  variant='outline-light'
                  size='lg'
                  // href={`/customers/edit/${peaId}`}
                  className='btn-block'
                  onClick={this.handleEdit}
                >
                  แก้ไขข้อมูล
                </Button>
              </Col>
              <Col xs lg='3'>
                <Button
                  variant='outline-light'
                  size='lg'
                  // href={`/customers/verify/${peaId}`}
                  onClick={this.handleVerify}
                  className='btn-block'
                >
                  ยืนยันสิทธิ์
                </Button>
              </Col>
            </Row>
          </Collapse>
        </Jumbotron>
      </Container>
    );
  }
}

const Fetching = () => {
  return (
    <div className='search-status spinner-margin'>
      <Spinner
        animation='border'
        role='status'
        as='span'
        size='sm'
        aria-hidden='true'
        variant='light'
      >
        <span className='sr-only text-white'>กำลังเรียกข้อมูล...</span>
      </Spinner>

      <span className='text-white'>กำลังเรียกข้อมูล...</span>
    </div>
  );
};

const NotFound = ({ statusText }) => {
  return (
    <div className='search-status icon-before-text'>
      <span className='text-white'>
        <FaInfoCircle />
      </span>
      <span className='text-white'>ไม่พบข้อมูล</span>
    </div>
  );
};

const FetchError = ({ statusText }) => {
  return (
    <div className='search-status icon-before-text'>
      <span className='text-warning'>
        <FaExclamationTriangle />
      </span>
      <span className='text-warning'>{`${statusText}`}</span>
    </div>
  );
};

const CustomerView = ({ customer, handlePrint }) => {
  return (
    <Card>
      <Card.Body>
        <Card.Title>
          {customer && customer.title}
          {" " + (customer && customer.firstName)}
          {" " + (customer && customer.lastName)}
        </Card.Title>
        <Card.Subtitle className='mb-2 text-muted'>
          สงคราม {customer && customer.war}{" "}
          {getWarType(customer && customer.war)}
        </Card.Subtitle>
        <Card.Text>{addressToString(customer && customer.address)}</Card.Text>
      </Card.Body>
      <ListGroup className='list-group-flush'>
        <ListGroupItem>
          หมายเลขทหาร {customer && customer.soldierNo}
        </ListGroupItem>
        {/* <ListGroupItem>Dapibus ac facilisis in</ListGroupItem>
          <ListGroupItem>Vestibulum at eros</ListGroupItem> */}
      </ListGroup>
      <Card.Body>
        <Card.Link href='' onClick={() => handlePrint(customer.peaId)}>
          พิมพ์
        </Card.Link>
      </Card.Body>
      <Card.Footer>
        <small className='text-muted'>
          {customer && customer.verifies && customer.verifies.length > 0 ? (
            <Fragment>
              ยืนยันสิทธิ์ครั้งล่าสุดเมื่อ{" "}
              {new Date(
                customer.verifies[customer.verifies.length - 1].dateAppear
              ).toLocaleDateString("th-TH", {
                // weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </Fragment>
          ) : (
            "ไม่เคยยืนยันสิทธิ์"
          )}
        </small>
      </Card.Footer>
    </Card>
  );
};

export default withRouter(SmartSearch);
