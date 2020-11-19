SET FOREIGN_KEY_CHECKS=0;
-- TRUNCATE location; 
-- LOAD DATA LOCAL INFILE  
-- '/Users/rogerwangcs/Desktop/archive/locations-2020-09-15.csv'
-- INTO TABLE location  
-- FIELDS TERMINATED BY ',' 
-- ENCLOSED BY '"'
-- LINES TERMINATED BY '\n'
-- IGNORE 1 ROWS
-- (FK_brand_id,	location_id	,street_address	,city,	county	,state	,zip_code,	latitude	,longitude,	time_zone);

-- TRUNCATE nutrition;
-- LOAD DATA LOCAL INFILE  
-- '/Users/rogerwangcs/Desktop/archive/dish-nutrition-2020-09-15.csv'
-- INTO TABLE nutrition  
-- FIELDS TERMINATED BY ',' 
-- ENCLOSED BY '"'
-- LINES TERMINATED BY '\n'
-- IGNORE 1 ROWS
-- (FK_dish_id	,serving_size_grams	,calories,	total_fat,	saturated_fat	,cholesterol	,sodium,	carbohydrate,	fiber,	sugar,	protein);

-- TRUNCATE dish_location; 
-- LOAD DATA LOCAL INFILE
-- '/Users/rogerwangcs/Desktop/archive/dish-locations-2020-09-15.csv'
-- IGNORE
-- INTO TABLE dish_location
-- FIELDS TERMINATED BY ',' 
-- ENCLOSED BY '"'
-- LINES TERMINATED BY '\n'
-- IGNORE 1 ROWS
-- (dish_location_id, FK_dish_id,FK_location_id,dish_price);

-- TRUNCATE dish_ingredient;
-- LOAD DATA LOCAL INFILE
-- '/Users/rogerwangcs/Desktop/archive/dish-ingredients-2020-09-15.csv'
-- IGNORE
-- INTO TABLE dish_ingredient
-- FIELDS TERMINATED BY ','
-- ENCLOSED BY '"'
-- LINES TERMINATED BY '\n'
-- IGNORE 1 ROWS
-- (dish_ingredient_id, FK_dish_id	,FK_ingredient_id,	serving_size_grams);

LOAD DATA LOCAL INFILE
'/Users/rogerwangcs/Desktop/archive/dish-ingredients-2020-09-15.csv'
IGNORE
INTO TABLE dish_ingredient
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(dish_ingredient_id, FK_dish_id	,FK_ingredient_id,	serving_size_grams);