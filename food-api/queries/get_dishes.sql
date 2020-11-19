select dish.dish_id, dish_name, menu_section, menu_description, dish_price, serving_size_grams, calories,
total_fat, saturated_fat, cholesterol, sodium, carbohydrate, fiber, sugar, protein  from dish
join dish_location as loc
on dish.dish_id = loc.FK_dish_id
join nutrition as nut
on dish.dish_id = nut.FK_dish_id
where loc.FK_location_id = 'c738e262-2a7d-43d9-883f-cbf7c19d5693'