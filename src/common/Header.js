import React, { Component } from "react";
import FastFoodIcon from "@material-ui/icons/Fastfood";
import "./Header.css";
import {
  Input,
  InputAdornment,
  Button,
  Menu,
  MenuItem,
  Tab,
  Tabs,
  FormControl,
  InputLabel,
  FormHelperText,
  Typography
} from "@material-ui/core";
import Modal from "react-modal";
import { withStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const loginModalStyle = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%,-50%)"
  }
};

const TabContainer = function(props) {
  return (
    <Typography component="div" style={{ padding: 0, textAlign: "center" }}>
      {props.children}
    </Typography>
  );
};

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
};

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

  userMenuOnCloseHandler = e => {
    this.setState({ anchorEl: null });
  };

  myProfileClickHandler = e => {
    this.setState({ anchorEl: null });
  };

  logoutOnClickHandler = () => {
    let data = null;
    let xhr = new XMLHttpRequest();
    let that = this;

    xhr.addEventListener("readystatechange", function() {
      if (this.readyState === 4) {
        let responseText = JSON.parse(this.responseText);

        console.log(responseText);

        that.setState({
          loggedIn: false
        });
      }
    });

    xhr.open("POST", "http://localhost:8080/api/customer/logout");
    xhr.setRequestHeader(
      "authorization",
      "Bearer " + sessionStorage.getItem("access-token")
    );
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(data);

    sessionStorage.removeItem("access-token");
    sessionStorage.removeItem("user-uuid");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("customer-cart");
    this.setState({
      anchorEl: null,
      loggedIn: false
    });
  };

  closeLoginModalHanlder = () => {
    this.setState({ modalIsOpen: false });
  };

  loginModalChange = (e, v) => {
    this.setState({ value: v });
  };

  inputLoginContactNoChangeHandler = e => {
    this.setState({ loginContactNo: e.target.value });
  };

  inputLoginPasswordChangeHandler = e => {
    this.setState({ loginPassword: e.target.value });
  };

  loginClickHandler = e => {
    console.log(this.state.loginContactNo === "");
    let contactNo = false;
    let password = false;

    if (this.state.loginContactNo === "") {
      this.setState({
        loginContactNoRequired: "display-block",
        loginContactNoRequiredMsg: "Required"
      });
      contactNo = true;
    } else {
      this.setState({
        loginContactNoRequired: "display-none"
      });
    }

    if (this.state.loginPassword === "") {
      this.setState({
        loginPasswordRequired: "display-block",
        loginPasswordRequiredMsg: "Required"
      });
      password = true;
    } else {
      this.setState({
        loginPasswordRequiredMsg: "display-none"
      });
    }

    let regContactNo = new RegExp("[0-9]+");

    if (
      contactNo === false &&
      (regContactNo.test(this.state.loginContactNo) === false ||
        this.state.loginContactNo.length !== 10)
    ) {
      this.setState({
        loginContactNoRequired: "display-block",
        loginContactNoRequiredMsg: "Invalid Contact Number"
      });

      return;
    }

    if (contactNo || password) {
      return;
    }

    let data = null;
    let xhr = new XMLHttpRequest();
    let that = this;

    xhr.addEventListener("readystatechange", function() {
      if (this.readyState === 4) {
        let responseText = JSON.parse(this.responseText);

        if (
          responseText.code === "ATH-001" ||
          responseText.code === "ATH-002"
        ) {
          that.setState({
            loginPasswordRequired: "display-block",
            loginPasswordRequiredMsg: responseText.message
          });
          return;
        }
        console.log(xhr.getResponseHeader("access-token"));
        console.log(xhr.getAllResponseHeaders());
        sessionStorage.setItem(
          "access-token",
          xhr.getResponseHeader("access-token")
        );
        sessionStorage.setItem("user-uuid", responseText.id);
        sessionStorage.setItem("first-name", responseText.first_name);

        that.setState({
          loggedIn: true,
          openLoginSuccessMsg: true
        });

        that.closeLoginModalHanlder();
      }
    });

    xhr.open("POST", "http://localhost:8080/api/customer/login");
    xhr.setRequestHeader(
      "authorization",
      "Basic " +
        window.btoa(this.state.loginContactNo + ":" + this.state.loginPassword)
    );
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(data);
  };

  userMenuOnClickHandler = event => {
    this.setState({ anchorEl: event.currentTarget });
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
              <div className={this.props.showSearchBar ? "login-1" : "login-2"}>
                <Button
                  id="login-btn"
                  size="medium"
                  aria-owns={anchorEl ? "simple-menu" : undefined}
                  aria-haspopup="true"
                  onClick={this.userMenuOnClickHandler}
                >
                  <AccountCircleIcon id="user-btn-icon"></AccountCircleIcon>
                  {sessionStorage.getItem("first-name")}
                </Button>
                <Menu
                  id="user-menu"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={this.userMenuOnCloseHandler}
                >
                  <MenuItem onClick={this.myProfileClickHandler}>
                    {/* <Link to="/profile" style={{ textDecoration: "none" }}>
                      My Profile
                    </Link> */}
                    My Profile
                  </MenuItem>
                  <MenuItem onClick={this.logoutOnClickHandler}>
                    Logout
                  </MenuItem>
                </Menu>
              </div>
            )}
          </div>
        </header>

        <Modal
          ariaHideApp={false}
          isOpen={this.state.modalIsOpen}
          contentLabel="Login"
          onRequestClose={this.closeLoginModalHanlder}
          style={loginModalStyle}
        >
          <Tabs
            className="login-signup"
            value={this.state.value}
            onChange={this.loginModalChange}
          >
            <Tab label="LOGIN"></Tab>
            <Tab label="SIGNUP"></Tab>
          </Tabs>

          {this.state.value === 0 && (
            <TabContainer>
              <FormControl required>
                <InputLabel htmlFor="loginContactNo">Contact No.</InputLabel>
                <Input
                  id="loginContactNo"
                  type="text"
                  logincontactno={this.state.loginContactNo}
                  value={this.state.loginContactNo}
                  onChange={this.inputLoginContactNoChangeHandler}
                ></Input>
                <FormHelperText
                  className={this.state.loginContactNoRequired}
                  error={true}
                >
                  <span>{this.state.loginContactNoRequiredMsg}</span>
                </FormHelperText>
              </FormControl>
              <br />
              <br />
              <FormControl required>
                <InputLabel htmlFor="loginPassword">Password</InputLabel>
                <Input
                  id="loginPassword"
                  type="password"
                  loginpassword={this.state.loginPassword}
                  value={this.state.loginPassword}
                  onChange={this.inputLoginPasswordChangeHandler}
                  autoComplete="off"
                ></Input>
                <FormHelperText
                  className={this.state.loginPasswordRequired}
                  error={true}
                >
                  <span>{this.state.loginPasswordRequiredMsg}</span>
                </FormHelperText>
              </FormControl>
              <br />
              <br />
              <Button
                id="modal-login-btn"
                variant="contained"
                color="primary"
                onClick={this.loginClickHandler}
              >
                LOGIN
              </Button>
            </TabContainer>
          )}
        </Modal>
      </div>
    );
  }
}

export default withStyles(styles)(Header);
