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

  render() {
    return (
      <div>
        <Header></Header>
        <div>
          <Grid
            container
            spacing={22}
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
          </Grid>
        </div>
      </div>
    );
  }
}

export default Details;
