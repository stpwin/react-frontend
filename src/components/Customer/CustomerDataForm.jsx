import React, { Component } from "react";
import {
  Form,
  FormControl,
  InputGroup,
  Col,
  Row,
  Spinner
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaCheck, FaExclamation, FaTimes } from "react-icons/fa";

import { authHeader, handleFetchError, correctPostcode } from "../../helpers";
import config from "../../config";

class CustomerDataForm extends Component {
  state = {
    peaId: (this.props.initial && this.props.initial.peaId) || "",
    title: (this.props.initial && this.props.initial.title) || "",
    firstName: (this.props.initial && this.props.initial.firstName) || "",
    lastName: (this.props.initial && this.props.initial.lastName) || "",
    houseNo: (this.props.initial && this.props.initial.houseNo) || "",
    mooNo: (this.props.initial && this.props.initial.mooNo) || "",
    districtNo: (this.props.initial && this.props.initial.districtNo) || "",
    postcode: (this.props.initial && this.props.initial.postcode) || 52000,
    soldierNo: (this.props.initial && this.props.initial.soldierNo) || "",
    war: (this.props.initial && this.props.initial.war) || "",
    peaIdOk: true,
    fetchPeaIdComplete: true,
    existsPeaCustomer: false,
    peaWarnText: ""
  };

  //   componentDidUpdate(prevProps, prevState) {
  //     if (prevState.peaId !== this.state.peaId) {
  //       console.log("Hello");
  //       this.setState({
  //         peaId: (props.initial && props.initial.peaId) || "",
  //         title: (props.initial && props.initial.title) || "",
  //         firstName: (props.initial && props.initial.firstName) || "",
  //         lastName: (props.initial && props.initial.lastName) || "",
  //         houseNo: (props.initial && props.initial.houseNo) || "",
  //         mooNo: (props.initial && props.initial.mooNo) || "",
  //         districtNo: (props.initial && props.initial.districtNo) || "",
  //         postcode: (props.initial && props.initial.postcode) || 52000,
  //         soldierNo: (props.initial && props.initial.soldierNo) || "",
  //         war: (props.initial && props.initial.war) || ""
  //       });
  //     }
  //   }

  validatePeaId = peaId => {
    if (peaId.length === 11) {
      return true;
    }
    return false;
  };
  checkCustomerExists = peaId => {
    // this.setState({
    //   fetchPeaIdComplete: false
    // });
    this.setState({
      fetchPeaIdComplete: false,
      existsPeaCustomer: false,
      peaWarnText: "กำลังตรวจสอบหมายเลขผู้ใช้ไฟ..."
    });
    const customer = this.getCustomerByPeaId(peaId);
    customer
      .then(res => {
        this.setState({
          fetchPeaIdComplete: true,
          existsPeaCustomer: res ? true : false,
          peaWarnText: res ? "หมายเลขผู้ใช้ไฟนี้มีอยู่ในระบบแล้ว" : ""
        });
      })
      .catch(() => {
        this.setState({
          peaWarnText: "เซิฟเวอร์ขัดข้อง",
          fetchPeaIdComplete: true,
          existsPeaCustomer: true
        });
      });
  };

  getCustomerByPeaId = peaId => {
    const requestOptions = {
      method: "GET",
      headers: authHeader()
    };

    return fetch(
      `${config.apiUrl}/api/customers/peaid/${peaId}`,
      requestOptions
    )
      .then(handleFetchError)
      .then(rep => {
        if (rep.status === 204) {
          return null;
        }
        return rep.json().then(repMsg => {
          return repMsg;
        });
      });
  };
  handleChange = event => {
    // console.log(event.target.value);
    const elementName = event.target.name;
    const targetValue = event.target.value;
    if (elementName === "districtNo") {
      this.setState({
        districtNo: targetValue,
        postcode: correctPostcode(targetValue)
      });
    }
    this.setState({
      [elementName]: targetValue
    });
    if (this.props.validatePeaId && elementName === "peaId") {
      this.setState({
        peaIdOk: true
      });
      if (this.validatePeaId(targetValue)) {
        this.checkCustomerExists(targetValue);
      } else {
        this.setState({
          peaIdOk: false,
          existsPeaCustomer: false,
          fetchPeaIdComplete: true,
          peaWarnText: "หมายเลขผู้ใช้ไฟไม่ถูกต้อง"
        });
      }
    }
  };

