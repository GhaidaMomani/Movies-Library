"use strict";
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const server = express();
let trendingMovies = [];
require("dotenv").config();
server.use(cors());
server.use(express.json());
const PORT = process.env.PORT || 3001;
const movies = require("./Movie-Data/data.json");

const { response } = require("express");

//https://api.themoviedb.org/3/search/movie?api_key=668baa4bb128a32b82fe0c15b21dd699&language=en-US&query=The&page=2

const trendingMoviesHandler = (req, res) => {
  axios
    .get(
      `${process.env.MOVIEDB_API_URL_TRENDING}?api_key=${process.env.API_KEY}&language=en-US`
    )
    //axios.get(`https://api.themoviedb.org/3/trending/all/week?api_key=37ddc7081e348bf246a42f3be2b3dfd0&language=en-US`)

    .then((result) => {
      return result.data;
    })
    .then((movies) => {
      const resList = movies.results.map((movie) => {
        return {
          id: movie.id,
          title: movie.title,
          release_date: movie.release_date,
          poster_path: movie.poster_path,
          overview: movie.overview,
        };
      });
      res.send(resList);
    })
    .catch((error) => {
      console.log("error");
    });
};

//https://api.themoviedb.org/3/search/movie?api_key=668baa4bb128a32b82fe0c15b21dd699&language=en-US&query=The&page=2
const searchMoviesHandler = (req, res) => {
  axios
    .get(
      `${process.env.SEARCHING_API}?api_key=${process.env.SEARCH_API_KEY}&language=en-US&query=The&page=2`
    )
    .then((result) => {
      return result.data;
    })
    .then((movies) => {
      const searchList = movies.results.map((movie) => {
        return {
          id: movie.id,
          title: movie.title,
          release_date: movie.release_date,
          poster_path: movie.poster_path,
          overview: movie.overview,
        };
      });
      res.send(searchList);
    })
    .catch((error) => {
      console.log("error");
    });
};

server.get("/", (req, res) => {
  res.send(movies);
});

server.get("/favorite", (req, res) => {
  res.send({ msg: "Welcome to Favorite Page" });
});

server.get("/trending", trendingMoviesHandler);

server.get("/search", searchMoviesHandler);

server.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});

server.get("*", function (req, res, next) {
  var err = new Error();
  err.status = 404;
  next();
});

//Handle 404
server.use(function (err, req, res, next) {
  res.sendStatus(404);
  if (req.accepts("json")) {
    res.json({
      status: 404,
      responseText: "Sorry, Page not found",
    });
  }
  return;
});

//Handle 500
server.use(function (err, req, res, next) {
  res.sendStatus(500);
  if (req.accepts("json")) {
    res.json({
      status: 500,
      responseText: "Sorry, something went wrong",
    });
  }
});

//send the user to 500 page without shutting down the server
process.on("uncaughtException", function (err) {
  console.log("-------------------------- Caught exception: " + err);
  app.use(function (err, req, res, next) {
    res.render("500");
  });
});

function Movie(title, poster_path, overview) {
  this.title = title;
  this.poster_path = poster_path;
  this.overview = overview;
}
