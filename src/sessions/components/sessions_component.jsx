import React, { Component } from 'react'

const SessionsComponent = (props) => {
  return(
    <section>
      <p>Sessions</p>
      <p>{props.session.id}</p>
    </section>
  )
}

export default SessionsComponent
