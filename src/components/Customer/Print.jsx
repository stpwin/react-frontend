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
      privilegeDate,
      verifies
    } = customer;

    return (
      // <div className='print-page-bg'>
      <div className='page'>
        <div className='subpage'>
          <div className='content'>
            <div className='text-center'>
              <PEALogo width='200px' />
            </div>

            <br />
            <br />
            <h4 className='text-center'>การขอส่วนลดค่าไฟฟ้าของทหารผ่านศึก</h4>
            <br />
            <p className=''>
              หมายเลขผู้ใช้ไฟ: <span>{`${peaId}`}</span>
            </p>
            <p className=''>
              ชื่อ-สกุล: <span>{`${title}${firstName} ${lastName}`}</span>
            </p>
            <p className=''>
              ที่อยู่:{" "}
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
            <p className=''>
              กรณีเป็น: <span>{`${authorize}`}</span>
            </p>
            <p className=''>
              เลขที่บัตรประจำตัวทหาร: <span>{`${soldierNo}`}</span>
            </p>
            <p className=''>
              ลดสิทธิ์สงคราม: <span>{`${war} ${getWarType(war)}`}</span>
            </p>
            <p className=''>
              วันที่ได้รับสิทธิ์:{" "}
              {privilegeDate ? (
                <span>
                  {new Date(privilegeDate).toLocaleDateString("th-TH", {
                    // weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}
                </span>
              ) : (
                <span>_____________________________</span>
              )}
            </p>
            <p className=''>
              วันที่แสดงตน:{" "}
              {verifies ? (
                <span>
                  {new Date(
                    verifies[verifies.length - 1].dateAppear
                  ).toLocaleDateString("th-TH", {
                    // weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                  })}
                </span>
              ) : (
                <span>_____________________________</span>
              )}
            </p>
          </div>

          <div className='footer'>
            <div className='footer-content'>
              <p className='text-right small-text'>
                พิมพ์เมื่อ{" "}
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
              <h6 className='text-center'>การไฟฟ้าส่วนภูมิภาคจังหวัดลำปาง</h6>
              <p className='text-center small-text'>
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

export default CustomerPrintData;
