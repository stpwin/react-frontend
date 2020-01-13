import React, { Component, Fragment, forwardRef } from "react";
import "./table.css";
import { connect } from "react-redux";
import { databaseActions } from "../../../actions";

import DatePicker, { registerLocale } from "react-datepicker";
import th from "date-fns/locale/th";

import {
  Row,
  Col,
  Table,
  Nav,
  Tab,
  ButtonToolbar,
  Button,
  Form
  // Dropdown,
  // DropdownButton
} from "react-bootstrap";

import { ModalConfirm } from "../../Modals";

const tempDate = new Date();
tempDate.setHours(0, 0, 0, 0);
// const lastYearDate = new Date(tempDate.getUTCFullYear() - 1, 1, 1);
// const totalCountSince = [
//   { name: "วันนี้", value: tempDate },
//   { name: "เมื่อวานนี้", value: new Date(tempDate.getUTCFullYear()) tempDate.setUTCDate(tempDate.getUTCDate() - 1) },
//   { name: "2 วันที่แล้ว", value: tempDate.setUTCDate(tempDate.getUTCDate() - 2) },
//   { name: "3 วันที่แล้ว", value: tempDate.setUTCDate(tempDate.getUTCDate() - 3) },
//   { name: "4 วันที่แล้ว", value: tempDate.setUTCDate(tempDate.getUTCDate() - 4) },
//   { name: "5 วันที่แล้ว", value: tempDate.setUTCDate(tempDate.getUTCDate() - 5) },
//   { name: "6 วันที่แล้ว", value: tempDate.setUTCDate(tempDate.getUTCDate() - 6) },
//   { name: "7 วันที่แล้ว", value: tempDate.setUTCDate(tempDate.getUTCDate() - 7) }
// ];

class Database extends Component {
  state = {
    confirmModal: false,
    confirmText: "",
    counters: [],
    dbInfo: {
      total: 0,
      todayAppear: 0,
      todayApproved: 0,
      appearTotal: 0,
      approvedCount: 0,
      groups: [],
      details: []
    },
    // sinceYear: `${lastYearDate.toLocaleDateString("th-TH", {
    //   day: "numeric",
    //   month: "short",
    //   year: "2-digit"
    // })} - ${new Date(tempDate.getUTCFullYear(), 0, 31).toLocaleDateString(
    //   "th-TH",
    //   {
    //     day: "numeric",
    //     month: "short",
    //     year: "2-digit"
    //   }
    // )}`,
    startDate: new Date(new Date().getUTCFullYear() - 1, 0, 1),
    endDate: new Date(),
    sinceDate: new Date()
  };

