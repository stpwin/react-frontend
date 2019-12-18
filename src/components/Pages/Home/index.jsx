import React, { Component } from "react";
import "./home.css";

import SmartSearch from "../../SmartSearch";

export class Home extends Component {
  render() {
    return (
      <div className="home">
        <SmartSearch />
      </div>
    );
  }
}

export default Home;
