import React from "react";
import { Switch } from "react-router";
import { Route, HashRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import withSegmentTracker from "./middlewares/with_segment_tracker";
import Home from "./../scenes/home/home";
import Account from "./../scenes/account/account";
import Sessions from "./../scenes/sessions/sessions";
import Results from "./../scenes/results/results";
import Trips from "./../scenes/trips/trips";
import Users from "./../scenes/users/users";
import Services from "./../scenes/services/services";
import Registrations from "./../scenes/registrations/registrations";
import Notfound from "./../styled_scenes/NotFound";
import ScrollToTop from "./middlewares/ScrollToTop";
import NewService from '../scenes/new-service';

const App = () => {
  return (
    <Provider store={store}>
      <HashRouter>
        <ScrollToTop>
          <Switch>
            <Route
              exact
              path={process.env.PUBLIC_URL + "/"}
              component={withSegmentTracker(Home)}
            />
            <Route
              path={process.env.PUBLIC_URL + "/login"}
              component={withSegmentTracker(Sessions)}
            />
            <Route
              path={process.env.PUBLIC_URL + "/register"}
              component={withSegmentTracker(Registrations)}
            />
            <Route
              path={process.env.PUBLIC_URL + "/results"}
              component={withSegmentTracker(Results)}
            />
            <Route
              path={process.env.PUBLIC_URL + "/services/new"}
              component={withSegmentTracker(NewService)}
            />
            <Route
              path={process.env.PUBLIC_URL + "/services/:id"}
              component={withSegmentTracker(Services)}
            />
            <Route
              path={process.env.PUBLIC_URL + "/trips/:id"}
              component={withSegmentTracker(Trips)}
            />
            <Route
              path={process.env.PUBLIC_URL + "/users/:userName"}
              component={Users}
            />
            <Route
              path={process.env.PUBLIC_URL + "/account"}
              component={Account}
            />
            <Route component={Notfound} />
          </Switch>
        </ScrollToTop>
      </HashRouter>
    </Provider>
  );
};

export default App;
