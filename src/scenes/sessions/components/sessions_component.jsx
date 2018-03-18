import React, { Component } from "react";

const SessionsComponent = props => {
  const isValid = element => element.checkValidity();

  const markTheInvalidInput = element => {
    element.classList.add("input-invalid");
    element.classList.remove("input-valid");
  };

  const markTheInputIsValid = element => {
    element.classList.add("input-valid");
  };

  const validateInput = event => {
    const { target } = event;
    if (!isValid(target)) {
      target.focus();
      return markTheInvalidInput(target);
    }

    return markTheInputIsValid(target);
  };

  return (
    <section>
      <form>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          onChange={props.handleInputChange}
          onBlur={validateInput}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          onChange={props.handleInputChange}
          onBlur={validateInput}
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

export default SessionsComponent;
