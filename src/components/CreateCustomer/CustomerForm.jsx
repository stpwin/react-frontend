import React, { Component } from "react";
import {
  Button,
  Form,
  FormControl,
  InputGroup,
  Col,
  Row
} from "react-bootstrap";
import {connect} from "react-redux";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Signature from "./Signature";
import config from "../../config"
import { userActions } from "../../actions"
import {authHeader} from "../../helpers"

// import axios from "axios";
// import "./CustomerForm.css";

class CustomerForm extends Component {
  state = {
    peaId: "12345",
    title: "นาย",
    firstName: "สิทธิพร",
    lastName: "กาวี",
    houseNo: "143/1",
    mooNo: "3",
    districtNo: "520101",
    postcode: 52000,
    authorize: "ทหาร",
    dateAppear: new Date(),
    soldierNo: "158/2154",
    war: "ภายในประเทศ",
    signatureBase64: null
  };
  sigPad = {};
  clearSigPad = () => {
    this.sigPad.clear();
  };
  trimSigPad = () => {
    this.setState({
      signatureBase64: this.sigPad.getTrimmedCanvas().toDataURL("image/png")
    });
  };

  componentDidMount(){
    this.props.dispatch(userActions.getAll());
    // console.log(this.props)
  }

  handleChange = event => {
    // console.log(event.target.value);
    const elementName = event.target.name;
    const targetValue = event.target.value;
    if (elementName === "districtNo") {
      if (
        targetValue === "520102" ||
        targetValue === "520104" ||
        targetValue === "520106" ||
        targetValue === "520108" ||
        targetValue === "520113" ||
        targetValue === "520114" ||
        targetValue === "520115" ||
        targetValue === "520116"
      ) {
        this.setState({
          districtNo: targetValue,
          postcode: 52100
        });
      } else if (targetValue === "520105") {
        this.setState({
          districtNo: targetValue,
          postcode: 52220
        });
      } else {
        this.setState({
          districtNo: targetValue,
          postcode: 52000
        });
      }
    }
    this.setState({
      [elementName]: targetValue
    });
  };

  handleDateChange = date => {
    this.setState({
      dateAppear: date
    });
  };

  setSigpadRef = ref => {
    this.sigPad = ref;
  };

  //Whattttttttt I need to add REDUX!! ----------|
  insertData = event => {
    event.preventDefault();
    // this.trimSigPad();
    const signatureData = this.sigPad.getTrimmedCanvas().toDataURL("image/png");
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeader()},
      body: JSON.stringify({
        customer: {
          title: this.state.title,
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          peaId: this.state.peaId,
          dateAppear: this.state.dateAppear,
          authorize: this.state.authorize,
          soldierNo: this.state.soldierNo,
          war: this.state.war,
          signatureBase64: signatureData,
          address: {
            houseNo: this.state.houseNo,
            mooNo: this.state.mooNo,
            districtNo: this.state.districtNo
          }
        }
      })
    };
    
    fetch(`${config.apiUrl}/api/customers`, requestOptions)
      .then(rep => {
        if (!rep.ok) {
          throw rep
        }
        return rep.json();
      })
      .then(rep=>{
        console.log(rep)
      })
      .catch(err => {
        err.text().then(errorMsg => {
          console.log(errorMsg);
        })
        
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
      dateAppear,
      soldierNo,
      war
    } = this.state;
    return (
      <div>
        {/* Customer Form */}

        <Form onSubmit={this.insertData}>
          <Form.Group as={Row}>
            <Form.Label column sm={2}>
              หมายเลขผู้ใช้ไฟ
            </Form.Label>
            <Col sm={3}>
              <InputGroup className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text id="basic-addon3">02</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  aria-describedby="basic-addon3"
                  maxLength="11"
                  name="peaId"
                  onChange={this.handleChange}
                  value={peaId}
                />
              </InputGroup>
            </Col>
          </Form.Group>

          <Form.Group as={Row}>
            <Form.Label column sm={2}>
              คำนำหน้า
            </Form.Label>
            <Col sm={3}>
              <Form.Control
                type="text"
                placeholder="คำนำหน้า"
                name="title"
                onChange={this.handleChange}
                value={title}
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
                    placeholder="ชื่อ"
                    name="firstName"
                    onChange={this.handleChange}
                    value={firstName}
                  />
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Control
                    type="text"
                    placeholder="นามสกุล"
                    onChange={this.handleChange}
                    name="lastName"
                    value={lastName}
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
                    placeholder="เลขที่/ซอย/ถนน"
                    name="houseNo"
                    onChange={this.handleChange}
                    value={houseNo}
                  />
                </Form.Group>

                <Form.Group as={Col} sm={2}>
                  <Form.Label>หมู่ที่</Form.Label>
                  <Form.Control
                    placeholder="หมู่ที่"
                    maxLength="2"
                    name="mooNo"
                    onChange={this.handleChange}
                    value={mooNo}
                  />
                </Form.Group>

                <Form.Group as={Col}>
                  <Form.Label>ตำบล</Form.Label>
                  <Form.Control
                    as="select"
                    name="districtNo"
                    onChange={this.handleChange}
                    value={districtNo}
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

          <fieldset>
            <Form.Group as={Row}>
              <Form.Label as="legend" column sm={2}>
                กรณีเป็น
              </Form.Label>
              <Col sm={10}>
                <Form.Check
                  type="radio"
                  label="ทหาร"
                  name="authorize"
                  value="ทหาร"
                  checked={authorize === "ทหาร"}
                  onChange={this.handleChange}
                />
                <Form.Check
                  type="radio"
                  label="ตัวแทน"
                  name="authorize"
                  value="ตัวแทน"
                  checked={authorize === "ตัวแทน"}
                  onChange={this.handleChange}
                />
                <Form.Check
                  type="radio"
                  label="ภรรยา"
                  name="authorize"
                  value="ภรรยา"
                  checked={authorize === "ภรรยา"}
                  onChange={this.handleChange}
                />
                <Form.Check
                  type="radio"
                  label="ทายาท"
                  name="authorize"
                  value="ทายาท"
                  checked={authorize === "ทายาท"}
                  onChange={this.handleChange}
                />
              </Col>
            </Form.Group>
          </fieldset>

          <Form.Group as={Row}>
            <Form.Label as="legend" column sm={2}>
              วันที่มาแสดงตน
            </Form.Label>
            <Col sm={3}>
              <DatePicker
                todayButton="เลือกวันนี้"
                className="form-control"
                selected={dateAppear}
                onChange={this.handleDateChange}
              ></DatePicker>
            </Col>
          </Form.Group>

          <Form.Group as={Row}>
            <Form.Label column sm={2}>
              เลขที่บัตรประจำตัว
            </Form.Label>
            <Col sm={3}>
              <Form.Control
                type="text"
                placeholder="เลขที่บัตรประจำตัว"
                name="soldierNo"
                onChange={this.handleChange}
                value={soldierNo}
                maxLength="15"
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
                onChange={this.handleChange}
                value={war}
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

          <Form.Group as={Row}>
            <Form.Label column sm={2}>
              ลายเซ็น
            </Form.Label>
            <Col sm={3}>
              <Signature
                setRef={this.setSigpadRef}
                clear={this.clearSigPad}
              ></Signature>
            </Col>
          </Form.Group>

          <Form.Group as={Row}>
            <Col sm={{ span: 10, offset: 2 }}>
              <Button type="submit" className="btn-block">บันทึก</Button>
            </Col>
          </Form.Group>
        </Form>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { users, authentication } = state;
  const { user } = authentication;
  return {
    user,
    users
  };
}

export default connect(mapStateToProps)(CustomerForm);
