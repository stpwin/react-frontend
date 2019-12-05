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
    this.props.dispatch(userActions.logout());

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
    const { dispatch } = this.props;
    if (username && password) {
      dispatch(userActions.login(username, password));
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
            <FormGroup className={submitted && !username ? " has-error" : ""}>
              <Form.Label htmlFor='username'>ชื่อผู้ใช้งาน</Form.Label>
              <Form.Control
                name='username'
                value={username}
                placeholder='ชื่อผู้ใช้งาน'
                onChange={this.handleChange}
              />
            </FormGroup>
            <FormGroup className={submitted && !username ? " has-error" : ""}>
              <Form.Label htmlFor='username'>รหัสผ่าน</Form.Label>
              <Form.Control
                name='password'
                type='password'
                value={password}
                placeholder='รหัสผ่าน'
                onChange={this.handleChange}
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
        {/* <div className='col-md-6 col-md-offset-3 p-5 text-center'>
          <form name='form' onSubmit={this.handleSubmit}>
            <div
              className={
                "form-group" + (submitted && !username ? " has-error" : "")
              }
            >
              <label htmlFor='username'>ชื่อผู้ใช้งาน</label>
              <input
                type='text'
                className='form-control'
                name='username'
                value={username}
                onChange={this.handleChange}
              />
              {submitted && !username && (
                <div className='help-block'>Username is required</div>
              )}
            </div>
            <div
              className={
                "form-group" + (submitted && !password ? " has-error" : "")
              }
            >
              <label htmlFor='password'>Password</label>
              <input
                type='password'
                className='form-control'
                name='password'
                value={password}
                onChange={this.handleChange}
              />
              {submitted && !password && (
                <div className='help-block'>Password is required</div>
              )}
            </div>
            <div className='form-group'>
              <button className='btn btn-primary'>Login</button>
              {loggingIn && (
                <img
                  alt='ABC'
                  src='data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=='
                />
              )}
            </div>
          </form>
        </div> */}
      </Container>
    );
  }
}

function mapStateToProps(state) {
  const { loggingIn } = state.authentication;
  return {
    loggingIn
  };
}

const connectedLoginPage = connect(mapStateToProps)(LoginPage);
export { connectedLoginPage as LoginPage };
