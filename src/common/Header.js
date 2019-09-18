import React, { Component } from "react";
import FastFoodIcon from "@material-ui/icons/Fastfood";
import "./Header.css";
import {
  Input,
  InputAdornment,
  Button,
  Menu,
  MenuItem
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { Link } from "react-router-dom";

const styles = theme => ({
  onSelectUnderline: {
    "&:after": {
      borderBottomColor: "white"
    }
  }
});

class Header extends Component {
  constructor() {
    super();
    this.state = {
      modalIsOpen: false,
      value: 0,
      loginContactNoRequired: "display-none",
      loginContactNoRequiredMsg: "Required",
      loginContactNo: "",
      loginPasswordRequired: "display-none",
      loginPasswordRequiredMsg: "Required",
      loginPassword: "",
      firstNameRequried: "display-none",
      firstName: "",
      lastName: "",
      emailRequired: "display-none",
      emailRequiredMsg: "Requried",
      email: "",
      signupPasswordRequired: "display-none",
      signupPasswordRequiredMsg: "required",
      signupPassword: "",
      signupContactNoRequired: "display-none",
      signupContactNoRequiredMsg: "required",
      signupContactNo: "",
      signupSuccess: false,
      loggedIn: sessionStorage.getItem("access-token") == null ? false : true,
      openLoginSuccessMsg: false,
      openSignupSuccessMsg: false,
      anchorEl: null
    };
  }

  openLoginModalHandler = e => {
    this.setState({
      modalIsOpen: true,
      value: 0,
      loginContactNoRequired: "display-none",
      loginContactNoRequiredMsg: "Required",
      loginContactNo: "",
      loginPasswordRequired: "display-none",
      loginPasswordRequiredMsg: "Required",
      loginPassword: "",
      firstNameRequried: "display-none",
      firstName: "",
      lastName: "",
      emailRequired: "display-none",
      emailRequiredMsg: "Requried",
      email: "",
      signupPasswordRequired: "display-none",
      signupPasswordRequiredMsg: "required",
      signupPassword: "",
      signupContactNoRequired: "display-none",
      signupContactNoRequiredMsg: "required",
      signupContactNo: ""
    });
  };

  render() {
    const { classes } = this.props;
    const { anchorEl } = this.state;

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
                  onChange={this.props.searchHandler}
                ></Input>
              </div>
            ) : (
              ""
            )}
            {!this.state.loggedIn ? (
              <div className={this.props.showSearchBar ? "login-1" : "login-2"}>
                <Button
                  size="medium"
                  variant="contained"
                  color="default"
                  onClick={this.openLoginModalHandler}
                >
                  <AccountCircleIcon id="login-btn-icon" />
                  LOGIN
                </Button>
              </div>
            ) : (
              <div className={this.props.showSearchBar ? "login-2" : "login-1"}>
                <Button
                  id="login-btn"
                  size="medium"
                  aria-owns={anchorEl ? "simple-menu" : undefined}
                >
                  <AccountCircleIcon id="user-btn-icon"></AccountCircleIcon>
                  {sessionStorage.getItem("username")}
                </Button>
                <Menu
                  id="user-menu"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={this.userMenuOnCloseHandler}
                >
                  <MenuItem>
                    <Link to="/profile" style={{ decoration: "none" }}>
                      My Profile
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={this.logoutOnClickHandler}>
                    Logout
                  </MenuItem>
                </Menu>
              </div>
            )}
          </div>
        </header>
      </div>
    );
  }
}

export default withStyles(styles)(Header);
