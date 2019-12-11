import React, { Component } from "react";
import "./webcam.css";

import CameraPhoto, {
  FACING_MODES,
  IMAGE_TYPES
} from "jslib-html5-camera-photo";

export class Webcam extends Component {
  //   state = {
  //     dataUri: "",
  //     mirrored: true
  //   };
  cameraPhoto = null;
  videoRef = React.createRef();
  componentDidMount() {
    this.cameraPhoto = new CameraPhoto(this.videoRef.current);
    const idealResolution = { width: 600, height: 200 };
    this.startCamera(FACING_MODES.USER, idealResolution);
  }

  startCamera = (idealFacingMode, idealResolution) => {
    this.cameraPhoto
      .startCamera(idealFacingMode, idealResolution)
      .then(() => {
        console.log("camera is started");
      })
      .catch(err => {
        console.error(err);
      });
  };

  startCameraMaxResolution = idealFacingMode => {
    this.cameraPhoto
      .startCameraMaxResolution(idealFacingMode)
      .then(() => {
        console.log("camera is started");
      })
      .catch(err => {
        console.log(err);
      });
  };

  takePhoto = () => {
    console.log("take photo");
    const config = {
      sizeFactor: 1,
      imageType: IMAGE_TYPES.PNG,
      imageCompression: 0,
      isImageMirror: this.props.mirrored || false
    };

    return this.cameraPhoto.getDataUri(config);
    // console.log(dataUri);
    // this.setState({
    //   dataUri
    // });
  };

  stopCamera = () => {
    this.cameraPhoto
      .stopCamera()
      .then(() => {
        console.log("camera stopped.");
      })
      .catch(err => {
        console.log(err);
      });
  };

  componentWillUnmount() {
    this.stopCamera();
  }

  render() {
    // const { mirrored } = this.state;
    const { style = {}, mirrored } = this.props;
    const videoStyle = mirrored
      ? { ...style, transform: `${style.transform || ""} scaleX(-1)` }
      : style;
    return (
      <div style={videoStyle}>
        <video ref={this.videoRef} autoPlay={true} />
      </div>
    );
  }
}

export default Webcam;
