import React from "react";
import { Button, Form, Col, Row, Spinner } from "react-bootstrap";

export const FormButton = ({ loading, cancel }) => {

  return (
    <Form.Group as={Row} className="form-button justify-content-sm-center">
      <Col sm={3}>
        <Button
          type="submit"
          variant="outline-secondary"
          disabled={loading}
          className="pea-color btn-block mb-2"
        >
          {loading ? (
            <React.Fragment>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              <span className="ml-1">กำลังดำเนินการ...</span>
            </React.Fragment>
          ) : (
              "บันทึก"
            )}
        </Button>
      </Col>
      <Col sm={3}>
        <Button
          variant="outline-secondary"
          disabled={loading}
          className="pea-color btn-block"
          onClick={cancel}
        >
          ยกเลิก
          </Button>
      </Col>
      <div className="my-5"></div>
    </Form.Group>
  );
}

export default FormButton