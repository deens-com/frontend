import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Switch } from "react-router";
import { Router, Route, Layout, HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import Home from "./../scenes/home/home";
import Sessions from "./../scenes/sessions/sessions";
import Results from "./../scenes/results/results";
import Trips from "./../scenes/trips/trips";
import Users from "./../scenes/users/users";
import Services from "./../scenes/services/services";
import Registrations from "./../scenes/registrations/registrations";

const App = () => {
  return (
    <Provider store={store}>
      <HashRouter>
        <Switch>
          <Route
            exact
            path={process.env.PUBLIC_URL + "/"}
            component={Home}
          />
          <Route
            path={process.env.PUBLIC_URL + "/login"}
            component={Sessions}
          />
          <Route
            path={process.env.PUBLIC_URL + "/register"}
            component={Registrations}
          />
          <Route
            path={process.env.PUBLIC_URL + "/results"}
            component={Results}
          />
          <Route
            path={process.env.PUBLIC_URL + "/services/:id"}
            component={Services}
          />
          <Route
            path={process.env.PUBLIC_URL + "/trips/:id"}
            component={Trips}
          />
          <Route
            path={process.env.PUBLIC_URL + "/users/:userName"}
            component={Users}
          />
        </Switch>
      </HashRouter>
    </Provider>
  );
};

export default App;
