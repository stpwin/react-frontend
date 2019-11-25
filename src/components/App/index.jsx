import React from "react";
import "./style.css";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import CreateCustomer from "../CreateCustomer";

function App() {
  return (
    <Router>
      <CreateCustomer></CreateCustomer>

      <Switch></Switch>
    </Router>
  );
}

export default App;
