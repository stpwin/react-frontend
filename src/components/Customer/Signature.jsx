import React from "react";
import { Button, ButtonToolbar, Row, Col } from "react-bootstrap";

import SignatureCanvas from "react-signature-canvas";
import "./Signature.css";

export const Signature = ({ setSigpadRef, onClearSigpad }) => {
  return (
    <React.Fragment>
      <Row>
        <Col>
          <div style={{ overflow: "auto" }} className="mb-2">
            <SignatureCanvas
              ref={setSigpadRef}
              penColor="black"
              backgroundColor="white"
              canvasProps={{
                width: 600,
                height: 400,
                className: "sigCanvas"
              }}
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col className="text-right">
          <ButtonToolbar>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={onClearSigpad}
            >
              ล้างลายเซ็น
              </Button>
          </ButtonToolbar>
        </Col>
      </Row>
    </React.Fragment>
  );
}

export default Signature;
