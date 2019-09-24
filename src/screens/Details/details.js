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
  Button
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
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
    console.log(categories[0].category_name);
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
      console.log(item.item);
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
              onClick={() => this.addCheckoutList(item, "+")}
            >
              <AddIcon />
            </IconButton>
          </div>
        </div>
      );
    });
  };

  addCheckoutList = (i, m) => {
    let currentSelection, newcartItems;
    let alreadyPresent = this.state.cartItems.filter(
      c => i.item_name === c.item_name && i.category_name === c.category_name
    );
    if (alreadyPresent > 0) {
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

                  {}
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
                  >
                    CHECKOUT
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

export default Details;
