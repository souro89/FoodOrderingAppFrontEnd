import React, { Component } from "react";
import "./details.css";
import Header from "../../common/Header";
import {
  Grid,
  Divider,
  IconButton,
  Card,
  CardContent,
  Typography,
  Badge,
  Button,
  Snackbar
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import ShoppingCart from "@material-ui/icons/ShoppingCart";

class Details extends Component {
  constructor() {
    super();
    this.state = {
      open: false,
      totalAmount: 0.0,
      noOfItemsCart: 0,
      snackBarText: "",
      cartItems: [],
      restaurantDetails: {
        address: "",
        average_price: "",
        categories: "",
        customer_rating: "",
        id: "",
        number_customers_rated: "",
        photo_URL: "",
        restaurant_name: ""
      }
    };
  }

  componentWillMount() {
    sessionStorage.removeItem("customer-cart");

    let that = this;
    let data = null;
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function() {
      if (this.readyState === 4) {
        that.setState({
          restaurantDetails: JSON.parse(this.responseText)
        });
      }
    });
    xhr.open(
      "GET",
      `${this.props.baseURL}/restaurant/${this.props.match.params.id}`
    );
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.send(data);
  }

  getCategory = () => {
    let categories = this.state.restaurantDetails.categories;

    if (categories.length <= 0) {
      return;
    }
    return categories.map((item, index) => {
      return (
        <span key={index}>
          {item.category_name}
          {categories.length === index + 1 ? " " : ", "}
        </span>
      );
    });
  };

  getItemList = () => {
    let categories = this.state.restaurantDetails.categories;

    if (categories.length <= 0) {
      return;
    }

    return categories.map((item, index) => {
      return (
        <div className="mt-15" key={"item" + item.id}>
          <div>{item.category_name}</div>
          <Divider className="m-10"></Divider>
          {this.getEachMenuItem(item.item_list, item.category_name)}
        </div>
      );
    });
  };

  getEachMenuItem = (item_list, category_name) => {
    return item_list.map((item, index) => {
      item = { item, category_name: category_name };
      return (
        <div className="flex pd-1-per" key={index}>
          <div className="flex-5">
            <i
              className={
                item.item.item_type === "NON_VEG"
                  ? "fa fa-circle red"
                  : "fa fa-circle green"
              }
            ></i>
          </div>
          <div className="flex-75">{item.item.item_name}</div>
          <div className="flex-10">
            <i className="fa fa-inr"></i> {item.item.price}.00
          </div>
          <div className="flex-10 plus-btn">
            <IconButton
              aria-label="Add"
              style={{ padding: "1px" }}
              onClick={this.addCheckoutList(item.item, "+")}
            >
              <AddIcon />
            </IconButton>
          </div>
        </div>
      );
    });
  };

  addCheckoutList = (i, m) => event => {
    let currentSelection, newcartItems;
    let alreadyPresent = this.state.cartItems.filter(
      c => i.item_name === c.item_name && i.category_name === c.category_name
    );
    if (alreadyPresent.length > 0) {
      currentSelection = this.state.cartItems.map(item => {
        if (
          item.id === alreadyPresent[0].id &&
          item.category_name === alreadyPresent[0].category_name
        ) {
          let count = item.count + 1;
          item.count = count;
          item.totalItemPrice = item.price * count;
        }
        return item;
      });
      newcartItems = [...currentSelection];
    } else {
      let count = alreadyPresent.length + 1;
      let currentSelection = {
        ...i,
        count: count,
        totalItemPrice: i.price * count
      };
      newcartItems = [...this.state.cartItems, currentSelection];
    }

    const noOfItemsCart = this.state.noOfItemsCart + 1;
    const totalAmount = this.state.totalAmount + i.price;
    this.setState({
      cartItems: newcartItems,
      open: true,
      snackBarText: m,
      noOfItemsCart: noOfItemsCart,
      totalAmount: totalAmount
    });
  };

  getCartCheckoutList = cartItems => {
    return cartItems.map((item, index) => {
      return (
        <div className="flex width-100 pd-1-per" key={index}>
          <div className="width-5">
            <i
              className={
                item.item_type === "NON_VEG"
                  ? "fa fa-stop-circle-o red"
                  : "fa fa-stop-circle-o green"
              }
            ></i>
          </div>
          <div className="width-40 capital checkout-grey-color">
            {item.item_name}
          </div>
          <div className="width-40">
            <IconButton
              aria-label="AddIcon"
              className="btn-hover"
              style={{ padding: "1px" }}
              onClick={this.removeMenuClick(item)}
            >
              <div className="minus-icon"> - </div>
            </IconButton>
            {item.count}
            <IconButton
              aria-label="Add"
              className="btn-hover"
              style={{ padding: "1px" }}
              onClick={this.addCheckoutList(item, "+")}
            >
              <AddIcon className="black-color" />
            </IconButton>
          </div>
          <div className="width-2-5 checkout-grey-color">
            <i className="fa fa-inr"></i>
          </div>
          <div className="checkout-grey-color"> {item.totalItemPrice}.00</div>
        </div>
      );
    });
  };

  removeMenuClick = item => event => {
    const itemLength = this.state.noOfItemsCart - 1;
    if (item.count === 1) {
      let newArr = [...this.state.cartItems];
      newArr.forEach((data, index) => {
        if (item.id === data.id && item.category_name === data.category_name) {
          newArr.splice(index, 1);
        }
      });
      const totalPrice = this.state.totalAmount - item.price;
      this.setState({
        cartItems: newArr,
        totalAmount: totalPrice,
        open: true,
        snackBarText: "--",
        noOfItemsCart: itemLength
      });
    } else {
      let newArr = [...this.state.cartItems];
      newArr.forEach((data, index) => {
        if (item.id === data.id && item.category_name === data.category_name) {
          newArr[index].count = data.count - 1;
          newArr[index].totalItemPrice = data.totalItemPrice - data.price;
        }
      });
      const totalPrice = this.state.totalAmount - item.price;
      this.setState({
        cartItems: newArr,
        totalAmount: totalPrice,
        open: true,
        snackBarText: "-",
        noOfItemsCart: itemLength
      });
    }
  };

  handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ open: false, snackBarText: "" });
  };

  checkoutCartHandler = e => {
    if (this.state.cartItems && this.state.cartItems.length === 0) {
      this.setState({ open: true, snackBarText: "CHECKOUT" });
      return;
    }

    if (sessionStorage.getItem("access-token") === null) {
      this.setState({ open: true, snackBarText: "LOGIN" });
      return;
    }

    let customerCart = {
      restaurantDetails: this.state.restaurantDetails,
      cartItems: this.state.cartItems,
      totalPrice: this.state.totalAmount
    };

    sessionStorage.setItem("customer-cart", JSON.stringify(customerCart));

    this.props.history.push("/checkout");
  };

  render() {
    return (
      <div>
        <Header></Header>
        <div>
          <Grid
            container
            spacing={24}
            className="backGroundGrey mobile-text-center"
          >
            <Grid item xs={12} sm={3} className="text-center">
              <img
                src={this.state.restaurantDetails.photo_URL}
                width="300"
                alt={this.state.photo_URL}
                height="250"
                className="m-t-20"
              ></img>
            </Grid>
            <Grid item xs={12} sm={9}>
              <Grid container spacing={24}>
                <Grid item sm={12} xs={12} className="serif">
                  <h1>{this.state.restaurantDetails.restaurant_name}</h1>
                  <h3>{this.state.restaurantDetails.address.locality}</h3>
                  <h3>{this.getCategory()}</h3>
                </Grid>
                <Grid item xs={6} sm={6}>
                  <div className="divcustomerRating">
                    <i className="fa fa-star"></i>{" "}
                    {this.state.restaurantDetails.customer_rating}
                    <p className="text-style">
                      AVERAGE RATING BY <br />{" "}
                      <span style={{ fontWeight: "bold" }}>
                        {this.state.restaurantDetails.number_customers_rated}
                      </span>{" "}
                      CUSTOMERS
                    </p>
                  </div>
                </Grid>
                <Grid item xs={6} sm={6}>
                  <div className="divcustomerRating">
                    <i className="fa fa-inr"></i>{" "}
                    {this.state.restaurantDetails.average_price}
                    <p className="text-style">
                      AVERAGE COST FOR <br /> TWO PEOPLE
                    </p>
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container spacing={24} className="items">
            <Grid item xs={12} sm={7}>
              {this.getItemList()}
            </Grid>
            <Grid item xs={12} sm={5}>
              <Card>
                <CardContent>
                  <Typography variant="h5" color="default" gutterBottom>
                    <Badge
                      badgeContent={this.state.noOfItemsCart}
                      color="primary"
                    >
                      <ShoppingCart />
                    </Badge>
                    <span className="my-cart">My Cart</span>
                  </Typography>

                  {this.getCartCheckoutList(this.state.cartItems)}
                  <div className="bold pd-1-per">
                    TOTAL AMOUNT{" "}
                    <span className="right mr-8">
                      <i className="fa fa-inr"></i> {this.state.totalAmount}.00
                    </span>
                  </div>
                  <Button
                    className="mt-24-px"
                    variant="contained"
                    fullWidth
                    size="medium"
                    color="primary"
                    onClick={this.checkoutCartHandler}
                  >
                    CHECKOUT
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left"
            }}
            open={this.state.open}
            autoHideDuration={4000}
            onClose={this.handleClose}
            ContentProps={{
              "aria-describedby": "message-id"
            }}
            message={
              <span id="message-id">
                {this.state.snackBarText === "CHECKOUT"
                  ? "Please add an item to your cart!"
                  : this.state.snackBarText === "LOGIN"
                  ? "Please login first!"
                  : this.state.snackBarText === "ADD"
                  ? "Item added to cart!"
                  : this.state.snackBarText === "+"
                  ? "Item quantity increased by 1!"
                  : this.state.snackBarText === "--"
                  ? "Item removed from cart!"
                  : this.state.snackBarText === "-"
                  ? "Item quantity decreased by 1!"
                  : ""}
              </span>
            }
            action={[
              <IconButton
                key="close"
                aria-label="Close"
                color="inherit"
                onClick={this.handleClose}
              >
                <CloseIcon />
              </IconButton>
            ]}
          ></Snackbar>
        </div>
      </div>
    );
  }
}

export default Details;
