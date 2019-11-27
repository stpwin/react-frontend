import React from "react";
import "./style.css";

import { Router, Switch, Route } from "react-router-dom";
import Customers from "../Pages/Customers";
import { history } from "../../helpers";
import { PrivateRoute } from "../PrivateRoute";
import { LoginPage } from "../Pages/Login";
import { Home } from "../Pages/Home"
import config from "../../config";

function App() {
  console.log(config.apiUrl);
  return (
    <Router history={history}>
      {/* <CreateCustomer></CreateCustomer> */}
      {/* <PrivateRoute exact path='/verify/:peaid' component={Customers} /> */}
      <PrivateRoute exact path='/customer' component={Customers} />
      <PrivateRoute exact path='/' component={Home} />

      <Route path='/login' component={LoginPage}></Route>
      <Switch></Switch>
    </Router>
  );
}

export default App;
