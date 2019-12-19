import React, { Component, Fragment } from "react";
import "./webcam.css";

import CameraPhoto, {
  FACING_MODES,
  IMAGE_TYPES
} from "jslib-html5-camera-photo";

export class Webcam extends Component {
  constructor(props) {
    super(props);
    this.videoRef = React.createRef();
  }

  componentDidMount() {
    this.cameraPhoto = new CameraPhoto(this.videoRef.current);
    this.startWebcam();
  }

  startCamera = (idealFacingMode, idealResolution) => {
    this.cameraPhoto
      .startCamera(idealFacingMode, idealResolution)
      .then(() => {
      })
      .catch(err => {
      });
  };

  startCameraMaxResolution = idealFacingMode => {
    this.cameraPhoto
      .startCameraMaxResolution(idealFacingMode)
      .then(() => {
      })
      .catch(err => {
      });
  };

  takePhoto = () => {
    const config = {
      sizeFactor: 1,
      imageType: IMAGE_TYPES.PNG,
      imageCompression: 0,
      isImageMirror: this.props.mirrored || false
    };
    const dataUrl = this.cameraPhoto.getDataUri(config);
    return dataUrl;
  };

  startWebcam = () => {
    const { width, height } = this.props;
    this.startCamera(FACING_MODES.USER, { width, height });
  };

  stopWebcam = () => {
    this.cameraPhoto
      .stopCamera()
      .then(() => {
      })
      .catch(err => {
      });
  };

  componentWillUnmount() {
    this.stopWebcam();
  }

  render() {
    const { style = {}, mirrored } = this.props;
    const videoStyle = mirrored
      ? { ...style, transform: `${style.transform || ""} scaleX(-1)` }
      : style;
    return (
      <Fragment>
        <div style={videoStyle}>
          <video ref={this.videoRef} autoPlay={true} />
        </div>
      </Fragment>
    );
  }
}

export default Webcam;
