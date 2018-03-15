import React, { Component } from 'react';

const RegistrationsComponent = props => {
  return (
    <section>
      <label htmlFor="username">Username</label>
      <input
        type="username"
        name="username"
        id="username"
        onChange={props.onHandleInputChange}
      />

      <label htmlFor="email">Email</label>
      <input
        type="email"
        name="email"
        id="email"
        onChange={props.onHandleInputChange}
      />

      <label htmlFor="password">Password</label>
      <input
        type="password"
        name="password"
        id="password"
        onChange={props.onHandleInputChange}
      />

      <label htmlFor="password_confirmation">Password Confirmation</label>
      <input
        type="password"
        name="password_confirmation"
        id="password_confirmation"
        onChange={props.onHandleInputChange}
      />

      <button onClick={props.onSubmitRegistration}>Submit Registration</button>
      <p>{props.session.id}</p>
    </section>
  );
};

export default RegistrationsComponent;
