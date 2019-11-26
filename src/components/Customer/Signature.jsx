import React, { Component } from "react";
import { Button } from "react-bootstrap";

import SignatureCanvas from "react-signature-canvas";
import "./Signature.css";

class Signature extends Component {
  render() {
    return (
      <div>
        <SignatureCanvas
          ref={this.props.setRef}
          penColor="black"
          backgroundColor="white"
          canvasProps={{
            width: 500,
            height: 200,
            className: "sigCanvas"
          }}
        />
        <Button variant="danger" size="sm" onClick={this.props.clear}>
          ล้างลายเซ็น
        </Button>
      </div>
    );
  }
}

export default Signature;
