import React from "react";
import "./style.css";

import { Router, Switch, Route } from "react-router-dom";
import { history } from "../../helpers";
// import config from "../../config";

import Navigation from "../Navigation";
import NotFound from "../Pages/NotFound";
import { PrivateRoute } from "../PrivateRoute";

import Customers, {
  CreateCustomer,
  EditCustomer,
  VerifyCustomer
} from "../Pages/Customers";

import { LoginPage } from "../Pages/Login";
import { Home } from "../Pages/Home";
import Users from "../Pages/Users";

function App() {
  // console.log(config.apiUrl);
  return (
    <Router history={history}>
      <Navigation />
      <Switch>
        <PrivateRoute exact path="/" component={Home} />

        <Route path="/login" component={LoginPage}></Route>
        {/* <Route path="/logout" component={LoginPage}></Route> */}
        <PrivateRoute exact path="/customers" component={Customers} />
        <PrivateRoute exact path="/users" component={Users} />
        <PrivateRoute
          path="/create-customer/:peaId?"
          component={CreateCustomer}
          // children={<CreateCustomer />}
        />
        <PrivateRoute
          path="/verify-customer/:peaId"
          component={VerifyCustomer}
          // children={<VerifyCustomer />}
        />
        <PrivateRoute
          path="/edit-customer/:peaId"
          component={EditCustomer}
          // children={<EditCustomer />}
        />
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
