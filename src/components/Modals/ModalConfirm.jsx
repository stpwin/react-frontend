import React, { Component } from "react";

import { Spinner, Modal, Button } from "react-bootstrap";

import {
  FaCheck,
  FaExclamationTriangle,
  FaQuestionCircle
} from "react-icons/fa";

export class ModalConfirm extends Component {
  render() {
    const { show, status, confirm, confirmtext, onHide } = this.props;
    return (
      <Modal
        // {...this.props}
        // size="sm"
        show={show}
        onHide={onHide}
        aria-labelledby='contained-modal-title-vcenter'
        centered
        // backdrop="static"
      >
        <Modal.Header>
          <div className='pea-color'>
            <FaQuestionCircle size={32} />
          </div>
          {/* <Modal.Title>Modal title</Modal.Title> */}
        </Modal.Header>

        <Modal.Body className='text-center'>
          {status === "datachanged" ? (
            <DataChanged />
          ) : status === "delete" ? (
            <ConfirmDelete confirmtext={confirmtext} />
          ) : status === "getfail" ? (
            <FetchFail />
          ) : status === "saving" ? (
            <Saving />
          ) : status === "saved" ? (
            <Saved />
          ) : status === "require" ? (
            <Require />
          ) : status === "savefail" ? (
            <SaveFail />
          ) : status === "nodata" ? (
            <NoData />
          ) : status === "loading" ? (
            <Loading />
          ) : null}
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant='outline-danger'
            className='pea-color'
            onClick={confirm}
          >
            ยืนยัน
          </Button>
          <Button variant='outline-success' onClick={onHide}>
            ปิด
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

const DataChanged = () => {
  return (
    <React.Fragment>
      <h4>ข้อมูลมีการแก้ไข ต้องการยกเลิกหรือไม่?</h4>
    </React.Fragment>
  );
};

const ConfirmDelete = ({ confirmtext }) => {
  return (
    <React.Fragment>
      <h4>
        คุณต้องการลบ <span className='text-danger'>{confirmtext}</span> หรือไม่
      </h4>
    </React.Fragment>
  );
};

const Require = () => {
  return (
    <React.Fragment>
      <div className='text-danger'>
        <FaExclamationTriangle size={32} />
      </div>

      <h4>กรอกข้อมูลไม่ครบ</h4>
    </React.Fragment>
  );
};

const FetchFail = () => {
  return (
    <React.Fragment>
      <div className='text-danger'>
        <FaExclamationTriangle size={32} />
      </div>

      <h4>เรียกข้อมูลไม่สำเร็จ</h4>
    </React.Fragment>
  );
};

const Saving = () => {
  return (
    <React.Fragment>
      <Spinner
        as='span'
        animation='border'
        size='lg'
        role='status'
        aria-hidden='true'
      />
      <h4>กำลังบันทึกข้อมูล...</h4>
    </React.Fragment>
  );
};

const Saved = () => {
  return (
    <React.Fragment>
      <div className='text-success'>
        <FaCheck size={32} />
      </div>

      <h4>บันทึกข้อมูลเสร็จสิ้น</h4>
    </React.Fragment>
  );
};

const SaveFail = () => {
  return (
    <React.Fragment>
      <div className='text-danger'>
        <FaExclamationTriangle size={32} />
      </div>

      <h4>บันทึกข้อมูลไม่สำเร็จ</h4>
    </React.Fragment>
  );
};

const Loading = () => {
  return (
    <React.Fragment>
      <Spinner
        as='span'
        animation='border'
        size='lg'
        role='status'
        aria-hidden='true'
      />

      <h4>กำลังโหลด...</h4>
    </React.Fragment>
  );
};

const NoData = () => {
  return (
    <React.Fragment>
      <div className='text-danger'>
        <FaExclamationTriangle size={32} />
      </div>

      <h4>ไม่พบข้อมูล</h4>
    </React.Fragment>
  );
};

export default ModalConfirm;
