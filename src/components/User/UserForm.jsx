import React, { Component, Fragment } from "react";

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
    username: (this.props.user && this.props.user.username) || "",
    displayName: (this.props.user && this.props.user.displayName) || "",
    description: (this.props.user && this.props.user.description) || "",
    password: "",
    confirmPassword: "",
    role: (this.props.user && this.props.user.role) || "supervisor",
    usernameInvalid: this.props.user && this.props.user.username ? false : true,
    displayNameInvalid:
      this.props.user && this.props.user.displayName ? false : true,
    passwordInvalid: this.props.skipEmptyPasswordValidation ? false : true,
    usernameErrorText: "",
    displayNameErrorText: "",
    passwordErrorText: "",
    passwordMismatch: false,
    canSubmit: false
  };

  roles = ["administrator", "supervisor"];

  canSubmitCheck = () => {
    const { usernameInvalid, displayNameInvalid, passwordInvalid } = this.state;
    const { skipEmptyPasswordValidation } = this.props;

    this.setState({
      canSubmit: !(usernameInvalid ||
      displayNameInvalid ||
      skipEmptyPasswordValidation
        ? false
        : passwordInvalid)
    });
  };

  validateForm = (name, value) => {
    const { password, confirmPassword } = this.state;

    if (name === "username") {
      this.setState(
        {
          usernameInvalid: value.length < 3,
          usernameErrorText:
            value.length === 0
              ? "ไม่สามารถเว้นว่าง"
              : value.length < 3
              ? "อย่างน้อย 3 ตัวอักษร"
              : ""
        },
        this.canSubmitCheck
      );
    } else if (name === "displayName") {
      this.setState(
        {
          displayNameInvalid: value.length < 3,
          displayNameErrorText:
            value.length === 0
              ? "ไม่สามารถเว้นว่าง"
              : value.length < 3
              ? "อย่างน้อย 3 ตัวอักษร"
              : ""
        },
        this.canSubmitCheck
      );
    } else if (name === "password" || name === "confirmPassword") {
      if (
        password.length === 0 &&
        confirmPassword.length === 0 &&
        this.props.skipEmptyPasswordValidation
      ) {
        this.setState({
          passwordInvalid: false
        });
        return;
      }
      this.setState(
        {
          passwordInvalid:
            value.length < 6 ? true : password !== confirmPassword,
          passwordMismatch: value.length >= 6 && password !== confirmPassword,
          passwordErrorText:
            value.length === 0
              ? "ไม่สามารถเว้นว่าง"
              : value.length < 6
              ? "รหัสผ่านอย่างน้อย 6 ตัวอักษร"
              : password !== confirmPassword
              ? "รหัสผ่านไม่ตรงกัน"
              : ""
        },
        this.canSubmitCheck
      );
    } else {
      this.canSubmitCheck();
    }
  };

  handleTextChange = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState(
      {
        [name]: value
      },
      () => {
        this.validateForm(name, value);
      }
    );
  };

  handleRoleChange = e => {
    // console.log(e);
    this.setState(
      {
        role: e
      },
      this.canSubmitCheck
    );
  };

  handleSubmit = e => {
    e.preventDefault();
    // console.log("on submit");

    const { canSubmit } = this.state;
    const { handleSubmit } = this.props;

    return canSubmit && handleSubmit && handleSubmit(this.state);
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
      confirmPassword,
      usernameInvalid,
      displayNameInvalid,
      passwordInvalid,
      passwordMismatch,
      usernameErrorText,
      displayNameErrorText,
      passwordErrorText,
      canSubmit
    } = this.state;
    const { readOnly, hidePasswordSection } = this.props;
    return (
      <Form onSubmit={this.handleSubmit} onReset={this.handleReset}>
        <Form.Group as={Row}>
          <Form.Label column sm={2}>
            Username
          </Form.Label>
          <Col sm={5}>
            <FormControl
              placeholder='Username'
              maxLength={20}
              name='username'
              onChange={this.handleTextChange}
              value={username}
              disabled={readOnly}
              isInvalid={usernameInvalid}
            />
            <Form.Text className='text-danger' hidden={!usernameInvalid}>
              {usernameErrorText}
            </Form.Text>
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column sm={2}>
            ชื่อที่แสดง
          </Form.Label>
          <Col sm={5}>
            <FormControl
              placeholder='ชื่อที่แสดง'
              maxLength={20}
              name='displayName'
              onChange={this.handleTextChange}
              value={displayName}
              isInvalid={displayNameInvalid}
            />
            <Form.Text className='text-danger' hidden={!displayNameInvalid}>
              {displayNameErrorText}
            </Form.Text>
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column sm={2}>
            รายละเอียด
          </Form.Label>
          <Col sm={5}>
            <FormControl
              as='textarea'
              rows='3'
              placeholder='รายละเอียด'
              maxLength={100}
              name='description'
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
            <Dropdown id='role-dropdown' onSelect={this.handleRoleChange}>
              <Dropdown.Toggle
                variant='outline'
                className='pea-color'
                id='dropdown-basic'
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

        {hidePasswordSection ? null : (
          <Fragment>
            <Form.Group as={Row}>
              <Form.Label column sm={2}>
                รหัสผ่าน
              </Form.Label>
              <Col sm={5}>
                <FormControl
                  type='password'
                  placeholder='รหัสผ่าน'
                  maxLength={20}
                  name='password'
                  onChange={this.handleTextChange}
                  value={password}
                  isInvalid={passwordInvalid}
                />
                <Form.Text className='text-danger' hidden={!passwordInvalid}>
                  {passwordErrorText}
                </Form.Text>
              </Col>
            </Form.Group>

            <Form.Group as={Row}>
              <Form.Label column sm={2}>
                ยืนยันรหัสผ่าน
              </Form.Label>
              <Col sm={5}>
                <FormControl
                  type='password'
                  placeholder='ยีนยันรหัสผ่าน'
                  maxLength={20}
                  name='confirmPassword'
                  onChange={this.handleTextChange}
                  value={confirmPassword}
                  isInvalid={passwordInvalid}
                />
                <Form.Text className='text-danger' hidden={!passwordMismatch}>
                  รหัสผ่านไม่ตรงกัน
                </Form.Text>
              </Col>
            </Form.Group>
          </Fragment>
        )}

        <Form.Group as={Row}>
          <Col sm={2} />
          <Col sm={5} className='text-center'>
            <ButtonToolbar>
              <Button
                type='submit'
                variant='outline'
                className='pea-color'
                disabled={!canSubmit}
              >
                บันทึก
              </Button>
              <Button type='reset' variant='outline' className='pea-color'>
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
