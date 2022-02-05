"use strict";
const express = require("express");
const cors = require("cors");
const axios = require("axios");
const server = express();
const pg = require("pg");
let trendingMovies = [];
require("dotenv").config();

server.use(cors());
server.use(express.json());
const PORT = process.env.PORT || 3001;

const handlers = require("./handlers.js");

const movies = require("./Movie-Data/data.json");
const { Client } = require("pg");
const dataBase = process.env.CONNECTION_STRING;

const client = new Client(dataBase);

const { response } = require("express");

//////handlers for the endpoints
server.get("/", handlers.homeMoviesHandler);

server.get("/favorite", handlers.favouriteMovieHandler);

server.get("/trending", handlers.trendingMoviesHandler);

server.get("/search", handlers.searchMoviesHandler);

server.get("/getMovies", handlers.getMoviesHandler);

server.post("/addMovie", handlers.addMovieHandler);

server.put("/updateMovie/:id", handlers.updateMovieHandler);

server.delete("/deleteMovie/:id", handlers.deleteMovieHandler);

server.get("/getMovie/:id", handlers.getMovieHandler);

// server.listen(PORT, () => {
//   console.log(`Listening on PORT ${PORT}`);
// });
///handeling errors
//Handle 404
server.get("*", function (req, res) {
  res.status(404).send("Sorry, Page not found");
});

//Handle 500
server.use(function (err, req, res) {
  res.status(500).send("Internal Server Error");
});

//send the user to 500 page without shutting down the server
process.on("uncaughtException", function (err) {
  console.log("-------------------------- Caught exception: " + err);
  server.use(function (err, req, res, next) {
    res.render("500");
  });
});

//// Functions
function Movie(title, poster_path, overview) {
  this.title = title;
  this.poster_path = poster_path;
  this.overview = overview;
}

function movieslib(id, title, release_date, poster_path, overview) {
  this.id = id;
  this.title = title;
  this.release_date = release_date;
  this.poster_path = poster_path;
  this.overview = overview;
}

client.connect().then(() =>
  server.listen(PORT, () => {
    console.log(`Listining to server on port ${PORT}.M`);
  })
);

//https://api.themoviedb.org/3/search/movie?api_key=668baa4bb128a32b82fe0c15b21dd699&language=en-US&query=The&page=2

//https://api.themoviedb.org/3/search/movie?api_key=668baa4bb128a32b82fe0c15b21dd699&language=en-US&query=The&page=2

// server.get("/getMovie/:id", (req, res) => {
//   client
//     .query(`SELECT * FROM movies WHERE id=${req.params.id} ;`, null)
//     .then((data) => {
//       res.status(200).json(data || "No movie was found");
//     })
//     .catch((e) => {
//       res
//         .status(e.response.status)
//         .send(`Database says: ${e.response.statusText}`);
//     });
// });
