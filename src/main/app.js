import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Switch } from 'react-router'
import { Router, Route, Layout } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store'
import history from './history'
import ReactGA from 'react-ga'
import withTracker from './middlewares/with_tracker'
import Home from './../home/home'
import Sessions from './../sessions/sessions'
import Registrations from './../registrations/registrations'

const App = () => {
  return(
    <Provider store={store}>
      <Router history={history}>
        <Switch>
          <Route exact path='/' component={withTracker(Home)} />
          <Route path='/login' component={withTracker(Sessions)} />
          <Route path='/register' component={withTracker(Registrations)} />
        </Switch>
      </Router>
    </Provider>
  )
}

export default App
