import React, { Component } from 'react';
import RecoverPasswordComponent from './component';
import isEmail from 'validator/lib/isEmail';
import history from 'main/history';
import axios from 'libs/axios';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import headerActions from 'store/header/actions';

class RegistrationsContainer extends Component {
  constructor(props) {
    super(props);
    props.changeHeader();
    this.state = {
      email: '',
      errors: {},
      isLoading: false,
      recovered: false,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.isInputInvalid = this.isInputInvalid.bind(this);
  }

  validateEmailInput(target) {
    const { name, value } = target;
    if (name === 'email' && value.length > 0 && value.includes('@') === false) {
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
    }

    this.purgeErrorStates(name);
  };

  isInputInvalid(name) {
    return this.state[name + '-error'];
  }

  parseRecoverPassword = async () => {
    if (!isEmail(this.state.email)) {
      this.setState({
        errors: { message: 'Please enter a valid email address' },
      });
      return;
    }
    const email = this.state.email.toLowerCase();

    try {
      this.setState({
        isLoading: true,
        errors: {},
      });

      await axios.post('/users/password-reset', {
        email,
      });

      this.setState({
        isLoading: false,
        recovered: true,
      });
    } catch (error) {
      const errorMessage =
        (error.response &&
          error.response.data &&
          (error.response.data.message ||
            error.response.data.error_description ||
            error.response.data.description)) ||
        error.message;

      this.setState({
        isLoading: false,
        errors: {
          message: errorMessage,
        },
      });
    }
  };

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  render() {
    return (
      <div className="RecoverPasswordContainer">
        <RecoverPasswordComponent
          email={this.state.email}
          isLoading={this.state.isLoading}
          recovered={this.state.recovered}
          stateErrors={this.state.errors}
          handleInputChange={this.handleInputChange}
          onSubmit={this.parseRecoverPassword}
          validateInput={this.validateInput}
          isInputInvalid={this.isInputInvalid}
          from={this.props.from}
          message={this.props.message}
          action={this.props.action}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  session: state.session.session,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      changeHeader: headerActions.changeHeader,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RegistrationsContainer);
