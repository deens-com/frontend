import React, {Component} from "react";
import PropTypes from "prop-types";
import {
  Button,
  Form,
  Grid,
  Header,
  Message,
  Segment,
  Image,
  Modal,
  Dimmer,
  Loader
} from "semantic-ui-react";
import styled from "styled-components";
import TopBar from "./../../../shared_components/TopBar";
import FooterNav from "./../../../styled_scenes/Home/components/FooterNav";
import BrandFooter from "./../../../shared_components/BrandFooter";
import {
  Page,
  PageContent,
  PageWrapper
} from "./../../../shared_components/layout/Page";
import { Link } from "react-router-dom";
import { Hr } from "./../../../shared_components/styledComponents/misc";

const displayErrorMessage = (isLoginError, message) => {
  return isLoginError ? (
    <Message error header="Cannot login" content={message} />
  ) : null;
};

const WithTopMargin = styled.div`
  margin-top: 16px;
`;

export default class LoginFormComponent extends Component {

  constructor(props){
    super(props);
    this.state = {
      isLedgerModalOpen: true,
      isLedgerLoaderDisplayed: false
    };
    this.closeLedgerErrorMessage = this.closeLedgerErrorMessage.bind(this);
    this.isLoaderActive = this.isLoaderActive.bind(this);
  }

  toggleLedgerloaderDisplay(){
    this.setState({isLedgerLoaderDisplayed: !!this.state.isLedgerLoaderDisplayed});
  }

  closeLedgerErrorMessage() {
    this.setState({isLedgerModalOpen: false});
  }

  isLoaderActive(){
    this.state.isLedgerModalOpen ? true : false
  }

  render(){
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
                  <Form size="large" error={this.props.isLoginError()}>
                    <Segment stacked>
                      <Form.Input
                        fluid
                        icon="user"
                        iconPosition="left"
                        placeholder="E-mail address"
                        type="email"
                        name="email"
                        id="email"
                        onChange={this.props.handleInputChange}
                        onBlur={this.props.validateInput}
                        error={this.props.isInputInvalid("email")}
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
                        onChange={this.props.handleInputChange}
                        onBlur={this.props.validateInput}
                        error={this.props.isInputInvalid("password")}
                        minLength={6}
                        required
                      />

                      {displayErrorMessage(
                        this.props.isLoginError(),
                        this.props.loginError.message
                      )}

                      <Button
                        color="teal"
                        fluid
                        size="large"
                        onClick={this.props.submitLogin}
                      >
                        Login
                      </Button>
                    </Segment>
                  </Form>
                  <WithTopMargin>
                    {displayErrorMessage(
                      !!this.props.metaMaskError.message,
                      this.props.metaMaskError.message
                    )}
                    <Button
                      color="orange"
                      fluid
                      size="large"
                      onClick={this.props.loginWithMetamask}
                    >
                    Login with MetaMask
                    </Button>
                  </WithTopMargin>

                  <WithTopMargin>
                    {displayErrorMessage(
                      !!this.props.ledgerError.message,
                      this.props.ledgerError.message
                    )}

                    {
                      this.props.ledgerError.message &&
                      <Modal closeIcon onClose={this.closeLedgerErrorMessage} open={this.state.isLedgerModalOpen} style={{textAlign: "center"}}>
                        <Modal.Header>Ledger Connection Error</Modal.Header>
                        <Modal.Content>
                          <Modal.Description>
                            <Header>An unexpected error occured</Header>
                            <p style={{color: "red"}}>{this.props.ledgerError.message}</p>
                            <p>Please make sure to allow browser support on your connected device.</p>
                          </Modal.Description>
                        </Modal.Content>
                      </Modal>
                    }

                    {
                      this.props.isLedgerLoaderDisplayed &&
                        <Segment disabled={this.isLoaderActive()}>
                          <Dimmer active>
                            <Loader inline='centered'>Please wait 6 seconds while we try to establish a connection with your ledger device.</Loader>
                          </Dimmer>
                        </Segment>
                    }

                    <Button
                      color="green"
                      fluid
                      size="large"
                      onClick={this.props.loginWithLedger}
                    >
                    Login with Ledger
                    </Button>
                  </WithTopMargin>

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
  }
};

LoginFormComponent.propTypes = {
  isInputInvalid: PropTypes.func,
  isLoginError: PropTypes.func,
  submitLogin: PropTypes.func,
  validateInput: PropTypes.func,
  handleInputChange: PropTypes.func,
  loginWithMetamask: PropTypes.func.isRequired,
  metaMaskError: PropTypes.object,
  ledgerError: PropTypes.object
};

//export default LoginFormComponent;
