const baseUrl = "https://boston-food-api.herokuapp.com/api/";

const getRestaurants = async () => {
  const response = await fetch(baseUrl + "getRestaurants");
  const data = await response.json();
  return data;
};

const getDishes = async (locationId) => {
  const response = await fetch(baseUrl + "getDishes/?locationId=" + locationId);
  const data = await response.json();
  return data;
};

const getDishesWithIngredients = async (locationId) => {
  const response = await fetch(
    baseUrl + "getDishesWithIngredients/?locationId=" + locationId
  );
  const data = await response.json();
  // convert stringified ingredients list into arr then return
  return data.map((dish) => {
    dish.ingredients = JSON.parse(dish.ingredients);
    return dish;
  });
};
const getIngredients = async (dishId) => {
  const response = await fetch(baseUrl + "getIngredients/?dishId=" + dishId);
  const data = await response.json();
  return data;
};

export { getRestaurants, getDishes, getDishesWithIngredients, getIngredients };
