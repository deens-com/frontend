import React, { Component } from 'react';
import RegistrationsComponent from './../components/registrations_component'
import * as registrations_actions from './../actions'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

class RegistrationsContainer extends Component {

  constructor(props){
    super(props)
    this.state = {
      username: '',
      email: '',
      password: '',
      password_confirmation: '',
      errors: {}
    }
  }

  parseRegister = () => {
    if(this.state.password !== this.state.password_confirmation){
      this.setState({errors: {message: 'Password does not match'}})
    }
    this.props.postRegistration(this.state.username, this.state.email, this.state.password)
  }

  handleInputChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  render() {
    return (
      <div className="RegistrationsContainer">
        <RegistrationsComponent
          session={this.props.session}
          username={this.state.username}
          email={this.state.email}
          password={this.state.password}
          password_confirmation={this.state.password_confirmation}
          errors={this.props.errors}
          onHandleInputChange={this.handleInputChange}
          onSubmitRegistration={this.parseRegister}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    session: state.RegistrationsReducer.session,
    errors: state.RegistrationsReducer.errors
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(registrations_actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationsContainer)
