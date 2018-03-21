import React, { Component } from "react";
import LoginFormComponent from "./../components/login_form_component";
import * as sessionsActions from "./../actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

class SessionsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.isInputInvalid = this.isInputInvalid.bind(this);
  }

  parseLogin = event => {
    event.preventDefault();
    this.props.loginRequest(this.state.email, this.state.password);
  };

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  validateInput = event => {
    const isValid = element => element.checkValidity();
    const { target } = event;

    if (!isValid(target)) {
      target.focus();

      if (
        target.name === "email" &&
        target.value.length > 0 &&
        target.value.includes("@") === false
      ) {
        return this.setState({
          [`${target.name}-error`]: true
        });
      }

      if (target.name === "password" && target.value.length < 8) {
        return this.setState({
          [`${target.name}-error`]: true
        });
      }
    }
  };

  isInputInvalid(name) {
    return this.state[name + "-error"];
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
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    session: state.SessionsReducer.session
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(sessionsActions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(SessionsContainer);
