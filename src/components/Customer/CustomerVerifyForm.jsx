import React, { Component, Fragment } from "react";
import "react-datepicker/dist/react-datepicker.css";

import DatePicker, { registerLocale } from "react-datepicker";
import th from "date-fns/locale/th";

import { Form, Col, Row, Button, ButtonToolbar } from "react-bootstrap";

import Signature from "./Signature";
import { ModalCamera } from "../Modals";

export class CustomerVerifyForm extends Component {
  state = {
    appearDate: new Date(),
    privilegeDate: new Date(),
    noPrivilegeDate: true,
    signatureBase64: null,
    // authorizeNameOpen: false,
    showCamera: false,
    capturedImage: null
  };

  sigPadRef = {};

  UNSAFE_componentWillMount() {
    registerLocale("th", th);
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleAppearDateChange = date => {
    // console.log(date);
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

  handlePrivilegeDateChange = date => {
    this.setState({
      privilegeDate: date
    });
    const { onPrivilegeDateChange } = this.props;
    onPrivilegeDateChange && onPrivilegeDateChange(date);
  };

  setSigpadRef = ref => {
    this.sigPadRef = ref;
    const { setSigpadRef } = this.props;
    setSigpadRef && setSigpadRef(ref);
  };

  handleNoPrivilegeDateChange = e => {
    this.setState({
      noPrivilegeDate: e.target.checked
    }, () => {
      const { onPrivilegeDateChange } = this.props;
      onPrivilegeDateChange && onPrivilegeDateChange(this.state.noPrivilegeDate ? null : this.state.privilegeDate);
    })
    // console.log(e)
  }

  render() {
    const { appearDate, showCamera, privilegeDate, noPrivilegeDate } = this.state;
    // console.log("privilegeDate", typeof privilegeDate);
    // const { setSigpadRef } = this.props;
    return (
      <Fragment>
        <Form.Group as={Row}>
          <Form.Label as="legend" column sm={2}>
            วันที่ได้รับสิทธิ์
          </Form.Label>
          <Col sm={3}>
            <DatePicker
              inline={!noPrivilegeDate}
              locale="th"
              todayButton="เลือกวันนี้"
              className="form-control"
              selected={noPrivilegeDate ? null : privilegeDate}
              dateFormatCalendar="LLLL yyyy"
              dateFormat="d MMMM y"
              onChange={this.handlePrivilegeDateChange}
              disabled={noPrivilegeDate}
              placeholderText="ไม่ระบุ"
            />
          </Col>
          <Col className="align-self-center">
            <Form.Check
              id="noPrivilegeDate"
              inline
              custom
              type="checkbox"
              label="ไม่ระบุ"
              name="noPrivilegeDate"
              // value="noPrivilegeDate"
              checked={noPrivilegeDate}
              onChange={this.handleNoPrivilegeDateChange}
            />
          </Col>
        </Form.Group>

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
            // name='appearDate'
            ></DatePicker>
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column sm={2}>
            ลายเซ็น
          </Form.Label>
          <Col className="vertical-divider">
            <Signature setRef={this.setSigpadRef}></Signature>
          </Col>
          <Col className="text-center align-self-center">
            <ButtonToolbar>
              {/* <Button
                variant="outline"
                className="pea-color"
                size="sm"
                onClick={this.getQRLink}
              >
                รับลิ้งก์ QR Code
              </Button> */}
              <Button
                variant="outline"
                className="pea-color"
                size="sm"
                onClick={this.handleShowCamera}
              >
                กล้อง
              </Button>
              <Button variant="outline" className="pea-color" size="sm">
                อัพโหลด
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
