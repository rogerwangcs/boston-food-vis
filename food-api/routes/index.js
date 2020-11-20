const mysql = require("mysql");
const express = require("express");
const router = express.Router();

const executeSQL = (sqlQuery, cb) => {
  return new Promise((resolve, reject) => {
    const connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });
    connection.connect();
    connection.query(sqlQuery, (error, results, fields) => {
      if (error) reject(error);
      connection.end();
      resolve(results);
    });
  });
};

// get restaurants and their locations
router.get("/api/getRestaurants", async (req, res) => {
  try {
    const query = `select loc.location_id, brd.brand_name, brd.cuisine_type, brd.price_scale, loc.latitude, loc.longitude from brand as brd
  join location as loc
  on brd.brand_id = loc.FK_brand_id;`;
    const data = await executeSQL(query);
    res.json(data);
  } catch (err) {
    console.log(err);
  }
});

router.get("/api/getDishes", async (req, res) => {
  try {
    const locationId = req.query.locationId;
    const query = `select dish.dish_id, dish_name, menu_section, menu_description, dish_price, serving_size_grams, calories,
  total_fat, saturated_fat, cholesterol, sodium, carbohydrate, fiber, sugar, protein  from dish
  join dish_location as loc
  on dish.dish_id = loc.FK_dish_id
  join nutrition as nut
  on dish.dish_id = nut.FK_dish_id
  where loc.FK_location_id = '${locationId}'`;

    const data = await executeSQL(query);
    res.json(data);
  } catch (err) {
    console.log(err);
  }
});

router.get("/api/getDishesWithIngredients", async (req, res) => {
  try {
    const locationId = req.query.locationId;
    const query = `select dish.dish_id, dish_name, menu_section, menu_description, dish_price, nut.serving_size_grams, nut.calories,
    nut.total_fat, nut.saturated_fat, nut.cholesterol, nut.sodium, nut.carbohydrate, nut.fiber, nut.sugar, nut.protein,
    JSON_ARRAYAGG(ing.ingredient_name) AS 'ingredients'
    from dish
    join dish_location as loc
    on dish.dish_id = loc.FK_dish_id
    join nutrition as nut
    on dish.dish_id = nut.FK_dish_id
    join dish_ingredient as dish_ing
    on dish.dish_id = dish_ing.FK_dish_id
    join ingredient as ing
    on ing.ingredient_id = dish_ing.FK_ingredient_id
    where loc.FK_location_id = '${locationId}'
    GROUP BY dish.dish_id, dish_name, menu_section, menu_description, dish_price, nut.serving_size_grams, nut.calories,
    nut.total_fat, nut.saturated_fat, nut.cholesterol, nut.sodium, nut.carbohydrate, nut.fiber, nut.sugar, nut.protein;`;

    const data = await executeSQL(query);
    res.json(data);
  } catch (err) {
    console.log(err);
  }
});

router.get("/api/getIngredients", async (req, res) => {
  try {
    const ingredientId = req.query.ingredientId;
    const query = `select ingredient_name, serving_size_grams from ingredient as ing
  join dish_ingredient as con
  on ing.ingredient_id = con.FK_ingredient_id
  where con.FK_dish_id = '${ingredientId}'`;

    const data = await executeSQL(query);
    res.json(data);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
