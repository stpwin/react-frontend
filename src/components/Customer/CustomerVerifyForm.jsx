import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Signature from "./Signature";
import { Button, Form, Col, Row, Collapse, Spinner } from "react-bootstrap";

class CustomerVerifyForm extends Component {
  state = {
    authorize: "ทหาร",
    authorizeName: "",
    dateAppear: new Date(),
    signatureBase64: null,
    authorizeNameOpen: false
  };

  sigPad = {};

  handleChange = event => {
    if (event.target.name === "authorize") {
      this.setState({
        authorizeNameOpen: event.target.value !== "ทหาร",
        [event.target.name]: event.target.value
      });
    } else {
      this.setState({
        [event.target.name]: event.target.value
      });
    }
  };
  handleDateChange = date => {
    this.setState({
      dateAppear: date
    });
  };

  setSigpadRef = ref => {
    this.sigPad = ref;
  };

  render() {
    const {
      dateAppear,
      authorize,
      authorizeNameOpen,
      authorizeName,
      statusModal
    } = this.state;
    return (
      <div>
        <Form.Group as={Row}>
          <Form.Label as="legend" column sm={2}>
            วันที่มาแสดงตน
          </Form.Label>
          <Col sm={3}>
            <DatePicker
              todayButton="เลือกวันนี้"
              className="form-control"
              selected={dateAppear}
              onChange={this.handleDateChange}
            ></DatePicker>
          </Col>
        </Form.Group>

        <fieldset>
          <Form.Group as={Row}>
            <Form.Label as="legend" column sm={2}>
              กรณีเป็น
            </Form.Label>
            <Col sm={10}>
              <Form.Check
                inline
                type="radio"
                label="ทหารเจ้าของสิทธิ์"
                name="authorize"
                value="ทหาร"
                checked={authorize === "ทหาร"}
                onChange={this.handleChange}
              />
              <Form.Check
                inline
                type="radio"
                label="ตัวแทน"
                name="authorize"
                value="ตัวแทน"
                checked={authorize === "ตัวแทน"}
                onChange={this.handleChange}
              />
              <Form.Check
                inline
                type="radio"
                label="ภรรยา"
                name="authorize"
                value="ภรรยา"
                checked={authorize === "ภรรยา"}
                onChange={this.handleChange}
              />
              <Form.Check
                inline
                type="radio"
                label="ทายาท"
                name="authorize"
                value="ทายาท"
                checked={authorize === "ทายาท"}
                onChange={this.handleChange}
              />
            </Col>
          </Form.Group>
        </fieldset>

        <Collapse in={authorizeNameOpen}>
          <Form.Group as={Row}>
            <Form.Label column sm={2}>
              {`ชื่อ-สกุล ${authorize !== "ทหาร" ? authorize : ""}`}
            </Form.Label>
            <Col sm={5}>
              <Form.Control
                type="text"
                placeholder={`ชื่อ-สกุล ${
                  authorize !== "ทหาร" ? authorize : ""
                }`}
                onChange={this.handleChange}
                name="authorizeName"
                value={authorizeName}
              />
            </Col>
          </Form.Group>
        </Collapse>

        <Form.Group as={Row}>
          <Form.Label column sm={2}>
            ลายเซ็น
          </Form.Label>
          <Col sm={3}>
            <Signature
              setRef={this.setSigpadRef}
              clear={this.clearSigPad}
            ></Signature>
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Col sm={{ span: 10, offset: 2 }}>
            <Button type="submit" disabled={statusModal} className="btn-block">
              {statusModal ? (
                <div>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  {"  กำลังดำเนินการ..."}
                </div>
              ) : (
                "บันทึก"
              )}
            </Button>
          </Col>
        </Form.Group>
      </div>
    );
  }
}

export default CustomerVerifyForm;
