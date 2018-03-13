import React, { Component } from 'react';
import SessionsComponent from './../components/sessions_component'
import * as sessions_actions from './../actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

class SessionsContainer extends Component {
  render() {
    return (
      <div className="SessionsContainer">
        <SessionsComponent />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    services: state.SessionsReducer.services,
    test_number: state.SessionsReducer.test_number
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(sessions_actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SessionsContainer)