  componentDidMount() {
    registerLocale("th", th);
    const { startDate, endDate, sinceDate } = this.state;
    this.props.getDatabaseCounters();
    // this.props.getDatabaseInfo();
    this.props.getVerifyInfoByDate(
      sinceDate.toJSON(),
      startDate.toJSON(),
      endDate.toJSON()
    );
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
      const g1_filter = info.filter(obj =>
        ["ภายในประเทศ", "เวียดนาม", "เกาหลี"].includes(obj.war)
      );
      const g2_filter = info.filter(obj =>
        ["เหรียญชัยสมรภูมิ", "เอเชียบูรพา", "อินโดจีน", "ฝรั่งเศส"].includes(
          obj.war
        )
      );

      info.sort((a, b) => a.war.localeCompare(b.war));

      this.setState({
        dbInfo: {
          total: info.reduce((acc, obj) => acc + obj.count, 0),
          todayAppear: info.reduce((acc, obj) => acc + obj.todayAppear, 0),
          todayApproved: info.reduce((acc, obj) => acc + obj.todayApproved, 0),
          appearTotal: info.reduce((acc, obj) => acc + obj.appearCount, 0),
          approvedTotal: info.reduce((acc, obj) => acc + obj.approvedCount, 0),
          groups: [
            {
              name: "G1 รวม",
              count: g1_filter.reduce((acc, obj) => acc + obj.count, 0),
              appearCount: g1_filter.reduce(
                (acc, obj) => acc + obj.appearCount,
                0
              ),
              approvedCount: g1_filter.reduce(
                (acc, obj) => acc + obj.approvedCount,
                0
              ),
              todayAppear: g1_filter.reduce(
                (acc, obj) => acc + obj.todayAppear,
                0
              ),
              todayApproved: g1_filter.reduce(
                (acc, obj) => acc + obj.todayApproved,
                0
              )
            },
            {
              name: "G2 รวม",
              count: g2_filter.reduce((acc, obj) => acc + obj.count, 0),
              appearCount: g2_filter.reduce(
                (acc, obj) => acc + obj.appearCount,
                0
              ),
              approvedCount: g2_filter.reduce(
                (acc, obj) => acc + obj.approvedCount,
                0
              ),
              todayAppear: g2_filter.reduce(
                (acc, obj) => acc + obj.todayAppear,
                0
              ),
              todayApproved: g2_filter.reduce(
                (acc, obj) => acc + obj.todayApproved,
                0
              )
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

  handleSinceDateChange = date => {
    const { startDate, endDate } = this.state;
    this.setState(
      {
        sinceDate: date
      },
      () => {
        this.props.getVerifyInfoByDate(
          date.toJSON(),
          startDate.toJSON(),
          endDate.toJSON()
        );
      }
    );
  };

  setStartDate = date => {
    const { sinceDate, endDate } = this.state;
    this.setState(
      {
        startDate: date
      },
      () => {
        this.props.getVerifyInfoByDate(
          sinceDate.toJSON(),
          date.toJSON(),
          endDate.toJSON()
        );
      }
    );
  };

  setEndDate = date => {
    const { sinceDate, startDate } = this.state;
    this.setState(
      {
        endDate: date
      },
      () => {
        this.props.getVerifyInfoByDate(
          sinceDate.toJSON(),
          startDate.toJSON(),
          date.toJSON()
        );
      }
    );
  };

  render() {
    const {
      confirmModal,
      confirmText,
      counters,
      dbInfo,
      startDate,
      endDate,
      sinceDate
    } = this.state;
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
                    {/* <Nav.Item>
                      <Nav.Link className="tab-link" eventKey="second">
                        สำรองข้อมูล
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link className="tab-link" eventKey="third">
                        ลบข้อมูล
                      </Nav.Link>
                    </Nav.Item> */}
                  </Nav>
                </Col>
                <Col sm={9}>
                  <Tab.Content>
                    <Tab.Pane eventKey="info">
                      <Table striped bordered size="sm">
                        <thead>
                          <tr className="text-center">
                            <th rowSpan={2}>#</th>
                            <th rowSpan={2}>สงคราม</th>
                            <th rowSpan={2}>จำนวน</th>
                            <th colSpan={2}>
                              <DatePicker
                                locale="th"
                                todayButton="เลือกวันนี้"
                                className="form-control form-control-sm ml-1 text-center"
                                style={{ flex: "1 1 auto" }}
                                selected={sinceDate}
                                shouldCloseOnSelect={false}
                                dateFormatCalendar="LLLL yyyy"
                                dateFormat="d MMMM y"
                                onChange={this.handleSinceDateChange}
                                customInput={<DatePickerButton />}
                              />
                            </th>
                            <th colSpan={2}>
                              <div className="d-inline-flex">
                                <span
                                  style={{
                                    fontSize: "smaller",
                                    fontWeight: "lighter",
                                    alignSelf: "center"
                                  }}
                                >
                                  ระหว่าง
                                </span>
                                <DatePicker
                                  locale="th"
                                  todayButton="เลือกวันนี้"
                                  selected={startDate}
                                  onChange={date => this.setStartDate(date)}
                                  dateFormatCalendar="LLLL yyyy"
                                  dateFormat="d MMMM y"
                                  selectsStart
                                  startDate={startDate}
                                  endDate={endDate}
                                  customInput={<DatePickerButton />}
                                />
                                <span
                                  style={{
                                    fontSize: "smaller",
                                    fontWeight: "lighter",
                                    alignSelf: "center"
                                  }}
                                >
                                  ถึง
                                </span>
                                <DatePicker
                                  locale="th"
                                  todayButton="เลือกวันนี้"
                                  selected={endDate}
                                  onChange={date => this.setEndDate(date)}
                                  dateFormatCalendar="LLLL yyyy"
                                  dateFormat="d MMMM y"
                                  selectsEnd
                                  startDate={startDate}
                                  endDate={endDate}
                                  minDate={startDate}
                                  customInput={<DatePickerButton />}
                                />
                              </div>
                            </th>
                          </tr>
                          <tr className="text-center">
                            <th>แสดงตน</th>
                            <th>อนุมัติ</th>
                            <th>แสดงตน</th>
                            <th>อนุมัติ</th>
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
                                  <td>{item.todayAppear}</td>
                                  <td>{item.todayApproved}</td>
                                  <td>{item.appearCount}</td>
                                  <td>{item.approvedCount}</td>
                                </tr>
                              );
                            })}
                          <tr>
                            <td colSpan={7}>&nbsp;</td>
                          </tr>
                          {dbInfo &&
                            dbInfo.groups.map((item, index) => {
                              return (
                                <tr
                                  className="text-center"
                                  key={`group-tr-${index}`}
                                >
                                  <td colSpan={2}>{item.name}</td>
                                  <td>{item.count}</td>
                                  <td>{item.todayAppear}</td>
                                  <td>{item.todayApproved}</td>
                                  <td>{item.appearCount}</td>
                                  <td>{item.approvedCount}</td>
                                </tr>
                              );
                            })}
                          <tr className="text-center font-weight-bold">
                            <td colSpan="2">รวมทั้งหมด</td>
                            <td>{dbInfo.total}</td>
                            <td>{dbInfo.todayAppear}</td>
                            <td>{dbInfo.todayApproved}</td>
                            <td>{dbInfo.appearTotal}</td>
                            <td>{dbInfo.approvedTotal}</td>
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
                    {/* <Tab.Pane eventKey="second">
                      <div className="text-center">
                        สำรองข้อมูล ยังไม่พร้อมใช้งาน
                      </div>
                    </Tab.Pane>
                    <Tab.Pane eventKey="third">
                      <div className="text-center">
                        ลบข้อมูล ยังไม่พร้อมใช้งาน
                      </div>
                    </Tab.Pane> */}
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

const DatePickerButton = forwardRef((props, ref) => {
  return (
    <Button
      ref={ref}
      variant="outline-secondary"
      size="sm"
      className="mx-1"
      onClick={props.onClick}
      style={{ width: "8.5rem" }}
    >
      {props.value}
    </Button>
  );
});

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
    getDatabaseInfo: () => dispatch(databaseActions.getInfo()),
    getVerifyInfoByDate: (date, startDate, endDate) =>
      dispatch(databaseActions.getVerifyInfoByDate(date, startDate, endDate))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Database);
