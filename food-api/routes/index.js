const mysql = require("mysql");
const express = require("express");
const pyUtils = require("../utils/pythonUtils");
const router = express.Router();

const executeSQL = (sqlQuery, cb) => {
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });
  connection.connect();
  connection.query(sqlQuery, (error, results, fields) => {
    connection.end();
    cb(results);
  });
};

// get restaurants and their locations
router.get("/api/getRestaurants", async (req, res) => {
  const query = `select brd.brand_name, brd.cuisine_type, brd.price_scale, loc.latitude, loc.longitude from brand as brd
  join location as loc
  on brd.brand_id = loc.FK_brand_id;`;

  executeSQL(query, (data) => {
    console.log(data);
    res.json(data);
  });
});

module.exports = router;
