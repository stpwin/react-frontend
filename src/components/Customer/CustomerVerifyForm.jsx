import React, { Component, Fragment } from "react";
import "react-datepicker/dist/react-datepicker.css";

import DatePicker, { registerLocale } from "react-datepicker";
import th from "date-fns/locale/th";

import { Form, Col, Row, Button, ButtonToolbar } from "react-bootstrap";

import Signature from "./Signature";
import { ModalCamera } from "../Modals";

export class CustomerVerifyForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      appearDate: new Date(),
      signatureBase64: null,
      showCamera: false,
      capturedImage: null
    };

    this.sigPadRef = null;
    registerLocale("th", th);
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleAppearDateChange = date => {
    this.setState({
      appearDate: date
    });
    const { onAppearDateChange } = this.props;
    onAppearDateChange && onAppearDateChange(date);
  };

  handleShowCamera = () => {
    this.setState({
      showCamera: true
    });
  };

  handleCaptureFinish = data => {
    this.sigPadRef.fromDataURL(data);
    this.handleCameraClose();
  };

  handleCameraClose = () => {
    this.setState({
      showCamera: false
    });
  };

  setSigpadRef = ref => {
    this.sigPadRef = ref;
    const { setSigpadRef } = this.props;
    setSigpadRef && setSigpadRef(ref);
  };

  handleClearSigpad = () => {
    this.sigPadRef.clear()
  }


  render() {
    const {
      appearDate,
      showCamera

    } = this.state;
    return (
      <Fragment>
        <Form.Group as={Row}>
          <Form.Label as="legend" column sm={2}>
            วันที่มาแสดงตน
          </Form.Label>
          <Col sm={3}>
            <DatePicker
              inline
              locale="th"
              todayButton="เลือกวันนี้"
              className="form-control"
              selected={appearDate}
              dateFormatCalendar="LLLL yyyy"
              dateFormat="d MMMM y"
              onChange={this.handleAppearDateChange}
            ></DatePicker>
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column sm={2}>
            รูปถ่าย / ลายมือชื่อ
          </Form.Label>
          <Col className="vertical-divider">
            <Signature setSigpadRef={this.setSigpadRef} onClearSigpad={this.handleClearSigpad}></Signature>
          </Col>
          <Col className="text-center align-self-center">
            <ButtonToolbar>
              <Button
                variant="outline-secondary"
                className="pea-color"
                size="sm"
                onClick={this.handleShowCamera}
              >
                กล้อง
              </Button>
            </ButtonToolbar>
          </Col>
        </Form.Group>
        <ModalCamera
          show={showCamera}
          onHide={this.handleCameraClose}
          onFinish={this.handleCaptureFinish}
        />
      </Fragment>
    );
  }
}

export default CustomerVerifyForm;
