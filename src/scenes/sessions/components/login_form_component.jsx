import React from "react";
import PropTypes from "prop-types";
import {
  Button,
  Form,
  Grid,
  Header,
  Message,
  Segment
} from "semantic-ui-react";
import TopBar from "./../../../shared_components/TopBar";
import FooterNav from "./../../../styled_scenes/Home/components/FooterNav";
import BrandFooter from "./../../../shared_components/BrandFooter";
import {
  Page,
  PageContent,
  PageWrapper
} from "./../../../shared_components/layout/Page";
import { Logo } from "./../../../shared_components/icons";
import { Link } from "react-router-dom";
import { Hr } from "./../../../shared_components/styledComponents/misc";

const LoginFormComponent = props => {
  return (
    <section>
      <Page topPush>
        <TopBar fixed withPadding />
        <PageContent>
          <div className="login-form">
            <Grid
              textAlign="center"
              style={{ height: "100%" }}
              verticalAlign="middle"
            >
              <Grid.Column style={{ maxWidth: 450 }}>
                <br />
                <Header as="h2" color="teal" textAlign="center">
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
                      error={props.isInputInvalid("email")}
                      autoFocus
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
                      error={props.isInputInvalid("password")}
                      minLength={8}
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
                  New to us? <Link to="/register">Sign Up</Link>
                </Message>
              </Grid.Column>
            </Grid>
          </div>

          <PageWrapper>
            <Hr withSpacing />
            <FooterNav />
            <Hr />
            <BrandFooter />
          </PageWrapper>
        </PageContent>
      </Page>
    </section>
  );
};

LoginFormComponent.propTypes = {
  submitLogin: PropTypes.func,
  isInputInvalid: PropTypes.func,
  validateInput: PropTypes.func,
  handleInputChange: PropTypes.func
};

export default LoginFormComponent;
