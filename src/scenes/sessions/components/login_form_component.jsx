import React, { Component } from "react";
import PropTypes from "prop-types";

const LoginFormComponent = props => {
  return (
    <section>
      <form>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          onChange={props.handleInputChange}
          onBlur={props.validateInput}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          onChange={props.handleInputChange}
          onBlur={props.validateInput}
          minLength={5}
          required
        />

        <button type="submit" onClick={props.submit_login}>
          Login
        </button>
      </form>
    </section>
  );
};

LoginFormComponent.propTypes = {
  submit_login: PropTypes.func,
  validateInput: PropTypes.func,
  handleInputChange: PropTypes.func
};

export default LoginFormComponent;
