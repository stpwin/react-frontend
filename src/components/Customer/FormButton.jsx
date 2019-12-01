import React, { Component } from "react";
import { Button, Form, Col, Row, Spinner } from "react-bootstrap";

export default class FormButton extends Component {
  render() {
    const { loading, cancel } = this.props;
    return (
      <Form.Group as={Row}>
        <Col>
          <Button type='submit' disabled={loading} className='btn-block'>
            {loading ? (
              <React.Fragment>
                <Spinner
                  as='span'
                  animation='border'
                  size='sm'
                  role='status'
                  aria-hidden='true'
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
            variant='warning'
            disabled={loading}
            className='btn-block'
            onClick={cancel}
          >
            ยกเลิก
          </Button>
        </Col>
      </Form.Group>
    );
  }
}
