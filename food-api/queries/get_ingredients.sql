select ingredient_name, serving_size_grams from ingredient as ing
join dish_ingredient as con
on ing.ingredient_id = con.FK_ingredient_id
where con.FK_dish_id = '4fe1311a-504d-4562-8e2d-77ce61ee7581'