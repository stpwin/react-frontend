import React, { Component, Fragment } from "react";
import "./webcam.css";

import CameraPhoto, {
  FACING_MODES,
  IMAGE_TYPES
} from "jslib-html5-camera-photo";

export class Webcam extends Component {
  cameraPhoto = null;
  videoRef = React.createRef();

  componentDidMount() {
    this.cameraPhoto = new CameraPhoto(this.videoRef.current);
    this.startWebcam();
  }

  startCamera = (idealFacingMode, idealResolution) => {
    this.cameraPhoto
      .startCamera(idealFacingMode, idealResolution)
      .then(() => {
        // console.log("camera is started");
      })
      .catch(err => {
        console.error(err);
      });
  };

  startCameraMaxResolution = idealFacingMode => {
    this.cameraPhoto
      .startCameraMaxResolution(idealFacingMode)
      .then(() => {
        // console.log("camera is started");
      })
      .catch(err => {
        console.log(err);
      });
  };

  takePhoto = () => {
    // console.log("take photo");
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
        // console.log("camera stopped.");
      })
      .catch(err => {
        console.log(err);
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
