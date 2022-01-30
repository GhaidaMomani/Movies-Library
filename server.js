"use strict";
const express = require("express");
const cors = require("cors");
const server = express();
require("dotenv").config();
server.use(cors());
server.use(express.json());
const PORT = process.env.PORT || 3001;
const movies = require("./Movie-Data/data.json");
const { response } = require("express");

server.get("/", (req, res) => {
  res.send(movies);
});

server.get("/favorite", (req, res) => {
    res.send({msg :"Welcome to Favorite Page"});
  });

server.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}`);
});


server.get('*', function(req, res, next) {
    var err = new Error();
    err.status = 404;
    next();
});

//Handle 404
server.use(function(err, req, res, next){
    res.sendStatus(404);
    if (req.accepts('json')) {
        res.json({
            "status": 404,
            "responseText": "Sorry, Page not found"
            });
      }
    return;
});

//Handle 500
server.use(function(err, req, res, next){
    res.sendStatus(500);
    if (req.accepts('json')) {
        res.json({
            "status": 500,
            "responseText": "Sorry, something went wrong"
            });
      }
});

//send the user to 500 page without shutting down the server
process.on('uncaughtException', function (err) {
  console.log('-------------------------- Caught exception: ' + err);
    app.use(function(err, req, res, next){
        res.render('500');
    });
});


function Movie(title, poster_path, overview) {
  this.title = title;
  this.poster_path = poster_path;
  this.overview = overview;
}


