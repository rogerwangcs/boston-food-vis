import MapBox from "./charts/mapbox.js";
import Ingredients from "./charts/ingredients.js";
import Menu from "./charts/menu.js";
import Cuisine from "./charts/cuisine.js";
import { timeout } from "./utils/helpers.js";

const dispatch = d3.dispatch("loaded", "setRestaurant"); // parameters as list of dispatch names

const init = async () => {
  const mapbox = MapBox(dispatch);
  let selectedRestaurantId = null;

  // dispatch hooks
  dispatch.on("loaded", async () => {
    const loadingScreen = d3.selectAll(".loading-screen");
    loadingScreen.transition(1500).style("opacity", 0);
    await timeout(2000);
    loadingScreen.style("display", "none");
  });

  dispatch.on("setRestaurant", async (id) => {
    selectedRestaurantId = id;
    console.log(selectedRestaurantId);
    // pass to charts
  });
};

init();
