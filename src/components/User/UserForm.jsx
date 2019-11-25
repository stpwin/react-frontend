import React, { Fragment } from "react";

import {
  Form,
  FormControl,
  ButtonToolbar,
  Col,
  Row,
  Button,
  Dropdown
} from "react-bootstrap";

export const UserForm = ({
  user: { username, displayName, description, password, confirmPassword, role },
  validate: { usernameErrorText, displayNameErrorText, passwordErrorText, passwordMismatch },
  roles,
  readOnly,
  hidePasswordSection,
  canSubmit,
  onChange,
  onRoleChange,
  onSubmit,
  onReset,
}) => {

  return (
    <Form onSubmit={onSubmit} onReset={onReset}>
      <Form.Group as={Row}>
        <Form.Label column sm={2}>
          Username
          </Form.Label>
        <Col sm={5}>
          <FormControl
            placeholder='Username'
            maxLength={20}
            name='username'
            onChange={onChange}
            value={username || ""}
            disabled={readOnly}
            isInvalid={usernameErrorText !== ""}
          />
          <Form.Text className='text-danger' hidden={!usernameErrorText}>
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
            onChange={onChange}
            value={displayName || ""}
            isInvalid={displayNameErrorText !== ""}
          />
          <Form.Text className='text-danger' hidden={!displayNameErrorText}>
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
            onChange={onChange}
            value={description || ""}
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row}>
        <Form.Label column sm={2}>
          สิทธิ์
          </Form.Label>
        <Col sm={5}>
          <Dropdown id='role-dropdown' onSelect={onRoleChange}>
            <Dropdown.Toggle
              variant='outline'
              className='pea-color'
              id='dropdown-basic'
            >
              {role}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {roles &&
                roles.map((data, index) => {
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
                onChange={onChange}
                value={password || ""}
                isInvalid={passwordErrorText !== "" && !passwordMismatch}
              />
              <Form.Text className='text-danger' hidden={!passwordErrorText || passwordMismatch}>
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
                onChange={onChange}
                value={confirmPassword || ""}
                isInvalid={passwordMismatch}
              />
              <Form.Text className='text-danger' hidden={!passwordMismatch}>
                {passwordErrorText}
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

export default UserForm;
