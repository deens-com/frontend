import React, { Component } from "react";
import LoginFormComponent from "./../components/login_form_component";
import * as sessions_actions from "./../actions";
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
  }

  parse_login = () => {
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
    const markTheInvalidInput = element => {
      element.classList.add("input-invalid");
      element.classList.remove("input-valid");
    };

    const markTheInputIsValid = element => {
      element.classList.add("input-valid");
    };

    const { target } = event;

    if (!isValid(target)) {
      target.focus();
      return markTheInvalidInput(target);
    }

    return markTheInputIsValid(target);
  };

  render() {
    return (
      <div className="SessionsContainer">
        <LoginFormComponent
          session={this.props.session}
          validationErrors={this.props.validationErrors}
          submit_login={this.parse_login}
          email={this.state.email}
          password={this.state.password}
          handleInputChange={this.handleInputChange}
          validateInput={this.validateInput}
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
  return bindActionCreators(sessions_actions, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(SessionsContainer);
