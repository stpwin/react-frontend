import React, { Component, Fragment } from "react";
import "./print.css";
import { arrayBufferToBase64 } from "../../helpers";
import { ReactComponent as PEALogo } from "./pea-logo.svg";
import { Image } from "react-bootstrap";

class CustomerPrintData extends Component {
  render() {
    const { customer, appearDate, signature, printDate } = this.props;
    if (!customer) return <div></div>;
    const { peaId, name, address, authorize, soldierNo, war, seq } = customer;

    return (
      <div className="page">
        <div className="subpage">
          <div className="content">
            <div
              style={{
                marginTop: "-10mm",
                marginRight: "-15mm",
                float: "right",
                border: "1px solid black",
                padding: "1mm 3mm 1mm 3mm",
                borderRadius: "2mm"
              }}
            >
              ลำดับ:
              <b>
                {war
                  ? `\u00A0\u00A0${seq}`
                  : "\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0"}
              </b>
            </div>
            <div className="text-center">
              <PEALogo width="200px" />
            </div>

            <br />
            <br />
            <h4 className="text-center">ขอส่วนลดค่าไฟฟ้าของทหารผ่านศึก</h4>
            <br />
            <p className="">
              หมายเลขผู้ใช้ไฟ(CA):{"\u00A0\u00A0"}
              {peaId ? <b>{peaId}</b> : <SpaceUnderline n={50} />}
            </p>
            <p className="">
              ชื่อ-สกุล:{"\u00A0\u00A0"}
              {name ? <b>{name}</b> : <SpaceUnderline n={71} />}
            </p>
            <p className="">
              ที่อยู่:{"\u00A0\u00A0"}
              {address ? <b>{address}</b> : <SpaceUnderline n={100} />}
            </p>
            <p className="">
              กรณีเป็น:{"\u00A0\u00A0"}
              {authorize ? <b>{`${authorize}`}</b> : <SpaceUnderline />}
            </p>
            <p className="">
              เลขประจำตัวทหาร:{"\u00A0\u00A0"}
              {soldierNo ? <b>{`${soldierNo}`}</b> : <SpaceUnderline n={44} />}
            </p>
            <p className="">
              ลดสิทธิ์สงคราม:{"\u00A0\u00A0"}
              {war ? <b>{`${war}`}</b> : <SpaceUnderline n={50} />}
            </p>
            <p className="">
              วันที่แสดงตน:{"\u00A0\u00A0"}
              {appearDate ? <b>{appearDate}</b> : <SpaceUnderline />}
            </p>
            <br />
            <div className="text-center">
              {signature ? (
                <Fragment>
                  <p>รูปถ่าย / ลายมือชื่อ</p>
                  <Image
                    width="300px"
                    // height="300px"
                    src={`data:image/png;base64,${arrayBufferToBase64(
                      signature.data
                    )}`}
                  />
                </Fragment>
              ) : (
                <Fragment>
                  <p>ลายมือชื่อ</p>
                  <div
                    style={{
                      border: "1px solid #dedede",
                      width: "300px",
                      height: "100px",
                      marginBottom: "1rem",
                      display: "inline-block"
                    }}
                  ></div>
                  <br />
                  <p>( {name || <SpaceUnderline n={50} />} )</p>
                </Fragment>
              )}
            </div>
          </div>

          <div className="footer">
            <div className="footer-content">
              <mark>
                <span>
                  *ถ้าท่านไม่ได้รับสิทธิ์ตั้งแต่เดือนกุมภาพันธ์เป็นต้นไป
                  โปรดแจ้งที่เบอร์ <b>08-6431-0603</b>
                </span>
                <br />
                <span>
                  *หากท่านไม่โทรแจ้ง ท่านจะไม่ได้รับสิทธิ์ภายในเดือนถัดไป
                  จนกว่าจะมีการแจ้งมายัง กฟภ.ลำปาง
                </span>
              </mark>
              <p className="text-right small-text">
                พิมพ์เมื่อ{"\u00A0\u00A0"}
                {printDate}
              </p>
              <hr />
              <h6 className="text-center">การไฟฟ้าส่วนภูมิภาคจังหวัดลำปาง</h6>
              <p className="text-center small-text">
                Lampang Provincial Electricity Authority
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const SpaceUnderline = ({ n }) => {
  return (
    <span
      style={{ textDecoration: "underline", whiteSpace: "pre", color: "grey" }}
    >
      {"\u00A0".repeat(n || 40)}
    </span>
  );
};

export default CustomerPrintData;
