import React, { Component } from "react";
import "./Home.css";
import Header from "../../common/Header";
import { withStyles } from "@material-ui/core/styles";
import "../../assets/font-awesome-4.7.0/css/font-awesome.min.css";
import {
  Typography,
  GridList,
  GridListTile,
  CardMedia,
  CardContent,
  Card,
  Grid,
  CardActions,
  Button
} from "@material-ui/core";

const styles = theme => ({
  emptyRestaurantList: {
    marginTop: 15,
    marginLeft: 25
  },
  cardsGridList: {
    margin: "auto"
  },
  retaurantCard: {
    width: 250,
    maxWidth: 250,
    height: 340,
    maxHeight: 340,
    marginTop: 15,
    marginBottom: 10,
    marginLeft: 25,
    marginRight: 5,
    paddingBottom: 15,
    cursor: "pointer",
    position: "relative"
  },
  restaurantCardPicture: {
    height: 140
  },
  root: {
    flexGrow: 1
  },
  restaurantName: {
    marginBottom: 20
  },
  avgRateDiv: {
    position: "absolute",
    bottom: 20
  },
  ratingDiv: {
    backgroundColor: "#EACC5D",
    width: 100,
    textAlign: "center",
    float: "left"
  },
  ratingText: {
    color: "#FFF"
  },
  actions: {
    display: "flex"
  },
  restaurantAverageRatingText: {
    marginLeft: 30,
    float: "right"
  }
});

class Home extends Component {
  constructor() {
    super();
    this.state = {
      restaurants: [],
      cards: 2
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
          restaurants: JSON.parse(this.responseText).restaurants
        });
      }
    });

    xhr.open("GET", `${this.props.baseURL}restaurant`);
    xhr.send(data);

    this.updateCardsGridlistCols();
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateCardsGridlistCols);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateCardsGridlistCols);
  }

  restaurantOnClick = e => {
    this.props.history.push("/restaurant/" + e);
  };

  updateCardsGridlistCols = e => {
    console.log("updated" + window.innerWidth);
    if (window.innerWidth >= 1500) {
      this.setState({ cards: 5 });
      return;
    }

    if (window.innerWidth >= 1270) {
      console.log("updated" + window.innerWidth);
      this.setState({ cards: 4 });
      return;
    }

    if (window.innerWidth >= 1000) {
      this.setState({ cards: 3 });
      return;
    }

    this.setState({ cards: 2 });
  };

  searchHandler = e => {
    let that = this;
    let data = null;
    let xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function() {
      if (this.readyState === 4) {
        if (!JSON.parse(this.responseText).restaurants) {
          that.setState({
            restaurants: null
          });
        } else {
          that.setState({
            restaurants: JSON.parse(this.responseText).restaurants
          });
        }
      }
    });

    if (e.target.value === "") {
      xhr.open("GET", `${this.props.baseURL}restaurant`);
    } else {
      xhr.open("GET", `${this.props.baseURL}restaurant/name/${e.target.value}`);
    }
    xhr.send(data);
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Header
          showSearchBar="true"
          searchHandler={this.searchHandler}
        ></Header>

        {this.state.restaurants === null ? (
          <Typography className={classes.emptyRestaurantList} variant="h6">
            No restaurant with given name.
          </Typography>
        ) : (
          <Grid container className={classes.root}>
            <Grid item xs="auto" className={classes.cardsGridList}>
              <Grid container justify="center">
                {this.state.restaurants.map(r => (
                  <Grid
                    onClick={() => this.restaurantOnClick(r.id)}
                    key={"restaurant" + r.id}
                  >
                    <Card
                      className={classes.retaurantCard}
                      style={{ textDecoration: "none" }}
                    >
                      <CardMedia
                        className={classes.restaurantCardPicture}
                        image={r.photo_URL}
                        title={r.restaurant_name}
                      ></CardMedia>
                      <CardContent>
                        <Typography
                          className={classes.restaurantName}
                          gutterBottom
                          variant="h5"
                          component="h2"
                        >
                          {r.restaurant_name}
                        </Typography>
                        <Typography variant="subtitle1" component="p">
                          {r.categories}
                        </Typography>

                        <div className={classes.avgRateDiv}>
                          <div className={classes.ratingDiv}>
                            <Typography
                              className={classes.ratingText}
                              variant="body2"
                            >
                              <i className="fa fa-star"></i>
                              {r.customer_rating} ({r.number_customers_rated})
                            </Typography>
                          </div>

                          <Typography
                            className={classes.restaurantAverageRatingText}
                            variant="body2"
                          >
                            <i className="fa fa-inr"></i>
                            {r.average_price} for two
                          </Typography>
                        </div>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(Home);
