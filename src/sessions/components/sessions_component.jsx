import React, { Component } from 'react'

const SessionsComponent = (props) => {
  // const sign_in = () => {
  //   props.login('olivier@olivier.com', 'olivier@olivier.com')
  // }
  return(
    <section>
      <p onClick={props.submit_login}>Submit Login</p>
      <p>{props.session.id}</p>
    </section>
  )
}

export default SessionsComponent
