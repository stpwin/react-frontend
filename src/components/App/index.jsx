import React from "react";
import "./style.css";

import { Router, Switch, Route } from "react-router-dom";
import { history } from "../../helpers";
// import config from "../../config";

import Navigation from "../Navigation";
import NotFound from "../Pages/NotFound";
import { PrivateRoute } from "../PrivateRoute";

import Customers from "../Pages/Customers";

import { LoginPage } from "../Pages/Login";
import { Home } from "../Pages/Home";
import Users from "../Pages/Users";

function App() {
  return (
    <Router history={history}>
      <Navigation />
      <Switch>
        <PrivateRoute exact path='/' component={Home} />

        <Route path='/login' component={LoginPage}></Route>
        <PrivateRoute exact path='/users' component={Users} />

        <PrivateRoute
          path='/customers/:method?/:peaId?'
          component={Customers}
        />
        <Route path='*'>
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
