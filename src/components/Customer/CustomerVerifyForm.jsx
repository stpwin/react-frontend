import React, { Component, Fragment } from "react";
import "react-datepicker/dist/react-datepicker.css";

import DatePicker, { registerLocale } from "react-datepicker";
import th from "date-fns/locale/th";

import { Form, Col, Row, Button, ButtonToolbar } from "react-bootstrap";

import Signature from "./Signature";
import { ModalCamera } from "../Modals";

export class CustomerVerifyForm extends Component {
  state = {
    dateAppear: new Date(),
    signatureBase64: null,
    authorizeNameOpen: false,
    showCamera: true
  };

  UNSAFE_componentWillMount() {
    registerLocale("th", th);
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleDateChange = date => {
    // console.log(date);
    this.setState({
      dateAppear: date
    });
    const { handleAppearDateChange } = this.props;
    handleAppearDateChange && handleAppearDateChange(date);
  };

  handleShowCamera = () => {
    this.setState({
      showCamera: true
    });
  };

  handleCaptureCamera = () => {};

  handleCameraClose = () => {
    this.setState({
      showCamera: false
    });
  };

  render() {
    const { dateAppear, showCamera } = this.state;
    const { setSigpadRef } = this.props;
    return (
      <Fragment>
        <Form.Group as={Row}>
          <Form.Label as='legend' column sm={2}>
            วันที่มาแสดงตน
          </Form.Label>
          <Col sm={3}>
            <DatePicker
              locale='th'
              todayButton='เลือกวันนี้'
              className='form-control'
              selected={dateAppear}
              dateFormatCalendar='LLLL yyyy'
              dateFormat='d MMMM y'
              onChange={this.handleDateChange}
              // name='dateAppear'
            ></DatePicker>
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column sm={2}>
            ลายเซ็น
          </Form.Label>
          <Col className='vertical-divider'>
            <Signature setRef={setSigpadRef}></Signature>
          </Col>
          <Col className='text-center align-self-center'>
            <ButtonToolbar>
              <Button
                variant='outline'
                className='pea-color'
                size='sm'
                onClick={this.getQRLink}
              >
                รับลิ้งก์ QR Code
              </Button>
              <Button
                variant='outline'
                className='pea-color'
                size='sm'
                onClick={this.handleShowCamera}
              >
                กล้อง
              </Button>
              <Button variant='outline' className='pea-color' size='sm'>
                อัพโหลด
              </Button>
            </ButtonToolbar>
          </Col>
        </Form.Group>
        <ModalCamera
          show={showCamera}
          onHide={this.handleCameraClose}
          onCapture={this.handleCaptureCamera}
        />
      </Fragment>
    );
  }
}

export default CustomerVerifyForm;
