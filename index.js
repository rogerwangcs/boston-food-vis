import MapBox from "./charts/mapbox.js";
import Ingredients from "./charts/ingredients.js";
import Nutrition from "./charts/nutrition.js";
import Menu from "./charts/menu.js";
import Cuisine from "./charts/cuisine.js";
import { timeout } from "./utils/helpers.js";

const dispatch = d3.dispatch("loaded", "setRestaurant", "goBack"); // parameters as list of dispatch names

const init = async () => {
  let selectedRestaurantId = null;
  const mapbox = MapBox(dispatch);
  const ingredients = Ingredients("");
  const nutrition = Nutrition("");

  // control overlay visibility
  const overlayBg = d3.select(".overlay-bg");
  const setOverlayOpacity = (isVisible) => {
    const opacity = isVisible ? 1 : 0;
    overlayBg.transition(1000).style("opacity", opacity);
    d3.select("#ingredients").transition(500).style("opacity", opacity);
    d3.select("#nutrition").transition(500).style("opacity", opacity);
  };
  const setOverlayDisplay = (isVisible) => {
    const display = isVisible ? "block" : "none";
    overlayBg.style("display", display);
    d3.select("#ingredients").style("display", display);
    d3.select("#nutrition").style("display", display);
  };
  overlayBg.on("click", async (e) => {
    dispatch.call("goBack", this, null);
    selectedRestaurantId = null;
    setOverlayOpacity(false);
    await timeout(1000);
    setOverlayDisplay(false);
  });

  // dispatch hooks
  dispatch.on("loaded", async () => {
    const loadingScreen = d3.selectAll(".loading-screen");
    loadingScreen.transition(1500).style("opacity", 0);
    await timeout(2000);
    loadingScreen.style("display", "none");
  });

  dispatch.on("setRestaurant", async (id) => {
    selectedRestaurantId = id;
    setOverlayDisplay(true);
    setOverlayOpacity(true);
    ingredients.update(selectedRestaurantId);
    nutrition.update(selectedRestaurantId);
  });
};

init();
