import React, { Component } from "react";

import { Spinner, Modal } from "react-bootstrap";

import { FaCheck, FaExclamationTriangle } from "react-icons/fa";

export class ModalStatus extends Component {
  render() {
    const { status } = this.props;
    return (
      <Modal
        {...this.props}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
      >
        <Modal.Body className="text-center">
          {status === "getting" ? (
            <div>
              <Spinner
                as="span"
                animation="border"
                size="lg"
                role="status"
                aria-hidden="true"
              />

              <h4>กำลังเรียกข้อมูล...</h4>
            </div>
          ) : status === "getfail" ? (
            <div>
              <div className="text-danger">
                <FaExclamationTriangle size={32} />
              </div>

              <h4>เรียกข้อมูลไม่สำเร็จ</h4>
            </div>
          ) : status === "saving" ? (
            <div>
              <Spinner
                as="span"
                animation="border"
                size="lg"
                role="status"
                aria-hidden="true"
              />
              <h4>กำลังบันทึกข้อมูล...</h4>
            </div>
          ) : status === "saved" ? (
            <div>
              <div className="text-success">
                <FaCheck size={32} />
              </div>

              <h4>บันทึกข้อมูลเสร็จสิ้น</h4>
            </div>
          ) : (
            <div>
              <div className="text-danger">
                <FaExclamationTriangle size={32} />
              </div>

              <h4>บันทึกข้อมูลไม่สำเร็จ</h4>
            </div>
          )}
        </Modal.Body>
      </Modal>
    );
  }
}

export default ModalStatus;
