const pg = require("pg");
const { Client } = require("pg");
const dataBase = process.env.CONNECTION_STRING;
const client = new Client(dataBase);
client.connect();

const handlers = {};

handlers.getMoviesHandler = (req, res) => {
  const query = "select * from movies;";
  client.query(query, (error, results) => {
    if (error) {
      console.log(error);
    } else res.status(200).json(results.rows);
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

module.exports = handlers;
