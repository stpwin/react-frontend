import React, { Component } from "react";
// import Webcam from "react-webcam";
import { Webcam } from "../Webcam";

import {
  Modal,
  ButtonToolbar,
  Button,
  Row,
  Col,
  Container,
  FormCheck
} from "react-bootstrap";

export class ModalCamera extends Component {
  state = {
    mirrored: false
  };

  webcamRef = {};
  setWebcamRef = ref => {
    this.webcamRef = ref;
  };

  handleCapture = () => {
    console.log("on capture");
    const dataUri = this.webcamRef.takePhoto();
    const { onCapture } = this.props;
    onCapture && onCapture(dataUri);
    // const imageSrc = this.webcamRef.getScreenshot();
    // console.log(imageSrc);
  };

  handleMirroredChange = e => {
    // console.log(e.target.checked);
    this.setState({
      mirrored: e.target.checked
    });
  };

  render() {
    const { mirrored } = this.state;
    const { show, onHide } = this.props;
    return (
      <Modal size="lg" show={show} onHide={onHide}>
        <Modal.Header>
          <Modal.Title>ถ่ายภาพ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row>
              <Col className="text-center">
                <Webcam
                  ref={this.setWebcamRef}
                  showFocus={false}
                  width={600}
                  height={200}
                  mirrored={mirrored}
                  style={{ overflow: "auto" }}
                />
                {/* <Webcam
                  width={600}
                  height={200}
                  ref={ref => (this.webcamRef = ref)}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  // minScreenshotWidth={600}
                  // minScreenshotHeight={200}
                  screenshotQuality={1}
                  mirrored={mirrored}
                /> */}

                {/* <canvas width={600} height={200} /> */}
              </Col>
            </Row>
          </Container>
        </Modal.Body>

        <Modal.Footer>
          <Container>
            <Row>
              <Col>
                <FormCheck
                  custom
                  inline
                  key={`check-mirrored`}
                  name={`check-mirrored`}
                  label={"กลับด้าน"}
                  checked={mirrored}
                  onChange={this.handleMirroredChange}
                  id={`check-mirrored`}
                />
              </Col>
              <Col className="text-right align-self-center">
                <ButtonToolbar>
                  <Button
                    variant="outline-success"
                    className="pea-color"
                    onClick={this.handleCapture}
                  >
                    ถ่ายภาพ
                  </Button>
                  <Button
                    variant="outline-secondary"
                    className="pea-color"
                    onClick={onHide}
                  >
                    ปิด
                  </Button>
                </ButtonToolbar>
              </Col>
            </Row>
          </Container>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default ModalCamera;
