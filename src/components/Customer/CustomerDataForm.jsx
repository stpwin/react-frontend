import React from "react";
import { Form, FormControl, InputGroup, Col, Row } from "react-bootstrap";

export const CustomerDataForm = ({
  readOnly,
  showPlaceholder,
  peaIdReadOnly,
  peaIdInvalid,
  onChange,
  customer: {
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
    war
  }
}) => {
  return (
    <React.Fragment>
      <Form.Group as={Row}>
        <Form.Label column sm={2}>
          หมายเลขผู้ใช้ไฟฟ้า(CA)
        </Form.Label>
        <Col sm={5}>
          <InputGroup className="mb-0">
            <FormControl
              isInvalid={peaIdInvalid}
              aria-describedby="basic-addon3"
              maxLength={12}
              name="peaId"
              placeholder={showPlaceholder ? "หมายเลขผู้ใช้ไฟฟ้า(CA)" : ""}
              value={peaId || ""}
              disabled={readOnly || peaIdReadOnly}
              onChange={onChange}
            />
          </InputGroup>
          <Form.Text className="text-muted">
            หมายเลขผู้ใช้ไฟฟ้า 12 หลัก เช่น 020005975100
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
            value={title || ""}
            onChange={onChange}
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
                value={firstName || ""}
                onChange={onChange}
              />
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Control
                type="text"
                placeholder={showPlaceholder ? "สกุล" : ""}
                disabled={readOnly}
                name="lastName"
                value={lastName || ""}
                onChange={onChange}
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
                value={houseNo || ""}
                onChange={onChange}
              />
            </Form.Group>

            <Form.Group as={Col} sm={2}>
              <Form.Label>หมู่</Form.Label>
              <Form.Control
                placeholder={showPlaceholder ? "หมู่" : ""}
                maxLength="2"
                name="mooNo"
                disabled={readOnly}
                value={mooNo || ""}
                onChange={onChange}
              />
            </Form.Group>

            <Form.Group as={Col}>
              <Form.Label>ตำบล</Form.Label>
              <Form.Control
                as="select"
                name="districtNo"
                disabled={readOnly}
                value={districtNo || "520101"}
                onChange={onChange}
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
              <Form.Control disabled={true} value={postcode || "52000"} />
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
              onChange={onChange}
              disabled={readOnly}
              id={`authorize-check-1`}
            />
            <Form.Check
              inline
              custom
              type="radio"
              label="ตัวแทน"
              name="authorize"
              value="ตัวแทน"
              checked={authorize === "ตัวแทน"}
              onChange={onChange}
              disabled={readOnly}
              id={`authorize-check-2`}
            />
            <Form.Check
              inline
              custom
              type="radio"
              label="ภรรยา"
              name="authorize"
              value="ภรรยา"
              checked={authorize === "ภรรยา"}
              onChange={onChange}
              disabled={readOnly}
              id={`authorize-check-3`}
            />
            <Form.Check
              inline
              custom
              type="radio"
              label="ทายาท"
              name="authorize"
              value="ทายาท"
              checked={authorize === "ทายาท"}
              onChange={onChange}
              disabled={readOnly}
              id={`authorize-check-4`}
            />
            <Form.Check
              inline
              custom
              type="radio"
              label="มารดาทหาร"
              name="authorize"
              value="มารดาทหาร"
              checked={authorize === "มารดาทหาร"}
              onChange={onChange}
              disabled={readOnly}
              id={`authorize-check-5`}
            />
          </Col>
        </Form.Group>
      </fieldset>

      <Form.Group as={Row}>
        <Form.Label column sm={2}>
          เลขประจำตัวทหาร
        </Form.Label>
        <Col sm={4}>
          <Form.Control
            type="text"
            placeholder={showPlaceholder ? "เลขประจำตัวทหาร" : ""}
            name="soldierNo"
            disabled={readOnly}
            value={soldierNo || ""}
            maxLength="15"
            onChange={onChange}
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row}>
        <Form.Label column sm={2}>
          สงคราม
        </Form.Label>
        <Col sm={4}>
          <Form.Control
            as="select"
            name="war"
            disabled={readOnly}
            value={war || "ภายในประเทศ"}
            onChange={onChange}
          >
            <option value="ภายในประเทศ">ภายในประเทศ</option>
            <option value="เวียดนาม">เวียดนาม</option>
            <option value="เกาหลี">เกาหลี</option>
            <option value="เหรียญชัยสมรภูมิ">เหรียญชัยสมรภูมิ</option>
            <option value="เอเชียบูรพา">เอเชียบูรพา</option>
            <option value="อินโดจีน">อินโดจีน</option>
            <option value="ฝรั่งเศส">ฝรั่งเศส</option>
          </Form.Control>
        </Col>
      </Form.Group>
    </React.Fragment>
  );
};

export default CustomerDataForm;
