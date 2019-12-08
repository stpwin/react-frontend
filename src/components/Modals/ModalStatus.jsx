import React, { Component } from "react";

import { Spinner, Modal, Button } from "react-bootstrap";

import { FaCheck, FaExclamationTriangle } from "react-icons/fa";

export class ModalStatus extends Component {
  render() {
    const { show, onHide, status, failtext } = this.props;
    return (
      <Modal
        show={show}
        onHide={onHide}
        size={failtext ? "lg" : "sm"}
        aria-labelledby='contained-modal-title-vcenter'
        centered
        backdrop='static'
      >
        <Modal.Body className='text-center'>
          {status === "getting" ? (
            <FetchingData />
          ) : status === "getok" ? (
            <FetchOk />
          ) : status === "getfail" ? (
            <FetchFail failtext={failtext} />
          ) : status === "saving" ? (
            <Saving />
          ) : status === "saved" ? (
            <Saved />
          ) : status === "require" ? (
            <Require />
          ) : status === "savefail" ? (
            <SaveFail failtext={failtext} />
          ) : status === "nodata" ? (
            <NoData />
          ) : status === "loading" ? (
            <Loading />
          ) : status === "deleting" ? (
            <Deleting />
          ) : status === "deleted" ? (
            <Deleted />
          ) : status === "deletefail" ? (
            <DeleteFail failtext={failtext} />
          ) : null}
        </Modal.Body>
        {failtext ? (
          <Modal.Footer>
            <Button variant='outline' className='pea-color' onClick={onHide}>
              ปิด
            </Button>
          </Modal.Footer>
        ) : null}
      </Modal>
    );
  }
}

const Deleted = () => {
  return (
    <React.Fragment>
      <div className='text-success'>
        <FaCheck size={32} />
      </div>

      <h4>ลบข้อมูลสำเร็จ</h4>
    </React.Fragment>
  );
};
const Deleting = () => {
  return (
    <React.Fragment>
      <Spinner
        as='span'
        animation='border'
        size='lg'
        role='status'
        aria-hidden='true'
      />
      <h4>กำลังลบข้อมูล...</h4>
    </React.Fragment>
  );
};
const DeleteFail = ({ failtext }) => {
  return (
    <React.Fragment>
      <div className='text-danger'>
        <FaExclamationTriangle size={32} />
      </div>

      <h4>ลบข้อมูลไม่สำเร็จ</h4>
      <p className='text-danger'>{failtext}</p>
    </React.Fragment>
  );
};

const FetchingData = () => {
  return (
    <React.Fragment>
      <Spinner
        as='span'
        animation='border'
        size='lg'
        role='status'
        aria-hidden='true'
      />
      <h4>กำลังเรียกข้อมูล...</h4>
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

const FetchFail = ({ failtext }) => {
  return (
    <React.Fragment>
      <div className='text-danger'>
        <FaExclamationTriangle size={32} />
      </div>

      <h4>เรียกข้อมูลไม่สำเร็จ</h4>
      <p className='text-danger'>{failtext}</p>
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

const SaveFail = ({ failtext }) => {
  return (
    <React.Fragment>
      <div className='text-danger'>
        <FaExclamationTriangle size={32} />
      </div>

      <h4>บันทึกข้อมูลไม่สำเร็จ</h4>
      <p className='text-danger'>{failtext}</p>
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

export default ModalStatus;
