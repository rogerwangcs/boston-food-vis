import MapBox from "./charts/mapbox.js";
import Ingredients from "./charts/ingredients.js";
import Menu from "./charts/menu.js";
import Cuisine from "./charts/cuisine.js";
import { timeout } from "./utils/helpers.js";

const dispatch = d3.dispatch("loaded"); // parameters as list of dispatch names

const init = async () => {
  const mapbox = MapBox(dispatch);

  // dispatch hooks
  dispatch.on("loaded", async () => {
    const loadingScreen = d3.selectAll(".loading-screen");
    loadingScreen.transition(1500).style("opacity", 0);
    await timeout(2000);
    loadingScreen.style("display", "none");
  });
};

init();
