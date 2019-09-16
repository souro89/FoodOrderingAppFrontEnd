import React, { Component } from "react";
import FastFoodIcon from "@material-ui/icons/Fastfood";
import "./Header.css";
import { Input, InputAdornment } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";

const styles = theme => ({
  onSelectUnderline: {
    "&:after": {
      borderBottomColor: "white"
    }
  }
});

class Header extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div>
        <header className="app-header">
          <div>
            <FastFoodIcon
              id="fastfood-icon"
              className="app-logo"
              fontSize="large"
            ></FastFoodIcon>

            {this.props.showSearchBar ? (
              <div className="input-box">
                <Input
                  id="search-box"
                  classes={{
                    underline: classes.onSelectUnderline
                  }}
                  type="text"
                  placeholder="Search by Restaurant Name"
                  startAdornment={
                    <InputAdornment position="start">
                      <SearchIcon id="search-box-icon"></SearchIcon>
                    </InputAdornment>
                  }
                ></Input>
              </div>
            ) : (
              ""
            )}
          </div>
        </header>
      </div>
    );
  }
}

export default withStyles(styles)(Header);
