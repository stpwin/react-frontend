import React from "react";
import "./style.css";
import { connect } from "react-redux";
import { Router, Switch, Route } from "react-router-dom";

import Navigation from "../Navigation";
import Footer from "../Footer";
import NotFound from "../Pages/NotFound";
import { PrivateRoute } from "../PrivateRoute";

import Customers from "../Pages/Customers";

import Login from "../Pages/Login";
import Home from "../Pages/Home";
import Users from "../Pages/Users";
import Settings from "../Pages/Settings";
import { history } from "../../store";

const App = props => {
  const { user, loggedIn } = props;
  return (
    <Router history={history}>
      <Navigation user={user} loggedIn={loggedIn} />
      <Switch>
        <Route path="/login" component={Login}></Route>
        <PrivateRoute exact path="/" component={Home} />
        <PrivateRoute path="/users/:method?/:uid?" component={Users} />
        <PrivateRoute path="/settings/:method" component={Settings} />
        <PrivateRoute
          path="/customers/:method?/:peaId?"
          component={Customers}
        />
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
      <Footer />
    </Router>
  );
};

function mapStateToProps(state) {
  const {
    authentication: { user, loggedIn }
  } = state;
  return {
    user,
    loggedIn
  };
}

export default connect(mapStateToProps)(App);
