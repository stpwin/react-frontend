import React, { Component } from "react";
import {
  Container,
  Row,
  Col,
  Jumbotron,
  Button,
  Form,
  Collapse,
  Spinner
} from "react-bootstrap";

import "./home.css";

export class Home extends Component {
  state = {
    statusOpen: true,
    createButtonOpen: false,
    editVerifyButtonOpen: false,
    peaID: "",
    fetching: true,
    statusText: "กำลังเรียกข้อมูล..."
  };

  handleTextChange = event => {
    const peaId = event.target.value;
    let createButtonOpen = false;
    let editVerifyButtonOpen = false;
    let statusOpen = false;
    let fetching = false;
    let statusText = this.state.statusText;
    if (peaId.length === 11) {
      statusOpen = true;
      fetching = true;
      statusText = "กำลังเรียกข้อมูล...";
      setTimeout(
        function() {
          //Start the timer
          this.setState({
            fetching: false,
            createButtonOpen: true,
            statusText: "ไม่พบข้อมูลผู้ใช้ไฟนี้"
          }); //After 1 second, set render to true
        }.bind(this),
        1000
      );

      //   setTimeout(
      //     function() {
      //       //Start the timer
      //       this.setState({
      //         fetching: false,
      //         editVerifyButtonOpen: true,
      //         statusText: "พบข้อมูลผู้ใช้"
      //       }); //After 1 second, set render to true
      //     }.bind(this),
      //     1000
      //   );
    }
    this.setState({
      peaID: event.target.value,
      statusOpen: statusOpen,
      createButtonOpen: createButtonOpen,
      editVerifyButtonOpen: editVerifyButtonOpen,
      fetching: fetching,
      statusText: statusText
    });
  };
  render() {
    const {
      statusOpen,
      createButtonOpen,
      editVerifyButtonOpen,
      peaId,
      fetching,
      statusText
    } = this.state;
    return (
      <div>
        <Container className="p-5 text-center">
          <Jumbotron>
            <h2>PEA War Veterans Privilege Managment System</h2>

            <Form>
              <Row className="justify-content-md-center">
                <Col xs lg="5">
                  <Form.Control
                    className="text-center"
                    size="lg"
                    type="text"
                    placeholder="หมายเลขผู้ใช้ไฟ"
                    maxLength={11}
                    onChange={this.handleTextChange}
                    value={peaId}
                  />
                  <Collapse in={statusOpen}>
                    <div id="example-collapse-text">
                      {fetching ? (
                        <Spinner
                          animation="border"
                          role="status"
                          as="span"
                          aria-hidden="true"
                        >
                          <span className="sr-only">กำลังเรียกข้อมูล...</span>
                        </Spinner>
                      ) : null}
                      {"  " + statusText}
                    </div>
                  </Collapse>
                </Col>
              </Row>

              <Collapse in={createButtonOpen}>
                <Row className="justify-content-md-center">
                  <Col xs lg="3">
                    <Button variant="dark" size="lg" className="btn-block">
                      เพิ่มข้อมูล
                    </Button>
                  </Col>
                </Row>
              </Collapse>
              <Collapse in={editVerifyButtonOpen}>
                <Row className="justify-content-md-center">
                  <Col xs lg="3">
                    <Button variant="dark" size="lg" className="btn-block">
                      แก้ไขข้อมูล
                    </Button>
                  </Col>
                  <Col xs lg="3">
                    <Button variant="dark" size="lg" className="btn-block">
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

export default Home;
