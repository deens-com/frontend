import React, { Component } from 'react';
import SessionsComponent from './../components/sessions_component'
import * as sessions_actions from './../actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

class SessionsContainer extends Component {

  constructor(props){
    super(props)
    this.state = {
      email: '',
      password: ''
    }

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  parse_login = () => {
    this.props.fetch_session(this.state.email, this.state.password)
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  render() {
    return (
      <div className="SessionsContainer">
        <SessionsComponent
          session={this.props.session}
          submit_login={this.parse_login}
          email={this.state.email}
          password={this.state.password}
          handleInputChange={this.handleInputChange}
        />
      </div>
    );
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
