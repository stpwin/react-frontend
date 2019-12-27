import React, { Component, Fragment } from "react";

import { connect } from "react-redux";
import { databaseActions } from "../../../actions";

import {
  Row,
  Col,
  Table,
  Nav,
  Tab,
  ButtonToolbar,
  Button,
  Form
} from "react-bootstrap";

import { ModalConfirm } from "../../Modals";

class Database extends Component {
  state = {
    confirmModal: false,
    confirmText: "",
    counters: [],
    dbInfo: {
      total: 0,
      groups: [],
      details: []
    }
  };

  UNSAFE_componentWillMount() {
    this.props.getDatabaseCounters();
    this.props.getDatabaseInfo();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      database: { counters, result, info }
    } = nextProps;

    if (counters) {
      this.setState({
        counters
      });
    }

    if (info) {
      this.setState({
        dbInfo: {
          total: info.reduce((acc, obj) => acc + obj.count, 0),
          groups: [
            {
              name: "G1",
              count: info
                .filter(obj =>
                  ["ภายในประเทศ", "เวียดนาม", "เกาหลี"].includes(obj.war)
                )
                .reduce((acc, obj) => acc + obj.count, 0)
            },
            {
              name: "G2",
              count: info
                .filter(obj =>
                  [
                    "เหรียญชัยสมรภูมิ",
                    "เอเชียบูรพา",
                    "อินโดจีน",
                    "ฝรั่งเศส"
                  ].includes(obj.war)
                )
                .reduce((acc, obj) => acc + obj.count, 0)
            }
          ],
          details: info
        }
      });
    }

    if (result && result.data) {
      let { counters } = this.state;
      counters[
        this.state.counters.findIndex(
          counter => counter._id === result.data._id
        )
      ] = result.data;
      this.setState({
        counters
      });
    }
  }

  newSequence = 0;
  counterName = "";

  handleConfirmInputChange = e => {
    this.newSequence = parseInt(e.target.value);
  };

  handleSetCounter = (name, currrentSeq) => {
    this.counterName = name;
    this.setState({
      confirmModal: true,
      confirmText: (
        <Fragment>
          <h4>{`กำหนดลำดับ ${name}`}</h4>
          <Row className="justify-content-center">
            <Col xs={{ span: true }} sm={5}>
              <Form.Control
                type="number"
                defaultValue={currrentSeq}
                onChange={this.handleConfirmInputChange}
                min={0}
                max={999999}
              />
            </Col>
          </Row>
        </Fragment>
      )
    });
  };

  handleResetCounter = name => {
    this.newSequence = 0;
    this.counterName = name;
    this.setState({
      confirmModal: true,
      confirmText: (
        <h4>{`แน่ใจหรือไม่ ที่จะเริ่มต้นการนับลำดับใหม่ของ ${name}`}</h4>
      )
    });
  };

  handleConfirmHide = () => {
    this.setState({
      confirmModal: false
    });
  };

  handleConfirmOk = () => {
    this.props.setDatabaseCounter(this.counterName, this.newSequence);
    this.handleConfirmHide();
  };

  render() {
    const { confirmModal, confirmText, counters, dbInfo } = this.state;
    return (
      <div className="database-manage-container">
        <Row>
          <Col>
            <Tab.Container defaultActiveKey="info">
              <Row>
                <Col sm={3}>
                  <Nav variant="pills" className="flex-column">
                    <Nav.Item>
                      <Nav.Link className="tab-link" eventKey="info">
                        รายงาน
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link className="tab-link" eventKey="first">
                        การนับลำดับ
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link className="tab-link" eventKey="second">
                        สำรองข้อมูล
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link className="tab-link" eventKey="third">
                        ลบข้อมูล
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Col>
                <Col sm={9}>
                  <Tab.Content>
                    <Tab.Pane eventKey="info">
                      <Table striped bordered size="sm">
                        <thead>
                          <tr className="text-center">
                            <th>#</th>
                            <th>ฐานข้อมูลลูกค้า</th>
                            <th>จำนวน</th>
                            {/* <th>เครื่องมือ</th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {dbInfo &&
                            dbInfo.details.map((item, index) => {
                              return (
                                <tr
                                  className="text-center"
                                  key={`counter-tr-${index}`}
                                >
                                  <td>{index + 1}</td>
                                  <td>{item.war}</td>
                                  <td>{item.count}</td>
                                </tr>
                              );
                            })}
                          {dbInfo &&
                            dbInfo.groups.map((item, index) => {
                              return (
                                <tr
                                  className="text-right"
                                  key={`group-tr-${index}`}
                                >
                                  <td colSpan={2}>{item.name}</td>
                                  <td>{item.count}</td>
                                </tr>
                              );
                            })}
                          <tr className="text-right">
                            <td colSpan="2">รวม</td>
                            <td>{dbInfo.total}</td>
                          </tr>
                        </tbody>
                      </Table>
                    </Tab.Pane>
                  </Tab.Content>
                  <Tab.Content>
                    <Tab.Pane eventKey="first">
                      <Table striped bordered hover>
                        <thead>
                          <tr className="text-center">
                            <th>#</th>
                            <th>ชื่อการนับ</th>
                            <th>ลำดับปัจจุปัน</th>
                            <th>เครื่องมือ</th>
                          </tr>
                        </thead>
                        <tbody>
                          {counters &&
                            counters.map((item, index) => {
                              return (
                                <tr
                                  className="text-center"
                                  key={`counter-tr-${index}`}
                                >
                                  <td>{index + 1}</td>
                                  <td>{item._id}</td>
                                  <td>{item.sequence}</td>
                                  <td>
                                    <Tools
                                      onSet={() =>
                                        this.handleSetCounter(
                                          item._id,
                                          item.sequence
                                        )
                                      }
                                      onReset={() =>
                                        this.handleResetCounter(item._id)
                                      }
                                    />
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </Table>
                    </Tab.Pane>
                    <Tab.Pane eventKey="second">
                      <div className="text-center">
                        สำรองข้อมูล ยังไม่พร้อมใช้งาน
                      </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey="third">
                      <div className="text-center">
                        ลบข้อมูล ยังไม่พร้อมใช้งาน
                      </div>
                    </Tab.Pane>
                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container>
          </Col>
        </Row>
        <ModalConfirm
          show={confirmModal}
          status="risk"
          onHide={this.handleConfirmHide}
          confirm={this.handleConfirmOk}
          confirmtext={confirmText}
        />
      </div>
    );
  }
}

const Tools = ({ onSet, onReset }) => {
  return (
    <ButtonToolbar>
      <Button size="sm" variant="warning" onClick={onSet}>
        ตั้งเอง
      </Button>
      <Button size="sm" variant="danger" onClick={onReset}>
        เริ่มใหม่
      </Button>
    </ButtonToolbar>
  );
};

const mapStateToProps = state => {
  const { database } = state;
  return {
    database
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getDatabaseCounters: () => dispatch(databaseActions.getAllCounter()),
    setDatabaseCounter: (name, sequence) =>
      dispatch(databaseActions.setCounter(name, sequence)),
    getDatabaseInfo: () => dispatch(databaseActions.getInfo())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Database);
