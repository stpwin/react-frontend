import React, { Component } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Signature from "./Signature";
import { Form, Col, Row } from "react-bootstrap";

class CustomerVerifyForm extends Component {
  state = {
    authorize: "ทหาร",
    authorizeName: "",
    dateAppear: new Date(),
    signatureBase64: null,
    authorizeNameOpen: false
  };

  handleChange = event => {
    console.log(event);
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

  render() {
    const {
      dateAppear,
      authorize
      // authorizeNameOpen,
      // authorizeName
    } = this.state;
    const { setSigpadRef } = this.props;
    return (
      <React.Fragment>
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
              name="dateAppear"
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
                custom
                type="radio"
                label="ทหาร"
                name="authorize"
                value="ทหาร"
                checked={authorize === "ทหาร"}
                onChange={this.handleChange}
                id={`inline-1`}
              />
              <Form.Check
                inline
                custom
                type="radio"
                label="ตัวแทน"
                name="authorize"
                value="ตัวแทน"
                checked={authorize === "ตัวแทน"}
                onChange={this.handleChange}
                id={`inline-2`}
              />
              <Form.Check
                inline
                custom
                type="radio"
                label="ภรรยา"
                name="authorize"
                value="ภรรยา"
                checked={authorize === "ภรรยา"}
                onChange={this.handleChange}
                id={`inline-3`}
              />
              <Form.Check
                inline
                custom
                type="radio"
                label="ทายาท"
                name="authorize"
                value="ทายาท"
                checked={authorize === "ทายาท"}
                onChange={this.handleChange}
                id={`inline-4`}
              />
            </Col>
          </Form.Group>
        </fieldset>

        {/* <Collapse in={authorizeNameOpen}>
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
        </Collapse> */}

        <Form.Group as={Row}>
          <Form.Label column sm={2}>
            ลายเซ็น
          </Form.Label>
          <Col>
            <Signature setRef={setSigpadRef}></Signature>
          </Col>
        </Form.Group>
      </React.Fragment>
    );
  }
}

export default CustomerVerifyForm;
