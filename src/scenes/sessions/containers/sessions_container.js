import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import validator from 'validator';
import history from 'main/history';
import LoginFormComponent from './../components/login_form_component';
import * as sessionsActions from './../actions';

class SessionsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.isInputInvalid = this.isInputInvalid.bind(this);
    this.isLoginError = this.isLoginError.bind(this);
    if (localStorage.getItem('please-development-session')) {
      history.push('/');
    }
  }

  parseLogin = event => {
    event.preventDefault();
    if (!this.state.email) {
      this.setState({ [`email-error`]: true });
    }
    if (!this.state.password) {
      this.setState({ [`password-error`]: true });
    }
    if (!this.state.email || !this.state.password) {
      return this.props.login_error('Empty email or password');
    }
    this.props.loginRequest(this.state.email, this.state.password);
  };

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

  validateEmailInput(target) {
    const { name, value } = target;

    if (name === 'email' && value.length > 0 && !validator.isEmail(value)) {
      return this.setState({
        [`${name}-error`]: true,
      });
    }
  }

  validatePasswordInput(target) {
    const { name, value } = target;

    if (name === 'password' && value.length < 6) {
      return this.setState({
        [`${name}-error`]: true,
      });
    }
  }

  purgeErrorStates(name) {
    const currentState = this.state;
    delete currentState[`${name}-error`];
    this.setState(currentState);
  }

  validateInput = event => {
    const isValid = element => element.checkValidity();
    const { target } = event;
    const { name } = target;

    if (!isValid(target)) {
      this.validateEmailInput(target);
      this.validatePasswordInput(target);
    }

    this.purgeErrorStates(name);
  };

  isInputInvalid(name) {
    return this.state[name + '-error'];
  }

  isLoginError() {
    return Object.keys(this.props.loginError).includes('code');
  }

  componentDidMount() {
    this.props.clearErrors();
  }

  render() {
    return (
      <div className="SessionsContainer">
        <LoginFormComponent
          session={this.props.session}
          validationErrors={this.props.validationErrors}
          submitLogin={this.parseLogin}
          email={this.state.email}
          password={this.state.password}
          handleInputChange={this.handleInputChange}
          validateInput={this.validateInput}
          isInputInvalid={this.isInputInvalid}
          isLoginError={this.isLoginError}
          loginError={this.props.loginError}
          loginWithMetamask={this.props.loginWithMetamask}
          loginWithLedger={this.props.loginWithLedger}
          metaMaskError={this.props.metaMaskError}
          ledgerError={this.props.ledgerError}
          displayLedgerLoader={this.props.displayLedgerLoader}
          isLedgerLoaderDisplayed={this.props.isLedgerLoaderDisplayed}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    session: state.SessionsReducer.session,
    loginError: state.SessionsReducer.loginError,
    metaMaskError: state.SessionsReducer.metaMaskError,
    ledgerError: state.SessionsReducer.ledgerError,
    isLedgerLoaderDisplayed: state.SessionsReducer.isLedgerLoaderDisplayed,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(sessionsActions, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SessionsContainer);
