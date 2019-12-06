import React, { Component } from "react";

import {
  Form,
  FormControl,
  ButtonToolbar,
  Col,
  Row,
  Button,
  Dropdown
} from "react-bootstrap";

export class UserForm extends Component {
  state = {
    username: "",
    displayName: "",
    description: "",
    password: "",
    confirmPassword: "",
    role: "supervisor"
  };

  roles = ["administrator", "supervisor"];

  handleTextChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handleRoleChange = e => {
    // console.log(e);
    this.setState({
      role: e
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    // console.log("on submit");

    const { username, displayName, password, confirmPassword } = this.state;
    const { handleSubmit } = this.props;
    if (!username) {
      console.log("Username ไม่สามารถเว้นว่าง");
      return;
    }
    if (!displayName) {
      console.log("ชื่อที่แสดงไม่สามารถเว้นว่าง");
      return;
    }
    if (password.length < 6) {
      console.log("รหัสผ่านต้อง 6 ตัวอักษรขึ้นไป");
      return;
    }
    if (password !== confirmPassword) {
      console.log("รหัสผ่านไม่ตรงกัน");
      return;
    }

    return handleSubmit && handleSubmit(this.state);
  };

  handleReset = e => {
    this.props.history.goBack();
    console.log("on reset");
  };

  render() {
    const {
      username,
      displayName,
      description,
      role,
      password,
      confirmPassword
    } = this.state;
    const { readOnly } = this.props;
    return (
      <Form onSubmit={this.handleSubmit} onReset={this.handleReset}>
        <Form.Group as={Row}>
          <Form.Label column sm={2}>
            Username
          </Form.Label>
          <Col sm={5}>
            <FormControl
              placeholder="Username"
              maxLength={20}
              name="username"
              onChange={this.handleTextChange}
              value={username}
              disabled={readOnly}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column sm={2}>
            ชื่อที่แสดง
          </Form.Label>
          <Col sm={5}>
            <FormControl
              placeholder="ชื่อที่แสดง"
              maxLength={20}
              name="displayName"
              onChange={this.handleTextChange}
              value={displayName}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column sm={2}>
            รายละเอียด
          </Form.Label>
          <Col sm={5}>
            <FormControl
              placeholder="รายละเอียด"
              maxLength={100}
              name="description"
              onChange={this.handleTextChange}
              value={description}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column sm={2}>
            สิทธิ์
          </Form.Label>
          <Col sm={5}>
            <Dropdown id="role-dropdown" onSelect={this.handleRoleChange}>
              <Dropdown.Toggle
                variant="outline"
                className="pea-color"
                id="dropdown-basic"
              >
                {role}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {this.roles &&
                  this.roles.map((data, index) => {
                    return (
                      <Dropdown.Item key={`d-item-${data}`} eventKey={data}>
                        {data}
                      </Dropdown.Item>
                    );
                  })}
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column sm={2}>
            รหัสผ่าน
          </Form.Label>
          <Col sm={5}>
            <FormControl
              type="password"
              placeholder="รหัสผ่าน"
              maxLength={20}
              name="password"
              onChange={this.handleTextChange}
              value={password}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column sm={2}>
            ยืนยันรหัสผ่าน
          </Form.Label>
          <Col sm={5}>
            <FormControl
              type="password"
              placeholder="ยีนยันรหัสผ่าน"
              maxLength={20}
              name="confirmPassword"
              onChange={this.handleTextChange}
              value={confirmPassword}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Col sm={2} />
          <Col sm={5} className="text-center">
            <ButtonToolbar>
              <Button type="submit" variant="outline" className="pea-color">
                บันทึก
              </Button>
              <Button type="reset" variant="outline" className="pea-color">
                ยกเลิก
              </Button>
            </ButtonToolbar>
          </Col>
        </Form.Group>
      </Form>
    );
  }
}

export default UserForm;
