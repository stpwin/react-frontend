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
    counters: []
  };

  UNSAFE_componentWillMount() {
    this.props.getDatabaseCounters()
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { database: { counters, result } } = nextProps

    if (counters) {
      this.setState({
        counters
      })
    }

    if (result && result.data) {
      let { counters } = this.state
      counters[this.state.counters.findIndex(counter => counter._id === result.data._id)] = result.data
      this.setState({
        counters
      })
    }
  }

  newSequence = 0;
  counterName = "";

  handleConfirmInputChange = e => {
    this.newSequence = parseInt(e.target.value)
  }

  handleSetCounter = (name, currrentSeq) => {
    this.counterName = name;
    this.setState({
      confirmModal: true,
      confirmText:
        <Fragment>
          <h4>{`ตั้งค่าการนับของ ${name}`}</h4>
          <Row className="justify-content-center">
            <Col xs={{ span: true }} sm={5}>
              <Form.Control type="number" defaultValue={currrentSeq} onChange={this.handleConfirmInputChange} min={0} max={999999} />
            </Col>
          </Row>

        </Fragment>
    });
  };

  handleResetCounter = name => {
    this.newSequence = 0;
    this.counterName = name;
    this.setState({
      confirmModal: true,
      confirmText: <h4>{`ยืนยันการเริ่มต้นนับใหม่ ของ ${name}`}</h4>
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
    const { confirmModal, confirmText, counters } = this.state;
    return (
      <div className="database-manage-container">
        <Row>
          <Col>
            <Tab.Container id="left-tabs-example" defaultActiveKey="first">
              <Row>
                <Col sm={3}>
                  <Nav variant="pills" className="flex-column">
                    <Nav.Item>
                      <Nav.Link className="tab-link" eventKey="first">
                        การนับ
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
                                <tr className="text-center" key={`counter-tr-${index}`}>
                                  <td>{index + 1}</td>
                                  <td>{item._id}</td>
                                  <td>{item.sequence}</td>
                                  <td>
                                    <Tools
                                      onSet={() =>
                                        this.handleSetCounter(item._id, item.sequence)
                                      }
                                      onReset={() => this.handleResetCounter(item._id)}
                                    />
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </Table>
                    </Tab.Pane>
                    <Tab.Pane eventKey="second">
                      <div></div>
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
        ตั้งการนับ
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
      dispatch(databaseActions.setCounter(name, sequence))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Database);
