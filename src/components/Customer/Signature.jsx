import React, { Component } from "react";
import { Button } from "react-bootstrap";

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
        <SignatureCanvas
          ref={this.setSigpadRef}
          penColor='black'
          backgroundColor='white'
          canvasProps={{
            width: 500,
            height: 200,
            className: "sigCanvas"
          }}
        />
        <Button variant='danger' size='sm' onClick={this.clearSigpad}>
          ล้างลายเซ็น
        </Button>
      </React.Fragment>
    );
  }
}

export default Signature;
