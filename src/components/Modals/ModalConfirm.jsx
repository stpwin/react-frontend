import React from "react";

import { Spinner, Modal, Button } from "react-bootstrap";

import {
  FaCheck,
  FaExclamationTriangle,
  FaQuestionCircle
} from "react-icons/fa";

export const ModalConfirm = ({
  show,
  status,
  confirm,
  confirmtext,
  onHide
}) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>

        {status === "risk" ?
          (<FaExclamationTriangle className="text-danger" size={32} />)
          :
          (<FaQuestionCircle className="pea-color" size={32} />)
        }


        {/* <Modal.Title>Modal title</Modal.Title> */}
      </Modal.Header>

      <Modal.Body className="text-center">
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
        ) : status === "risk" ? (
          <Risk confirmtext={confirmtext} />
        ) : null}
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="outline-secondary"
          className="pea-color"
          onClick={confirm}
        >
          ยืนยัน
        </Button>
        <Button variant="outline-secondary" onClick={onHide}>
          ปิด
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const Risk = ({ confirmtext }) => {
  return <div>{confirmtext}</div>;
};

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
        คุณต้องการลบ <span className="text-danger">{confirmtext}</span> หรือไม่
      </h4>
    </React.Fragment>
  );
};

const Require = () => {
  return (
    <React.Fragment>
      <div className="text-danger">
        <FaExclamationTriangle size={32} />
      </div>

      <h4>กรอกข้อมูลไม่ครบ</h4>
    </React.Fragment>
  );
};

const FetchFail = () => {
  return (
    <React.Fragment>
      <div className="text-danger">
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
        as="span"
        animation="border"
        size="lg"
        role="status"
        aria-hidden="true"
      />
      <h4>กำลังบันทึกข้อมูล...</h4>
    </React.Fragment>
  );
};

const Saved = () => {
  return (
    <React.Fragment>
      <div className="text-success">
        <FaCheck size={32} />
      </div>

      <h4>บันทึกข้อมูลเสร็จสิ้น</h4>
    </React.Fragment>
  );
};

const SaveFail = () => {
  return (
    <React.Fragment>
      <div className="text-danger">
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
        as="span"
        animation="border"
        size="lg"
        role="status"
        aria-hidden="true"
      />

      <h4>กำลังโหลด...</h4>
    </React.Fragment>
  );
};

const NoData = () => {
  return (
    <React.Fragment>
      <div className="text-danger">
        <FaExclamationTriangle size={32} />
      </div>

      <h4>ไม่พบข้อมูล</h4>
    </React.Fragment>
  );
};

export default ModalConfirm;
