import React, { Component } from 'react';
import SessionsComponent from './../components/sessions_component'
import * as sessions_actions from './../actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

class SessionsContainer extends Component {

  componentDidMount(){
    this.props.fetch_session()
  }

  render() {
    return (
      <div className="SessionsContainer">
        <SessionsComponent session={this.props.session} />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    session: state.SessionsReducer.session
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(sessions_actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(SessionsContainer)
