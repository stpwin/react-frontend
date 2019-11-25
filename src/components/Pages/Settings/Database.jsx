import React from "react";
import {
  Row,
  Col,
  Table,
  Nav,
  Tab,
  ButtonToolbar,
  Button
} from "react-bootstrap";

export const Database = ({ data, onSetCounter, onResetCounter }) => {
  return (
    <div>
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
                </Nav>
              </Col>
              <Col sm={9}>
                <Tab.Content>
                  <Tab.Pane eventKey="first">
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th className="text-center">#</th>
                          <th>ชื่อการนับ</th>
                          <th>ลำดับข้อมูล</th>
                          <th>เครื่องมือ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data &&
                          data.map((item, index) => {
                            return (
                              <tr key={`counter-tr-${index}`}>
                                <td className="text-center">{index + 1}</td>
                                <td>{item._id}</td>
                                <td className="text-center">{item.sequence}</td>
                                <td>
                                  <Tools
                                    onSet={() =>
                                      onSetCounter(item._id, item.sequence)
                                    }
                                    onReset={() => onResetCounter(item._id)}
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
    </div>
  );
};

const Tools = ({ onSet, onReset }) => {
  return (
    <ButtonToolbar>
      <Button size="sm" variant="warning" onClick={onSet}>
        ตั้งการนับ
      </Button>
      <Button size="sm" variant="danger" onClick={onReset}>
        เริ่มการนับใหม่
      </Button>
    </ButtonToolbar>
  );
};

export default Database;
