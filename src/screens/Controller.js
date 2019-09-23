import React, { Component } from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import Home from "./Home/Home";
import Profile from "./Profile/profile";
import Details from "./Details/details";

class Controller extends Component {
  constructor() {
    super();
    this.baseURL = "http://localhost:8080/api/";
  }

  render() {
    return (
      <Router>
        <div className="outer-container">
          <Route
            exact
            path="/"
            render={props => (
              <Home {...props} baseURL={this.baseURL}>
                {" "}
                }/
              </Home>
            )}
          ></Route>

          <Route
            exact
            path="/retaurant/:id"
            render={props => (
              <Details {...props} baseURL={this.baseURL}>
                {" "}
                }/
              </Details>
            )}
          ></Route>

          <Route
            exact
            path="/profile"
            render={props => (
              <Profile {...props} baseURL={this.baseURL}>
                {" "}
                }/
              </Profile>
            )}
          ></Route>
        </div>
      </Router>
    );
  }
}

export default Controller;
