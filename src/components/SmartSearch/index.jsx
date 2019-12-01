import React, { Component, Fragment } from "react";
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

import Moment from "react-moment";
import "moment-timezone";

import "./style.css";
import { getCustomerByPeaId, addressToString } from "../../helpers";

export class SmartSearch extends Component {
  state = {
    statusOpen: false,
    createButtonOpen: false,
    editVerifyButtonOpen: false,
    peaId: "0025123555",
    fetching: false,
    fetchError: false,
    statusText: "",
    customer: null
  };

  handleTextChange = async event => {
    const peaId = event.target.value;

    this.setState({
      peaId: peaId,
      statusOpen: false,
      createButtonOpen: false,
      editVerifyButtonOpen: false,
      fetching: false,
      statusText: this.state.statusText
    });

    if (peaId.length === 11) {
      this.setState({
        statusOpen: true,
        fetching: true,
        fetchError: false,
        statusText: "",
        customer: null
      });

      try {
        const result = await getCustomerByPeaId(peaId);
        if (!result) {
          console.log("i can't find anything");
          this.setState({
            fetching: false,
            createButtonOpen: true,
            statusText: "ไม่พบข้อมูลผู้ใช้ไฟนี้"
          });
          return;
        }
        console.log(result);
        this.setState({
          fetching: false,
          editVerifyButtonOpen: true,
          customer: result,
          statusText: `พบข้อมูล`
        });
        return;
      } catch (err) {
        this.setState({
          fetching: false,
          createButtonOpen: false,
          fetchError: true,
          statusText: "ไม่สามารถเรียกข้อมูลจากเซิฟเวอร์"
        });
        return;
      }
    }

    // this.setState({
    //   peaID: peaId,
    //   statusOpen: false,
    //   createButtonOpen: false,
    //   editVerifyButtonOpen: false,
    //   fetching: false,
    //   statusText: this.state.statusText
    // });
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
    const {
      statusOpen,
      createButtonOpen,
      editVerifyButtonOpen,
      peaId,
      fetching,
      statusText,
      fetchError,
      customer
    } = this.state;

    return (
      <Container className='p-5 text-center'>
        <Jumbotron>
          <h2 className='text-white'>
            PEA War Veterans Privilege Managment System
          </h2>

          <Form>
            <Row className='justify-content-md-center'>
              <Col xs lg='5'>
                <Form.Control
                  className='smart-search-input text-center'
                  size='lg'
                  type='text'
                  placeholder='หมายเลขผู้ใช้ไฟ(CA)'
                  maxLength={11}
                  onChange={this.handleTextChange}
                  value={peaId}
                />
                <Collapse in={statusOpen}>
                  <div id='example-collapse-text'>
                    {fetching ? (
                      <React.Fragment>
                        <Spinner
                          animation='border'
                          role='status'
                          as='span'
                          aria-hidden='true'
                        >
                          <span className='sr-only text-white'>
                            กำลังเรียกข้อมูล...
                          </span>
                        </Spinner>
                        <span className='text-white'>กำลังเรียกข้อมูล...</span>
                      </React.Fragment>
                    ) : fetchError ? (
                      <FetchError statusText={statusText} />
                    ) : (
                      <React.Fragment>
                        <span className='text-white'>{statusText}</span>

                        {customer ? <CustomerView customer={customer} /> : null}
                      </React.Fragment>
                    )}
                  </div>
                </Collapse>
              </Col>
            </Row>

            <Collapse in={createButtonOpen}>
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
            <Collapse in={editVerifyButtonOpen}>
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
          </Form>
        </Jumbotron>
      </Container>
    );
  }
}

const CustomerView = ({ customer }) => {
  return (
    <Card>
      <Card.Body>
        <Card.Title>
          {customer.title}
          {" " + customer.firstName}
          {" " + customer.lastName}
        </Card.Title>
        <Card.Subtitle className='mb-2 text-muted'>
          สงคราม {customer.war} G1
        </Card.Subtitle>
        <Card.Text>{addressToString(customer.address)}</Card.Text>
      </Card.Body>
      <ListGroup className='list-group-flush'>
        <ListGroupItem>หมายเลขทหาร {customer.soldierNo}</ListGroupItem>
        {/* <ListGroupItem>Dapibus ac facilisis in</ListGroupItem>
          <ListGroupItem>Vestibulum at eros</ListGroupItem> */}
      </ListGroup>
      <Card.Body>
        <Card.Link href='#'>พิมพ์</Card.Link>
      </Card.Body>
      <Card.Footer>
        <small className='text-muted'>
          {customer.verifies && customer.verifies.length > 0 ? (
            <Fragment>
              ยืนยันสิทธิ์ครั้งล่าสุดเมื่อ{" "}
              <Moment
                format='YYYY/MM/DD'
                date={
                  customer.verifies[customer.verifies.length - 1].dateAppear
                }
              />
            </Fragment>
          ) : (
            "ไม่เคยยืนยันสิทธิ์"
          )}
        </small>
      </Card.Footer>
    </Card>
  );
};

const FetchError = ({ statusText }) => {
  return <span className='text-danger'>{`${statusText}`}</span>;
};

export default withRouter(SmartSearch);
