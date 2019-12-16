import React, { Component, Fragment } from "react";

import { connect } from "react-redux"
import { customerActions } from "../../../actions"

import {
  Row,
  Col,
  Button,
  ButtonToolbar,
  Card,
  Accordion,
  Image,
  ListGroup
} from "react-bootstrap";

import config from "../../../config";
import {
  getCustomerByPeaId,
  authHeader,
  addressToString,
  getWarType
} from "../../../helpers";

class ViewCustomer extends Component {
  state = {
    customer: null,
    isLoading: true,
    signatures: null,
    verifies: null
  };
  componentDidMount() {
    const { peaId } = this.props;
    if (!peaId) return;

    getCustomerByPeaId(peaId).then(data => {
      const translated = {
        peaId: peaId,
        name: `${data.title}${data.firstName} ${data.lastName}`,
        address: addressToString(data.address),
        authorize: data.authorize,
        soldierNo: data.soldierNo,
        war: `${data.war} ${getWarType(data.war)}`
      };

      data.verifies.sort((a, b) => {
        return new Date(b.appearDate) - new Date(a.appearDate);
      })

      this.setState({
        customer: translated,
        verifies: data.verifies
      });
      Promise.all(
        data.verifies.map(item => {
          return this.fetchSignature(item._id);
        })
      ).then(values => {
        this.setState({
          signatures: values,
          isLoading: false
        });
      });
    });
  }

  arrayBufferToBase64 = buffer => {
    let binary = "";
    const bytes = [].slice.call(new Uint8Array(buffer));

    bytes.forEach(b => (binary += String.fromCharCode(b)));

    return window.btoa(binary);
  };

  fetchSignature = sigId => {
    const { peaId } = this.props;
    const requestOptions = {
      method: "GET",
      headers: authHeader()
    };

    return fetch(
      `${config.apiUrl}/api/customers/signature/${peaId}/${sigId}`,
      requestOptions
    ).then(rep => {
      if (!rep.ok) {
        return Promise.reject();
      }
      if (rep.status === 200) {
        return rep.arrayBuffer().then(buffer => {
          const base64Flag = "data:image/jpeg;base64,";
          const imageStr = this.arrayBufferToBase64(buffer);
          const image = base64Flag + imageStr;
          return Promise.resolve(image);
        });
      }
    });
  };

  basicDataRow = [
    { field: "name", title: "ชื่อ-สกุล", key: "name" },
    { field: "address", title: "ที่อยู่", key: "address" },
    { field: "authorize", title: "กรณีเป็น", key: "authorize" },
    { field: "soldierNo", title: "หมายเลขทหาร", key: "soldierNo" },
    { field: "war", title: "ลดสิทธิ์สงคราม", key: "war" }
  ];

  render() {
    const { peaId } = this.props;
    const { customer, isLoading, signatures, verifies } = this.state;

    return (
      <Fragment>
        <Row>
          <Col className="text-center">
            <ButtonToolbar>
              <Button
                key="button-print"
                variant="outline-secondary"
                className="pea-color"
                onClick={() => {
                  this.props.history.push(`/customers/print/${peaId}`);
                }}
              >
                พิมพ์
              </Button>
              <Button
                key="button-verify"
                variant="outline-secondary"
                className="pea-color"
                onClick={() => {
                  this.props.history.push(`/customers/verify/${peaId}`);
                }}
              >
                ยืนยันสิทธิ์
              </Button>
              <Button
                key="button-edit"
                variant="outline-secondary"
                className="pea-color"
                onClick={() => {
                  this.props.history.push(`/customers/edit/${peaId}`);
                }}
              >
                แก้ไข
              </Button>
              <Button
                key="button-back"
                variant="outline-secondary"
                className="pea-color"
                onClick={() => {
                  this.props.history.goBack();
                }}
              >
                กลับ
              </Button>
            </ButtonToolbar>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col>
            <h4 className="text-center">ข้อมูลพื้นฐาน</h4>
            <Row>
              <Col>
                <ListGroup variant="flush">
                  {customer &&
                    this.basicDataRow.map(item => {
                      return (
                        <ListGroup.Item key={item.key}>
                          <span>{item.title}</span>
                          <span className="ml-1">{`${
                            customer[item.field]
                            }`}</span>
                        </ListGroup.Item>
                      );
                    })}
                </ListGroup>
              </Col>
            </Row>
          </Col>
          <Col>
            <h4 className="text-center">ข้อมูลการยืนยัน</h4>
            <Row>
              <Col>

                {isLoading ? (
                  <div className="text-center"><span>กำลังประมวลผล...</span></div>
                ) : (
                    verifies && verifies.length > 0 ?
                      <Accordion defaultActiveKey="0">
                        {verifies.map((data, index) => {
                          return (
                            <VerifyData
                              key={`card-${index}`}
                              index={index}
                              signatureUrl={signatures[index]}
                              {...data}
                            />
                          );

                        })}
                      </Accordion>
                      : <div className="text-center"><span className="text-secondary">ไม่มีข้อมูลการยืนยัน</span></div>
                  )}

              </Col>
            </Row>
          </Col>
        </Row>
      </Fragment>
    );
  }
}

const VerifyData = ({ appearDate, signatureUrl, index }) => {
  return (
    <Card>
      <Card.Header as="h5">
        <Accordion.Toggle as={Button} variant="link" eventKey={index}>
          <div>
            <span className="mr-1">วันที่แสดงตน:</span>
            <span>{new Date(appearDate).toLocaleDateString("th-TH", {
              year: "numeric",
              month: "long",
              day: "numeric"
            })}</span>
          </div>

        </Accordion.Toggle>
      </Card.Header>
      <Accordion.Collapse eventKey={index}>
        <Card.Body>
          <div>
            {signatureUrl ? (
              <Image fluid alt="signature" src={signatureUrl} />
            ) : <span className="text-secondary">ไม่พบไฟล์ภาพ</span>}
          </div>
        </Card.Body>
      </Accordion.Collapse>
    </Card>
  );
};

const mapStateToProps = state => {
  const { customers } = state
  return {
    customers
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getCustomer: peaId => dispatch(customerActions.get(peaId)),
    getSignature: (peaId, sigId) => dispatch(customerActions.getSignature(peaId, sigId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewCustomer) 