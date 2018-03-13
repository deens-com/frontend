import React, { Component } from 'react'

const HomeComponent = (props) => {
  return(
    <section>
      <p>Home</p>
      <p>{props.test_number}</p>
      <p>{props.services}</p>
    </section>
  )
}

export default HomeComponent
