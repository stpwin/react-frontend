import React from "react";
import { Button, Form, Col, Row, Spinner } from "react-bootstrap";

export const FormButton = ({ loading, cancel }) => {

  return (
    <Form.Group as={Row} className="form-button">
      <Col>
        <Button
          type="submit"
          variant="outline-secondary"
          disabled={loading}
          className="pea-color btn-block"
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
              {"  กำลังดำเนินการ..."}
            </React.Fragment>
          ) : (
              "บันทึก"
            )}
        </Button>
      </Col>
      <Col>
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