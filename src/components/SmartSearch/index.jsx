import React, { Component } from "react";
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

import "./style.css";
import { handleFetchError } from "../../helpers/fetch-helpers";
import { authHeader } from "../../helpers/auth-header";
import { addressToString } from "../../helpers/address-helpers";
import config from "../../config";

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
        const result = await this.fetchData(peaId);
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

  queryCustomer = peaId => {
    this.fetchData(peaId);
  };

  fetchData = peaId => {
    const reqConf = {
      method: "GET",
      headers: authHeader()
    };
    return fetch(`${config.apiUrl}/api/customers/peaid/${peaId}`, reqConf)
      .then(handleFetchError)
      .then(rep => {
        if (rep.status === 200) {
          return rep.json();
        }
        return null;
        // console.log(rep);
      })
      .then(data => {
        return data;
      });
    // .catch(() => {
    //   console.log("Fetch error!");
    // });
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
      <div>
        <Container className="p-5 text-center">
          <Jumbotron>
            <h2 className="text-white">
              PEA War Veterans Privilege Managment System
            </h2>

            <Form>
              <Row className="justify-content-md-center">
                <Col xs lg="5">
                  <Form.Control
                    className="text-center"
                    size="lg"
                    type="text"
                    placeholder="หมายเลขผู้ใช้ไฟ(CA)"
                    maxLength={11}
                    onChange={this.handleTextChange}
                    value={peaId}
                  />
                  <Collapse in={statusOpen}>
                    <div id="example-collapse-text">
                      {fetching ? (
                        <div>
                          <Spinner
                            animation="border"
                            role="status"
                            as="span"
                            aria-hidden="true"
                          >
                            <span className="sr-only text-white">
                              กำลังเรียกข้อมูล...
                            </span>
                          </Spinner>
                          <span className="text-white">
                            กำลังเรียกข้อมูล...
                          </span>
                        </div>
                      ) : fetchError ? (
                        <FetchError statusText={statusText} />
                      ) : (
                        <div>
                          <span className="text-white">{statusText}</span>

                          {customer ? (
                            <CustomerView customer={customer} />
                          ) : null}
                        </div>
                      )}
                    </div>
                  </Collapse>
                </Col>
              </Row>

              <Collapse in={createButtonOpen}>
                <Row className="justify-content-md-center">
                  <Col>
                    <Button
                      variant="info"
                      size="lg"
                      href={`/create-customer/${peaId}`}
                      className="btn-block"
                    >
                      เพิ่มข้อมูล
                    </Button>
                  </Col>
                </Row>
              </Collapse>
              <Collapse in={editVerifyButtonOpen}>
                <Row className="justify-content-md-center">
                  <Col xs lg="3">
                    <Button
                      variant="info"
                      size="lg"
                      href={`/edit-customer/${peaId}`}
                      className="btn-block"
                    >
                      แก้ไขข้อมูล
                    </Button>
                  </Col>
                  <Col xs lg="3">
                    <Button
                      variant="info"
                      size="lg"
                      href={`/verify-customer/${peaId}`}
                      className="btn-block"
                    >
                      ยืนยันสิทธิ์
                    </Button>
                  </Col>
                </Row>
              </Collapse>
            </Form>
          </Jumbotron>
        </Container>
      </div>
    );
  }
}

const CustomerView = ({ customer }) => {
  return (
    <div>
      <Card>
        <Card.Body>
          <Card.Title>
            {customer.title}
            {" " + customer.firstName}
            {" " + customer.lastName}
          </Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            สงคราม {customer.war} G1
          </Card.Subtitle>
          <Card.Text>{addressToString(customer.address)}</Card.Text>
        </Card.Body>
        <ListGroup className="list-group-flush">
          <ListGroupItem>หมายเลขทหาร {customer.soldierNo}</ListGroupItem>
          {/* <ListGroupItem>Dapibus ac facilisis in</ListGroupItem>
          <ListGroupItem>Vestibulum at eros</ListGroupItem> */}
        </ListGroup>
        <Card.Body>
          <Card.Link href="#">พิมพ์</Card.Link>
        </Card.Body>
        <Card.Footer>
          <small className="text-muted">
            ยืนยันสิทธิ์ครั้งล่าสุดเมื่อ {"{ConfirmDate}"}
          </small>
        </Card.Footer>
      </Card>
    </div>
  );
};

const FetchError = ({ statusText }) => {
  return <span className="text-danger">{`${statusText}`}</span>;
};

export default SmartSearch;
