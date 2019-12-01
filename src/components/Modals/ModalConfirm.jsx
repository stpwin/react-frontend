import React, { Component } from "react";

import { Spinner, Modal, Button } from "react-bootstrap";

import { FaCheck, FaExclamationTriangle } from "react-icons/fa";

export class ModalConfirm extends Component {
  render() {
    const { status, confirm, close } = this.props;
    return (
      <Modal
        {...this.props}
        size='sm'
        aria-labelledby='contained-modal-title-vcenter'
        centered
        backdrop='static'
      >
        <Modal.Body className='text-center'>
          {status === "datachanged" ? (
            <DataChanged />
          ) : status === "getok" ? (
            <FetchOk />
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
          <Button variant='secondary' onClick={close}>
            ปิด
          </Button>
          <Button variant='warning' onClick={confirm}>
            ยืนยัน
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

const DataChanged = () => {
  return (
    <React.Fragment>
      {/* <Spinner
        as='span'
        animation='border'
        size='lg'
        role='status'
        aria-hidden='true'
      /> */}
      <h4>ข้อมูลมีการแก้ไข ต้องการยกเลิกหรือไม่?</h4>
    </React.Fragment>
  );
};

const FetchOk = () => {
  return (
    <React.Fragment>
      <FaCheck />
      <h4>เรียกข้อมูลสำเร็จ</h4>
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
