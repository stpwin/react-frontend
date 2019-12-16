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

import { getCustomerByPeaId, correctPostcode } from "../../helpers";
// import config from "../../config";

export class CustomerDataForm extends Component {
  state = {
    peaId: (this.props.initial && this.props.initial.peaId) || "",
    title: (this.props.initial && this.props.initial.title) || "",
    firstName: (this.props.initial && this.props.initial.firstName) || "",
    lastName: (this.props.initial && this.props.initial.lastName) || "",
    houseNo: (this.props.initial && this.props.initial.houseNo) || "",
    mooNo: (this.props.initial && this.props.initial.mooNo) || "",
    districtNo: (this.props.initial && this.props.initial.districtNo) || "",
    postcode: (this.props.initial && this.props.initial.postcode) || 52000,
    authorize: (this.props.initial && this.props.initial.authorize) || "ทหาร",
    soldierNo: (this.props.initial && this.props.initial.soldierNo) || "",
    war: (this.props.initial && this.props.initial.war) || "",
    peaIdOk: this.props.initial && this.props.initial.peaId ? true : false,
    fetchPeaIdComplete: true,
    existsPeaCustomer: false,
    peaWarnText: ""
  };

  validatePeaId = peaId => {
    if (peaId.length === 12) {
      return true;
    }
    return false;
  };
  checkCustomerExists = peaId => {
    this.setState({
      fetchPeaIdComplete: false,
      existsPeaCustomer: false,
      peaWarnText: "กำลังตรวจสอบหมายเลขผู้ใช้ไฟฟ้า..."
    });
    const customer = getCustomerByPeaId(peaId);
    // console.log(customer);
    customer
      .then(res => {
        this.setState({
          fetchPeaIdComplete: true,
          existsPeaCustomer: res ? true : false,
          peaWarnText: res ? "หมายเลขผู้ใช้ไฟฟ้านี้มีอยู่ในระบบแล้ว" : ""
        });
      })
      .catch(() => {
        this.setState({
          peaWarnText: "เซิร์ฟเวอร์ขัดข้อง",
          fetchPeaIdComplete: true,
          existsPeaCustomer: true
        });
      });
  };

  handleChange = event => {
    // console.log(event.target.value);
    const elementName = event.target.name;
    const targetValue = event.target.value;
    const { onPeaIdChange } = this.props;
    if (elementName === "districtNo") {
      this.setState({
        districtNo: targetValue,
        postcode: correctPostcode(targetValue)
      });
    } else if (this.props.validatePeaId && elementName === "peaId") {
      this.setState({
        peaIdOk: true
      });

      onPeaIdChange && onPeaIdChange(targetValue);
      if (this.validatePeaId(targetValue)) {
        this.checkCustomerExists(targetValue);
      } else {
        this.setState({
          peaIdOk: false,
          existsPeaCustomer: false,
          fetchPeaIdComplete: true,
          peaWarnText: "หมายเลขผู้ใช้ไฟฟ้าไม่ถูกต้อง"
        });
      }
    }

    this.setState({
      [elementName]: targetValue
    });
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
      authorize,
      soldierNo,
      war,
      peaIdOk,
      fetchPeaIdComplete,
      existsPeaCustomer,
      peaWarnText
    } = this.state;
    // console.log(this.props);
    const {
      readOnly,
      showPlaceholder,
      validatePeaId,
      peaIdReadOnly
    } = this.props;
    // console.log(this.props);
    return (
      <React.Fragment>
        <Form.Group as={Row}>
          <Form.Label column sm={2}>
            หมายเลขผู้ใช้ไฟฟ้า(CA)
          </Form.Label>
          <Col sm={5}>
            <InputGroup className="mb-0">
              {/* <InputGroup.Prepend>
                <InputGroup.Text id='basic-addon3'>02</InputGroup.Text>
              </InputGroup.Prepend> */}
              <FormControl
                aria-describedby="basic-addon3"
                maxLength={12}
                name="peaId"
                placeholder={showPlaceholder ? "หมายเลขผู้ใช้ไฟฟ้า(CA)" : ""}
                value={peaId}
                disabled={readOnly || peaIdReadOnly}
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
                        <span className="sr-only">กำลังโหลด...</span>
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
                  <Link to={`/customers/verify/${peaId}`}>
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
              disabled={readOnly}
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
                  disabled={readOnly}
                  value={firstName}
                  onChange={this.handleChange}
                />
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Control
                  type="text"
                  placeholder={showPlaceholder ? "สกุล" : ""}
                  disabled={readOnly}
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
                  disabled={readOnly}
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
                  disabled={readOnly}
                  value={mooNo}
                  onChange={this.handleChange}
                />
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>ตำบล</Form.Label>
                <Form.Control
                  as="select"
                  name="districtNo"
                  disabled={readOnly}
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
                <Form.Control value="เมือง" disabled={true} />
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>จังหวัด</Form.Label>
                <Form.Control value="ลำปาง" disabled={true} />
              </Form.Group>

              <Form.Group as={Col}>
                <Form.Label>รหัสไปรษณีย์</Form.Label>
                <Form.Control disabled={true} value={postcode} />
              </Form.Group>
            </Form.Row>
          </Col>
        </Form.Group>

        <fieldset>
          <Form.Group as={Row}>
            <Form.Label as="legend" column sm={2}>
              กรณีเป็น
            </Form.Label>
            <Col sm={10}>
              <Form.Check
                inline
                custom
                type="radio"
                label="ทหาร"
                name="authorize"
                value="ทหาร"
                checked={authorize === "ทหาร"}
                onChange={this.handleChange}
                disabled={readOnly}
                id={`inline-1`}
              />
              <Form.Check
                inline
                custom
                type="radio"
                label="ตัวแทน"
                name="authorize"
                value="ตัวแทน"
                checked={authorize === "ตัวแทน"}
                onChange={this.handleChange}
                disabled={readOnly}
                id={`inline-2`}
              />
              <Form.Check
                inline
                custom
                type="radio"
                label="ภรรยา"
                name="authorize"
                value="ภรรยา"
                checked={authorize === "ภรรยา"}
                onChange={this.handleChange}
                disabled={readOnly}
                id={`inline-3`}
              />
              <Form.Check
                inline
                custom
                type="radio"
                label="ทายาท"
                name="authorize"
                value="ทายาท"
                checked={authorize === "ทายาท"}
                onChange={this.handleChange}
                disabled={readOnly}
                id={`inline-4`}
              />
            </Col>
          </Form.Group>
        </fieldset>

        <Form.Group as={Row}>
          <Form.Label column sm={2}>
            เลขที่บัตรประจำตัวทหาร
          </Form.Label>
          <Col sm={3}>
            <Form.Control
              type="text"
              placeholder={showPlaceholder ? "เลขที่บัตรประจำตัวทหาร" : ""}
              name="soldierNo"
              disabled={readOnly}
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
              disabled={readOnly}
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
      </React.Fragment>
    );
  }
}

export default CustomerDataForm;
