import React, { Component } from "react";
import "./details.css";
import Header from "../../common/Header";
import { Grid } from "@material-ui/core";

class Details extends Component {
  constructor() {
    super();
    this.state = {
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
              </Grid>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

export default Details;
