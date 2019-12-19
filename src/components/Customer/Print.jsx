import React, { Component, Fragment } from "react";
import "./print.css";
import { arrayBufferToBase64 } from "../../helpers";
import { ReactComponent as PEALogo } from "./pea-logo.svg";
import { Image } from "react-bootstrap";

class CustomerPrintData extends Component {
  render() {
    const { customer, appearDate, signature, printDate } = this.props;
    if (!customer) return <div></div>;
    const { peaId, name, address, authorize, soldierNo, war } = customer;

    return (
      <div className="page">
        <div className="subpage">
          <div className="content">
            <div className="text-center">
              <PEALogo width="200px" />
            </div>

            <br />
            <br />
            <h4 className="text-center">ขอส่วนลดค่าไฟฟ้าของทหารผ่านศึก</h4>
            <br />
            <p className="">
              หมายเลขผู้ใช้ไฟ(CA):{"\u00A0\u00A0"}
              <span>{peaId}</span>
            </p>
            <p className="">
              ชื่อ-สกุล:{"\u00A0\u00A0"}
              <span>{name}</span>
            </p>
            <p className="">
              ที่อยู่:{"\u00A0\u00A0"}
              {address ? <span>{address}</span> : <SpaceUnderline n={100} />}
            </p>
            <p className="">
              กรณีเป็น:{"\u00A0\u00A0"}
              {authorize ? <span>{`${authorize}`}</span> : <SpaceUnderline />}
            </p>
            <p className="">
              เลขประจำตัวทหาร:{"\u00A0\u00A0"}
              {soldierNo ? <span>{`${soldierNo}`}</span> : <SpaceUnderline />}
            </p>
            <p className="">
              ลดสิทธิ์สงคราม:{"\u00A0\u00A0"}
              <span>{war}</span>
            </p>
            {/* <p className="">
              วันที่ได้รับสิทธิ์:{"\u00A0\u00A0"}
              {privilegeDate ? (
                <span>{privilegeDate}</span>
              ) : (
                <SpaceUnderline />
              )}
            </p> */}
            <p className="">
              วันที่แสดงตน:{"\u00A0\u00A0"}
              {appearDate ? <span>{appearDate}</span> : <SpaceUnderline />}
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
                    <p>( {name} )</p>
                  </Fragment>
                )}
            </div>
          </div>

          <div className="footer">
            <div className="footer-content">
              <p className="text-danger">
                <span>
                  *ถ้าท่านไม่ได้รับสิทธิ์ตั้งแต่เดือนกุมภาพันธ์เป็นต้นไป
                  โปรดแจ้งที่เบอร์ <u>08-6431-0603</u>
                </span>
                <br />
                <span>
                  *หากท่านไม่โทรแจ้ง ท่านจะไม่ได้รับสิทธิ์ภายในเดือนถัดไป
                  จนกว่าจะมีการแจ้งมายัง กฟภ.ลำปาง
                </span>
              </p>
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
    <span style={{ textDecoration: "underline", whiteSpace: "pre" }}>
      {"\u00A0".repeat(n || 40)}
    </span>
  );
};

export default CustomerPrintData;
