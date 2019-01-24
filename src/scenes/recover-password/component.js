import React from 'react';
import { Page } from 'shared_components/layout/Page';
import TopBar from 'shared_components/TopBar';
import BrandFooter from 'shared_components/BrandFooter';
import { Button, Form, Grid, Message, Container } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import welcomeImage from 'assets/login/login.svg';

const StaticFooter = styled.footer`
  position: static;
  bottom: 0px;
`;

const LoginContainer = styled.div`
  min-height: 75vh;
  margin-top: 40px;
  margin-bottom: 40px;

  .login-img {
    width: 80%;
  }

  .login-img-content {
    margin-top: 30px;
    font-size: 25px;
    color: #636363;
    font-weight: 300;
  }

  .login-header {
    font-size: 22px;
    font-weight: 300;
    color: #2bd49e;
    text-align: center;
    margin: 10px 0;
  }

  .green-btn,
  .green-btn:hover,
  .green-btn:focus {
    background: #2bd49e;
    color: white;
  }

  .login-q-text {
    margin-top: 30px;
    font-size: 14px;
    a {
      color: #1dbdbc;
    }
  }
`;

const RecoveredBox = styled.div`
  color: #4fb798;
  background-color: #b9ffe7;
  border: 1px solid #4fb798;
  padding: 20px 30px;
  font-weight: bold;
  border-radius: 5px;
`;

const RecoverPassword = props => {
  return (
    <section>
      <Page topPush>
        <TopBar fixed />
        <Container>
          <LoginContainer>
            <br /> <br />
            <Grid centered stackable verticalAlign="middle">
              <Grid.Row columns={2}>
                <Grid.Column textAlign="center" floated="left">
                  <img src={welcomeImage} alt="welcomeImage" className="login-img" />
                  <div className="login-img-content">Plan your next trip with us!</div>
                </Grid.Column>
                <Grid.Column width="6" floated="right">
                  {props.recovered ? (
                    <RecoveredBox>
                      Please check your email to recover your password: {props.email}
                    </RecoveredBox>
                  ) : (
                    <React.Fragment>
                      {props.message && (
                        <Message floating warning>
                          {props.message}
                        </Message>
                      )}
                      <div className="login-header">Recover your password</div>
                      <br />
                      {Object.keys(props.stateErrors).length !== 0 && (
                        <Message style={{ color: 'red', whiteSpace: 'pre-line' }}>
                          {props.stateErrors.message}
                        </Message>
                      )}
                      <Form size="large">
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
                          error={props.isInputInvalid('email')}
                          required
                        />

                        <Button
                          className="green-btn pl-btn"
                          loading={props.isLoading}
                          disabled={props.isLoading}
                          fluid
                          size="large"
                          onClick={props.onSubmit}
                        >
                          Recover password
                        </Button>
                      </Form>

                      <div className="login-q-text">
                        Don't have an account?&nbsp;&nbsp;
                        <Link
                          to={{
                            pathname: '/register',
                            state: {
                              message: props.message,
                              from: props.from,
                              action: props.action,
                            },
                          }}
                          replace
                        >
                          Sign Up
                        </Link>
                      </div>
                    </React.Fragment>
                  )}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </LoginContainer>
        </Container>
        <StaticFooter>
          <BrandFooter withTopBorder withPadding />
        </StaticFooter>
      </Page>
    </section>
  );
};

export default RecoverPassword;
