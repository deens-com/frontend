import React, { Component } from 'react';
import RegistrationsComponent from './../components/registrations_component';
import * as registrations_actions from './../actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import validator from 'validator';
import history from 'main/history';
import { getSession } from 'libs/user-session';

class RegistrationsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      password_confirmation: '',
      errors: {},
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.isInputInvalid = this.isInputInvalid.bind(this);
    if (getSession()) {
      history.push('/');
    }
  }

  componentDidMount() {
    // clear registration errors
    this.props.registrationFailed({});
  }

  validateEmailInput(target) {
    const { name, value } = target;
    if (name === 'email' && value.length > 0 && value.includes('@') === false) {
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

  parseRegister = () => {
    if (this.state.password !== this.state.password_confirmation) {
      this.setState({ errors: { message: 'Password does not match' } });
      return;
    }
    if (this.state.password.length < 6) {
      this.setState({
        errors: { message: 'Password must be at least 6 characters long' },
      });
      return;
    }
    if (this.state.username.length < 4) {
      this.setState({
        errors: { message: 'Username must be at least 4 characters long' },
      });
      return;
    }
    if (!validator.isEmail(this.state.email)) {
      this.setState({
        errors: { message: 'Please enter a valid email address' },
      });
      return;
    }
    const email = this.state.email.toLowerCase();
    this.props.postRegistration(this.state.username, email, this.state.password);
  };

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  render() {
    return (
      <div className="RegistrationsContainer">
        <RegistrationsComponent
          session={this.props.session}
          username={this.state.username}
          email={this.state.email}
          password={this.state.password}
          password_confirmation={this.state.password_confirmation}
          errors={this.props.errors}
          stateErrors={this.state.errors}
          handleInputChange={this.handleInputChange}
          onSubmitRegistration={this.parseRegister}
          validationErrors={this.props.validationErrors}
          validateInput={this.validateInput}
          isInputInvalid={this.isInputInvalid}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    session: state.RegistrationsReducer.session,
    errors: state.RegistrationsReducer.errors,
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(registrations_actions, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RegistrationsContainer);