  render() {
    const {
      peaId,
      title,
      firstName,
      lastName,
      houseNo,
      mooNo,
      districtNo,
      postcode,
      soldierNo,
      war,
      peaIdOk,
      fetchPeaIdComplete,
      existsPeaCustomer,
      peaWarnText
    } = this.state;
    // console.log(this.props);
    const { readOnly, showPlaceholder, validatePeaId } = this.props;
    console.log(this.props);
    return (
      <div>
        {/* Customer Form */}

        <Form.Group as={Row}>
          <Form.Label column sm={2}>
            หมายเลขผู้ใช้ไฟ
          </Form.Label>
          <Col sm={5}>
            <InputGroup className="mb-0">
              <InputGroup.Prepend>
                <InputGroup.Text id="basic-addon3">02</InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                aria-describedby="basic-addon3"
                maxLength="11"
                name="peaId"
                placeholder={showPlaceholder ? "หมายเลขผู้ใช้ไฟ(CA)" : ""}
                value={peaId}
                readOnly={readOnly}
                onChange={this.handleChange}
              />
              {validatePeaId ? (
                <InputGroup.Append>
                  <InputGroup.Text id="basic-addon3">
                    {fetchPeaIdComplete ? (
                      existsPeaCustomer ? ( //Exists
                        <div style={{ color: "orange" }}>
                          <FaExclamation />
                        </div>
                      ) : peaIdOk ? ( //OK
                        <div style={{ color: "green" }}>
                          <FaCheck />
                        </div>
                      ) : (
                        //Invalid
                        <div style={{ color: "red" }}>
                          <FaTimes />
                        </div>
                      )
                    ) : (
                      <Spinner
                        animation="border"
                        variant="primary"
                        size="sm"
                        role="status"
                      >
                        <span className="sr-only">Loading...</span>
                      </Spinner>
                    )}
                  </InputGroup.Text>
                </InputGroup.Append>
              ) : null}
            </InputGroup>
            <Form.Text className="text-muted">
              {peaWarnText}
              {existsPeaCustomer ? (
                <span>
                  {" "}
                  ต้องการ{" "}
                  <Link to={`/verify-customer/${peaId}`}>
                    ยืนยันการใช้สิทธิ์
                  </Link>{" "}
                  แทนหรือไม่
                </span>
              ) : null}
            </Form.Text>
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column sm={2}>
            คำนำหน้า
          </Form.Label>
          <Col sm={3}>
            <Form.Control
              type="text"
              placeholder={showPlaceholder ? "คำนำหน้า" : ""}
              name="title"
              readOnly={readOnly}
              value={title}
              onChange={this.handleChange}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column sm={2}>
            ชื่อ-สกุล
          </Form.Label>
          <Col sm={10}>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Control
                  type="text"
                  placeholder={showPlaceholder ? "ชื่อ" : ""}
                  name="firstName"
                  readOnly={readOnly}
                  value={firstName}
                  onChange={this.handleChange}
                />
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Control
                  type="text"
                  placeholder={showPlaceholder ? "สกุล" : ""}
                  readOnly={readOnly}
                  name="lastName"
                  value={lastName}
                  onChange={this.handleChange}
                />
              </Form.Group>
            </Form.Row>
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column sm={2}>
            ที่อยู่
          </Form.Label>
          <Col sm={10}>
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>เลขที่/ซอย/ถนน</Form.Label>
                <Form.Control
                  placeholder={showPlaceholder ? "เลขที่/ซอย/ถนน" : ""}
                  name="houseNo"
                  readOnly={readOnly}
                  value={houseNo}
                  onChange={this.handleChange}
                />
              </Form.Group>

              <Form.Group as={Col} sm={2}>
                <Form.Label>หมู่ที่</Form.Label>
                <Form.Control
                  placeholder={showPlaceholder ? "หมู่ที่" : ""}
                  maxLength="2"
                  name="mooNo"
                  readOnly={readOnly}
                  value={mooNo}
                  onChange={this.handleChange}
                />
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>ตำบล</Form.Label>
                <Form.Control
                  as="select"
                  name="districtNo"
                  readOnly={readOnly}
                  value={districtNo}
                  onChange={this.handleChange}
                >
                  <option value="520101">1. เวียงเหนือ</option>
                  <option value="520102">2. หัวเวียง</option>
                  <option value="520103">3. สวนดอก</option>
                  <option value="520104">4. สบตุ๋ย</option>
                  <option value="520105">5. พระบาท</option>
                  <option value="520106">6. ชมพู</option>
                  <option value="520107">7. กล้วยแพะ</option>
                  <option value="520108">8. ปงแสนทอง</option>
                  <option value="520109">9. บ้านแลง</option>
                  <option value="520110">10. บ้านเสด็จ</option>
                  <option value="520111">11. พิชัย</option>
                  <option value="520112">12. ทุ่งฝาย</option>
                  <option value="520113">13. บ้านเอื้อม</option>
                  <option value="520114">14. บ้านเป้า</option>
                  <option value="520115">15. บ้านค่า</option>
                  <option value="520116">16. บ่อแฮ้ว</option>
                  <option value="520117">17. ต้นธงชัย</option>
                  <option value="520118">18. นิคมพัฒนา</option>
                  <option value="520119">19. บุญนาคพัฒนา</option>
                </Form.Control>
              </Form.Group>
            </Form.Row>

            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>อำเภอ</Form.Label>
                <Form.Control value="เมือง" readOnly={true} />
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>จังหวัด</Form.Label>
                <Form.Control value="ลำปาง" readOnly={true} />
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>รหัสไปรษณีย์</Form.Label>
                <Form.Control readOnly={true} value={postcode} />
              </Form.Group>
            </Form.Row>
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column sm={2}>
            เลขที่บัตรประจำตัวทหาร
          </Form.Label>
          <Col sm={3}>
            <Form.Control
              type="text"
              placeholder={showPlaceholder ? "เลขที่บัตรประจำตัวทหาร" : ""}
              name="soldierNo"
              readOnly={readOnly}
              value={soldierNo}
              maxLength="15"
              onChange={this.handleChange}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column sm={2}>
            ลดสิทธิ์สงคราม
          </Form.Label>
          <Col sm={3}>
            <Form.Control
              as="select"
              name="war"
              readOnly={readOnly}
              value={war}
              onChange={this.handleChange}
            >
              <option value="ภายในประเทศ">ภายในประเทศ</option>
              <option value="เวียดนาม">เวียดนาม</option>
              <option value="เกาหลี">เกาหลี</option>
              <option value="เอเชียบูรพา">เอเชียบูรพา</option>
              <option value="อินโดจีน">อินโดจีน</option>
              <option value="ฝรั่งเศส">ฝรั่งเศส</option>
            </Form.Control>
          </Col>
        </Form.Group>
      </div>
    );
  }
}

export default CustomerDataForm;
