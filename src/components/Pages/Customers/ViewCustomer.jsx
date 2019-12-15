import React, { Component, Fragment } from "react";

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
import { getCustomerByPeaId, authHeader, addressToString } from "../../../helpers";

export default class ViewCustomer extends Component {
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
        war: data.war
      }
      console.log(data.verifies.sort((a, b) => {
        return new Date(b.privilegeDate) - new Date(a.privilegeDate)
      }))
      this.setState({
        customer: translated,
        verifies: data.verifies
      });
      Promise.all(data.verifies.map(item => {
        return this.fetchSignature(item._id)
      })).then(values => {
        this.setState({
          signatures: values,
          isLoading: false
        })
      })
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
        return Promise.reject()
      }
      if (rep.status === 200) {
        return rep.arrayBuffer().then(buffer => {
          const base64Flag = "data:image/jpeg;base64,";
          const imageStr = this.arrayBufferToBase64(buffer);
          const image = base64Flag + imageStr;
          return Promise.resolve(image)
        });
      }
    });
  };

  basicDataRow = [
    { field: "name", title: "ชื่อ-สกุล", key: "name" },
    { field: "address", title: "ที่อยู่", key: "address" },
    { field: "authorize", title: "กรณีเป็น", key: "authorize" },
    { field: "soldierNo", title: "หมายเลขทหาร", key: "soldierNo" },
    { field: "war", title: "ลดสิทธิ์สงคราม", key: "war" },
  ]

  render() {
    const { peaId } = this.props;
    const { customer, isLoading, signatures, verifies } = this.state;

    return (
      <Fragment>
        <Row>
          <Col className='text-center'>
            <ButtonToolbar>
              <Button
                key='button-print'
                variant='outline-secondary'
                className='pea-color'
                onClick={() => {
                  this.props.history.push(`/customers/print/${peaId}`);
                }}
              >
                พิมพ์
              </Button>
              <Button
                key='button-verify'
                variant='outline-secondary'
                className='pea-color'
                onClick={() => {
                  this.props.history.push(`/customers/verify/${peaId}`);
                }}
              >
                ยืนยันสิทธิ์
              </Button>
              <Button
                key='button-edit'
                variant='outline-secondary'
                className='pea-color'
                onClick={() => {
                  this.props.history.push(`/customers/edit/${peaId}`);
                }}
              >
                แก้ไข
              </Button>
              <Button
                key='button-back'
                variant='outline-secondary'
                className='pea-color'
                onClick={() => {
                  this.props.history.goBack();
                }}
              >
                กลับ
              </Button>
            </ButtonToolbar>
          </Col>
        </Row>
        <Row className='mt-4'>
          <Col>
            <h4 className='text-center'>ข้อมูลพื้นฐาน</h4>
            <Row>
              <Col>
                <ListGroup variant="flush">
                  {customer && this.basicDataRow.map(item => {
                    return <ListGroup.Item key={item.key}><span>{item.title}</span><span className="ml-1">{`${customer[item.field]}`}</span></ListGroup.Item>
                  })}
                </ListGroup>
              </Col>
            </Row>
          </Col>
          <Col>
            <h4 className='text-center'>ข้อมูลการยืนยัน</h4>
            <Row>
              <Col>
                <Accordion defaultActiveKey='0'>
                  {isLoading ? <div>Loading</div> :
                    verifies &&
                    verifies.map((data, index) => {
                      // this.fetchSignature(data._id);
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
              </Col>
            </Row>
          </Col>
        </Row>
      </Fragment>
    );
  }
}

const VerifyData = ({
  dateAppear,
  privilegeDate,
  signatureUrl,
  index
}) => {

  return (
    <Card>
      <Card.Header as='h5'>
        <Accordion.Toggle as={Button} variant='link' eventKey={index}>
          {new Date(privilegeDate).toLocaleDateString("th-TH", {
            year: "numeric"
          })}
        </Accordion.Toggle>
      </Card.Header>
      <Accordion.Collapse eventKey={index}>
        <Card.Body>
          <span className='mr-1'>วันที่แสดงตน:</span>
          {new Date(dateAppear).toLocaleDateString("th-TH", {
            year: "numeric",
            month: "long",
            day: "numeric"
          })}
          <div>
            {signatureUrl ? <Image fluid alt='signature' src={signatureUrl} /> : null}

          </div>
        </Card.Body>
      </Accordion.Collapse>
    </Card>
  );
};
