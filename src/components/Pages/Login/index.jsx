import React, { Fragment } from "react";
// import { Link } from 'react-router-dom';
import { connect } from "react-redux";

import { userActions } from "../../../actions";

import {
  Container,
  Button,
  Col,
  Form,
  FormGroup,
  Spinner
} from "react-bootstrap";

class LoginPage extends React.Component {
  constructor(props) {
    super(props);

    // reset login status
    this.props.logout();

    this.state = {
      username: "stpwin",
      password: "sittiporn",
      submitted: false
    };
  }

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSubmit = e => {
    e.preventDefault();

    this.setState({ submitted: true });
    const { username, password } = this.state;

    if (username && password) {
      this.props.login(username, password);
    }
  };

  render() {
    const { loggingIn } = this.props;
    const { username, password, submitted } = this.state;
    return (
      <Container>
        <Col md={{ span: 6, offset: 3 }} className='text-center p-5'>
          <h2>เข้าสู่ระบบ</h2>
          <Form onSubmit={this.handleSubmit}>
            <FormGroup>
              <Form.Label htmlFor='username'>ชื่อผู้ใช้งาน</Form.Label>
              <Form.Control
                name='username'
                value={username}
                placeholder='ชื่อผู้ใช้งาน'
                onChange={this.handleChange}
                isInvalid={submitted && !username}
              />
            </FormGroup>
            <FormGroup>
              <Form.Label htmlFor='username'>รหัสผ่าน</Form.Label>
              <Form.Control
                name='password'
                type='password'
                value={password}
                placeholder='รหัสผ่าน'
                onChange={this.handleChange}
                isInvalid={submitted && !password}
              />
            </FormGroup>
            <FormGroup>
              <Button
                type='submit'
                variant='outline'
                className='pea-color spinner-margin'
                disabled={loggingIn}
              >
                {loggingIn ? (
                  <Fragment>
                    <Spinner
                      as='span'
                      animation='border'
                      size='sm'
                      role='status'
                      aria-hidden={true}
                    />
                    <span>กำลังเข้าสู่ระบบ...</span>
                  </Fragment>
                ) : (
                  "เข้าสู่ระบบ"
                )}
              </Button>
            </FormGroup>
          </Form>
        </Col>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  const { loggingIn } = state.authentication;
  return {
    loggingIn
  };
};

const mapDispatchToProps = dispatch => {
  return {
    login: (username, password) =>
      dispatch(userActions.login(username, password)),
    logout: () => dispatch(userActions.logout())
  };
};

const connectedLoginPage = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginPage);
export { connectedLoginPage as LoginPage };
