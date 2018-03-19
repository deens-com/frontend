import React, { Component } from "react";

const SessionsComponent = props => {
  return (
    <section>
      <label htmlFor="email">Email</label>
      <input
        type="email"
        name="email"
        id="email"
        onChange={props.handleInputChange}
      />

      <label htmlFor="password">Password</label>
      <input
        type="password"
        name="password"
        id="password"
        onChange={props.handleInputChange}
      />

      <p onClick={props.submit_login}>Submit Login</p>
      <p>{props.session.id}</p>
      <button class="ui button" role="button">
        Click Here
      </button>
    </section>
  );
};

export default SessionsComponent;
