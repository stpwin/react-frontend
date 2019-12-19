import React, { Component } from "react";
import { Button, ButtonToolbar, Row, Col } from "react-bootstrap";

import SignatureCanvas from "react-signature-canvas";
import "./Signature.css";

class Signature extends Component {
  sigpad = {};
  setSigpadRef = ref => {
    this.sigpad = ref;
    this.props.setRef(ref);
  };

  clearSigpad = () => {
    this.sigpad.clear();
  };

  render() {
    return (
      <React.Fragment>
        <Row>
          <Col>
            <div style={{ overflow: "auto" }} className="mb-2">
              <SignatureCanvas
                ref={this.setSigpadRef}
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
                onClick={this.clearSigpad}
              >
                ล้างลายเซ็น
              </Button>
            </ButtonToolbar>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default Signature;
