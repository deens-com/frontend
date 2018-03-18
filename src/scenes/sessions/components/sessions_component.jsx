import React, { Component } from "react";

const SessionsComponent = props => {
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

// TODO add prop types validation

export default SessionsComponent;
