select dish.dish_id, dish_name, menu_section, menu_description, dish_price, nut.serving_size_grams, nut.calories,
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
where loc.FK_location_id = 'c738e262-2a7d-43d9-883f-cbf7c19d5693'
GROUP BY dish.dish_id, dish_name, menu_section, menu_description, dish_price, nut.serving_size_grams, nut.calories,
nut.total_fat, nut.saturated_fat, nut.cholesterol, nut.sodium, nut.carbohydrate, nut.fiber, nut.sugar, nut.protein;