import React, { Component } from "react";
import FastFoodIcon from "@material-ui/icons/Fastfood";
import "./Header.css";

class Header extends Component {
  render() {
    return (
      <div>
        <header className="app-header">
          <div>
            <FastFoodIcon
              id="fastfood-icon"
              className="app-logo"
              fontSize="large"
            ></FastFoodIcon>
          </div>
        </header>
      </div>
    );
  }
}

export default Header;
