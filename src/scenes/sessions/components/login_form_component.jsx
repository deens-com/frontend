import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Form,
  Grid,
  Header,
  Image,
  Message,
  Segment
} from "semantic-ui-react";

import { Logo } from "./../../../shared_components/icons";

const LoginFormComponent = props => {
  return (
    <section>
      <div className="login-form">
        <Grid
          textAlign="center"
          style={{ height: "100%" }}
          verticalAlign="middle"
        >
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as="h2" color="teal" textAlign="center">
              <Logo />
              Log-in to your account
            </Header>
            <Form size="large">
              <Segment stacked>
                <Form.Input
                  fluid
                  icon="user"
                  iconPosition="left"
                  placeholder="E-mail address"
                  type="email"
                  name="email"
                  id="email"
                  onChange={props.handleInputChange}
                  onBlur={props.validateInput}
                  required
                />
                <Form.Input
                  fluid
                  icon="lock"
                  iconPosition="left"
                  placeholder="Password"
                  type="password"
                  name="password"
                  id="password"
                  onChange={props.handleInputChange}
                  onBlur={props.validateInput}
                  minLength={4}
                  required
                />

                <Button
                  color="teal"
                  fluid
                  size="large"
                  onClick={props.submitLogin}
                >
                  Login
                </Button>
              </Segment>
            </Form>
            <Message>
              New to us? <a href="#">Sign Up</a>
            </Message>
          </Grid.Column>
        </Grid>
      </div>
    </section>
  );
};

LoginFormComponent.propTypes = {
  submitLogin: PropTypes.func,
  validateInput: PropTypes.func,
  handleInputChange: PropTypes.func
};

export default LoginFormComponent;
