"use strict";
const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const movies = require("./Movie-Data/data.json");
///
const pg = require("pg");
const { Client } = require("pg");
const dataBase = process.env.CONNECTION_STRING;
const client = new Client(dataBase);
client.connect();
//

let trendingMovies = [];
const handlers = {};

handlers.homeMoviesHandler = (req, res) => {
  res.send(movies);
};

handlers.getMoviesHandler = (req, res) => {
  const query = "select * from movies;";
  client.query(query, (error, results) => {
    if (error) {
      console.log(error);
    } else res.status(200).json(results.rows);
  });
};
handlers.trendingMoviesHandler = (req, res) => {
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

handlers.searchMoviesHandler = (req, res) => {
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

handlers.favouriteMovieHandler = (req, res) => {
  res.send({ msg: "Welcome to Favorite Page" });
};

handlers.getMovieHandler = (req, res) => {
  const id = req.params.id;
  const query = `SELECT * FROM movies WHERE id=${id};`;
  client
    .query(query)
    .then((data) => {
      res.status(200).json(data.rows);
    })
    .catch((e) => {
      res.status(500).json(e);
    });
};

handlers.addMovieHandler = (req, res) => {
  const keys = Object.keys(req.body).join(",");
  const values = Object.values(req.body);
  const dollars = keys.split(",").map((item, index) => "$" + (index + 1));
  const query = `INSERT INTO movies (${keys})
    VALUES (${dollars}) RETURNING *;`;
  // console.log(dollars);
  // console.log(keys, values);
  // console.log(query);
  client
    .query(query, values)
    .then((data) => {
      //console.log(data);
      res.status(200).json(data.rows || "Movie Is Added");
    })
    .catch((e) => {
      console.log("in catch");
      res.status(500).json(e);
    });
};

handlers.deleteMovieHandler = (req, res) => {
  const id = req.params.id;

  const query = `DELETE FROM movies WHERE id=${id};`;
  console.log(query);
  client
    .query(query)
    .then(() => {
      res.status(200).json("Movie Is Deleted");
    })
    .catch((e) => {
      res.status(500).send("database error");
    });
};

handlers.updateMovieHandler = (req, res) => {
  const id = req.params.id;
  const keys = Object.keys(req.body);
  const values = Object.values(req.body);
  let setStr = "";

  keys.forEach(
    (item, idx, arr) =>
      (setStr += `${item}=$${idx + 1}${idx < arr.length - 1 ? "," : ""}`)
  );

  const query = `UPDATE movies SET ${setStr} WHERE id=${id};`;
  console.log(query, setStr);
  client
    .query(query, values)
    .then((data) => {
      res.status(200).json(data.rows || "Movie Is Updated");
    })
    .catch((e) => {
      res.status(500).send("database error");
    });
};

module.exports = handlers;
