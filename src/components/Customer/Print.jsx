import React, { Component } from "react";
import "./print.css";
import { ReactComponent as PEALogo } from "./pea-logo.svg";

import { getAddressStringByDistrictNo, getWarType } from "../../helpers";

class CustomerPrintData extends Component {
  render() {
    const { customer } = this.props;
    if (!customer) return;
    const {
      peaId,
      title,
      firstName,
      lastName,
      address,
      authorize,
      soldierNo,
      war,
      verifies
    } = customer;
    let privilegeDate;
    let appearDate;
    if (verifies && verifies.length > 0) {
      const lastVerify = verifies[verifies.length - 1];

      privilegeDate =
        lastVerify.privilegeDate &&
        new Date(lastVerify.privilegeDate).toLocaleDateString("th-TH", {
          // weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        });
      appearDate =
        lastVerify.appearDate &&
        new Date(lastVerify.appearDate).toLocaleDateString("th-TH", {
          // weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        });
    }

    return (
      // <div className='print-page-bg'>
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
              หมายเลขผู้ใช้ไฟ:{"\u00A0\u00A0"}
              <span>{`${peaId}`}</span>
            </p>
            <p className="">
              ชื่อ-สกุล:{"\u00A0\u00A0"}
              <span>{`${title}${firstName}\u00A0\u00A0${lastName}`}</span>
            </p>
            <p className="">
              ที่อยู่:{"\u00A0\u00A0"}
              {address ? (
                <span>
                  {`เลขที่ ${address.houseNo} หมู่ ${
                    address.mooNo
                    } ${getAddressStringByDistrictNo(address.districtNo)}`}
                </span>
              ) : (
                  <span>ไม่มีที่อยู่</span>
                )}
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
              <span>{`${war} ${getWarType(war)}`}</span>
            </p>
            <p className="">
              วันที่ได้รับสิทธิ์:{"\u00A0\u00A0"}
              {privilegeDate ? (
                <span>{privilegeDate}</span>
              ) : (
                  <SpaceUnderline />
                )}
            </p>
            <p className="">
              วันที่แสดงตน:{"\u00A0\u00A0"}
              {appearDate ? <span>{appearDate}</span> : <SpaceUnderline />}
            </p>
          </div>

          <div className="footer">
            <div className="footer-content">
              <p className="text-danger">
                <span>*ถ้าท่านไม่ได้รับสิทธิ์ตั้งแต่เดือนกุมภาพันธ์เป็นต้นไป โปรดแจ้งที่เบอร์ <u>08-6431-0603</u></span><br />
                <span>*หากท่านไม่โทรแจ้ง ท่านจะไม่ได้รับสิทธิ์ภายในเดือนถัดไป จนกว่าจะมีการแจ้งมายัง กฟภ.ลำปาง</span>
              </p>
              <p className="text-right small-text">
                พิมพ์เมื่อ{"\u00A0\u00A0"}
                {new Date().toLocaleDateString("th-TH", {
                  // weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric"
                })}
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
      // </div>
    );
  }
}

const SpaceUnderline = () => {
  return (
    <span style={{ textDecoration: "underline", whiteSpace: "pre" }}>
      {"\u00A0".repeat(30)}
    </span>
  );
};

export default CustomerPrintData;
