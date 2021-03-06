import React, { Component } from "react";
import axios from "axios";
import "../stylesheets/appstyles.css";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Loader from "react-loader-spinner";

import dotenv from "dotenv";

dotenv.config();

class SearchComponent extends Component {
  state = {
    searchTerm: "",
    channelId: "",
    channelName: "",
    channelDescription: "",
    country: "",
    channelThumbnail: false,
    errorMessage: "",
    subscriberCount: "",
    viewCount: "",
    videoCount: "",
    displayCard: "none",
    isLoading: false,
  };

  handleOnChange = (event) => {
    this.setState({ searchTerm: event.target.value });
  };

  handleOnSubmit = (event) => {
    this.setState({ isLoading: true });
    this.setState({ displayCard: "none" });
    try {
      if (
        this.state.searchTerm === null ||
        this.state.searchTerm === undefined ||
        this.state.searchTerm === ""
      ) {
        throw new Error("Invalid search term");
      }
      // this.state({ isLoading: true });
      axios
        .get("/.netlify/functions/youtubeAPI_1", {
          params: {
            q: this.state.searchTerm,
          },
        })
        .then((response) => {
          this.setState({
            channelId: response.data.items[0].id.channelId,
            channelName: response.data.items[0].snippet.title,
            channelDescription: response.data.items[0].snippet.description,
            channelThumbnail:
              response.data.items[0].snippet.thumbnails.high.url,
            searchTerm: " ",
          });

          //Second request fetches statistics data from the API
          axios
            .get("/.netlify/functions/youtubeAPI_2", {
              params: {
                id: this.state.channelId,
              },
            })
            .then((response) => {
              this.setState({
                viewCount: response.data.items[0].statistics.viewCount,
                subscriberCount:
                  response.data.items[0].statistics.subscriberCount,
                videoCount: response.data.items[0].statistics.videoCount,
                displayCard: "block",
                isLoading: false,
              });
            })
            .catch(() => {
              this.setState({
                errorMessage: "Channel Not found!",
                isLoading: false,
              });
              setInterval(() => {
                this.setState({ errorMessage: " " });
              }, 3000);
            });
        })
        .catch(() => {
          this.setState({
            errorMessage: "Channel Not found!",
            isLoading: false,
          });
          setInterval(() => {
            this.setState({ errorMessage: " " });
          }, 3000);
        });
    } catch (error) {
      this.setState({ errorMessage: "Channel Not found!", isLoading: false });
      setInterval(() => {
        this.setState({ errorMessage: " " });
      }, 3000);
    }

    event.preventDefault();
  };

  render() {
    let isLoadingornot = this.state.isLoading;
    let cardContent;

    if (isLoadingornot) {
      cardContent = (
        <Loader
          style={{ marginTop: "50px" }}
          type="ThreeDots"
          color="#00BFFF"
          height={100}
          width={100}
        />
      );
    } else {
      if (this.state.errorMessage) {
        cardContent = (
          <Typography
            style={{ marginTop: "100px" }}
            variant="h4"
            color="initial"
          >
            {this.state.errorMessage}
          </Typography>
        );
      } else {
        cardContent = (
          <Card
            style={{
              marginTop: "30px",
              minwidth: "450px",
              maxWidth: "500px",
              textAlign: "left",
              backgroundColor: "#d0e8f2",
              display: this.state.displayCard,
              minHeight: "70vh",
            }}
          >
            <CardActionArea>
              {this.state.channelThumbnail ? (
                <CardMedia
                  style={{ height: 350 }}
                  image={this.state.channelThumbnail}
                  title="Youtube Channel Thumbnail"
                />
              ) : (
                <CircularProgress />
              )}

              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {this.state.channelName}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  {this.state.channelDescription}
                </Typography>
              </CardContent>
            </CardActionArea>

            <Box
              className="statistics-data-header"
              borderRadius={5}
              component="span"
              display="block"
              p={1}
              m={1}
              bgcolor="#79a3b1"
            >
              Total Subscribers :-
              <div className="statistics-data">
                {this.state.subscriberCount}
              </div>
            </Box>
            <Box
              className="statistics-data-header"
              borderRadius={5}
              component="span"
              display="block"
              p={1}
              m={1}
              bgcolor="#79a3b1"
            >
              Total Videos uploaded :-
              <div className="statistics-data">
                {this.state.videoCount || 23}
              </div>
            </Box>
            <Box
              className="statistics-data-header"
              borderRadius={5}
              component="span"
              display="block"
              p={1}
              m={1}
              bgcolor="#79a3b1"
            >
              Total Views :-
              <div className="statistics-data"> {this.state.viewCount}</div>
            </Box>
          </Card>
        );
      }
    }

    return (
      <div className="mainContainer">
        <Typography className="app-header" variant="h4" gutterBottom>
          <a href="/index.html">
            <svg
              style={{
                height: "50px",
                width: "50px",
                fill: "red",
                position: "relative",
                top: "10px",
                left: "-5px",
              }}
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <title>YouTube icon</title>
              <path d="M23.499 6.203a3.008 3.008 0 00-2.089-2.089c-1.87-.501-9.4-.501-9.4-.501s-7.509-.01-9.399.501a3.008 3.008 0 00-2.088 2.09A31.258 31.26 0 000 12.01a31.258 31.26 0 00.523 5.785 3.008 3.008 0 002.088 2.089c1.869.502 9.4.502 9.4.502s7.508 0 9.399-.502a3.008 3.008 0 002.089-2.09 31.258 31.26 0 00.5-5.784 31.258 31.26 0 00-.5-5.808zm-13.891 9.4V8.407l6.266 3.604z" />
            </svg>
          </a>
          YouTube Channel Info
        </Typography>
        <Typography color="initial">
          Search about you favorite Youtube channels
        </Typography>

        <form className="form-control" onSubmit={this.handleOnSubmit} action="">
          <TextField
            onChange={this.handleOnChange}
            autoFocus={true}
            id="standard-basic"
            placeholder="Search any YouTube channel here.."
            label="Search"
            className="text-input-field"
            value={this.state.searchTerm}
          />

          <Box mt={3} ml={15}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className="search-btn"
              onClick={this.handleOnSubmit}
            >
              Search..
            </Button>
          </Box>
        </form>
        {/* 
        <Typography variant="h3" color="initial">
          {this.state.errorMessage}
        </Typography> */}

        {cardContent}
      </div>
    );
  }
}

export default SearchComponent;
