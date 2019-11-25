import React from "react";
import "./style.css";

import { Router, Switch, Route } from "react-router-dom";
import CreateCustomer from "../CreateCustomer";
import {history} from "../../helpers"
import {PrivateRoute} from "../PrivateRoute"
import { LoginPage } from "../Login";
import { Home } from "../Home"
import config from "../../config"

function App() {
  console.log(config.apiUrl)
  return (
    <Router history={history}>
      {/* <CreateCustomer></CreateCustomer> */}
      <PrivateRoute exact path="/" component={CreateCustomer}></PrivateRoute>
      <Route path="/login" component={LoginPage}></Route>
      <Switch></Switch>
    </Router>
  );
}

export default App;
