import React, { Component } from "react";
import "react-datepicker/dist/react-datepicker.css";

import DatePicker, { registerLocale } from "react-datepicker";
import th from "date-fns/locale/th";

import Signature from "./Signature";
import { Form, Col, Row, Button, ButtonToolbar } from "react-bootstrap";

class CustomerVerifyForm extends Component {
  state = {
    dateAppear: new Date(),
    signatureBase64: null,
    authorizeNameOpen: false
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
    this.setState({
      dateAppear: date
    });
  };

  render() {
    const { dateAppear } = this.state;
    const { setSigpadRef } = this.props;
    return (
      <React.Fragment>
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
              name='dateAppear'
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
                onClick={this.camera}
              >
                กล้อง
              </Button>
              <Button
                variant='outline'
                className='pea-color'
                size='sm'
                onClick={this.camera}
              >
                อัพโหลด
              </Button>
            </ButtonToolbar>
          </Col>
        </Form.Group>
      </React.Fragment>
    );
  }
}

export default CustomerVerifyForm;
