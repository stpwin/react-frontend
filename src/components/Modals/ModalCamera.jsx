import React, { Component, Fragment } from "react";
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
    mirrored: false,
    preview: false,
    dataUrl: ""
  };

  webcamRef = {};
  setWebcamRef = ref => {
    this.webcamRef = ref;
  };

  handleCapture = () => {
    const dataUri = this.webcamRef.takePhoto();
    this.setState({
      preview: true,
      dataUrl: dataUri
    });
  };

  handleReTake = () => {
    this.setState({
      preview: false,
      dataUrl: ""
    });
  };

  handleMirroredChange = e => {
    // console.log(e.target.checked);
    this.setState({
      mirrored: e.target.checked
    });
  };

  handleFinish = () => {
    const { onFinish } = this.props;
    onFinish && onFinish(this.state.dataUrl);
  };

  render() {
    const { mirrored, preview, dataUrl } = this.state;
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
                {preview ? (
                  <div style={{ overflow: "auto" }}>
                    <img alt="preview" src={dataUrl} width={600} height={400} />
                  </div>
                ) : (
                  <Webcam
                    ref={this.setWebcamRef}
                    showFocus={false}
                    width={600}
                    height={400}
                    mirrored={mirrored}
                    style={{ overflow: "auto" }}
                  />
                )}
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
                  {preview ? (
                    <Fragment>
                      <Button
                        variant="outline-secondary"
                        className="pea-color"
                        onClick={this.handleReTake}
                      >
                        ถ่ายใหม่
                      </Button>
                      <Button
                        variant="outline-secondary"
                        className="pea-color"
                        onClick={this.handleFinish}
                      >
                        เสร็จสิ้น
                      </Button>
                    </Fragment>
                  ) : (
                    <Button
                      variant="outline-secondary"
                      className="pea-color"
                      onClick={this.handleCapture}
                    >
                      ถ่ายภาพ
                    </Button>
                  )}

                  <Button
                    variant="outline-secondary"
                    className="pea-color"
                    onClick={onHide}
                  >
                    ยกเลิก
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
