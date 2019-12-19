import React from "react";
import "./style.css";

import { Router, Switch, Route } from "react-router-dom";

import Navigation from "../Navigation";
import NotFound from "../Pages/NotFound";
import { PrivateRoute } from "../PrivateRoute";

import Customers from "../Pages/Customers";

import { LoginPage } from "../Pages/Login";
import { Home } from "../Pages/Home";
import Users from "../Pages/Users";
import { history } from "../../store"

function App() {
  return (
    <Router history={history}>

      <Navigation />
      <Switch>
        <Route path="/login" component={LoginPage}></Route>

        <PrivateRoute exact path="/" component={Home} />

        <PrivateRoute path="/users/:method?/:uid?" component={Users} />

        <PrivateRoute
          path="/customers/:method?/:peaId?"
          component={Customers}
        />
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>


    </Router>
  );
}



export default App;
