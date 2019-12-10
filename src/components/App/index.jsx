import React from "react";
import "./style.css";

// import { connect } from "react-redux";

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

// import PrintPage from "../Customer/PrintPage";

function App() {
  return (
    <Router history={history}>
      <Navigation />
      <Switch>
        <Route path='/login' component={LoginPage}></Route>

        <PrivateRoute exact path='/' component={Home} />

        <PrivateRoute path='/users/:method?/:uid?' component={Users} />

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

// const mapStateToProps = state => {
//   console.log(state);
//   return {};
// };

// const mapDispatchToProps = dispatch => {
//   return {};
// };

export default App;
