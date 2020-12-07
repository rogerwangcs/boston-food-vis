import MapBox from "./charts/mapbox.js";
import Ingredients from "./charts/ingredients.js";
import Nutrition from "./charts/nutrition.js";
import Menu from "./charts/menu.js";
import Cuisine from "./charts/cuisine.js";
import { timeout } from "./utils/helpers.js";
import { getRestaurants } from "./utils/api.js";

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
    let restaurants = await getRestaurants();
    let rest = restaurants.filter((d) => d.location_id == id);
    d3.select("#rest").text(rest[0].brand_name);
    d3.select("#price").text("Price Scale: " + "$".repeat(parseInt(rest[0].price_scale)));
    let cs = rest[0].cuisine_type.split(";");
    let i;
    let cui = "";
    for(i = 0; i < cs.length; i++) {
      let x;
      let wo = cs[i].split("_")
      for(x = 0; x < wo.length; x++) {
        cui += wo[x].charAt(0).toUpperCase() + wo[x].slice(1);
        if(x != wo.length - 1) {
          cui += " ";
        }
      }
      if(i != cs.length - 1) {
        cui += ", ";
      }
    }
    d3.select("#cu").text("Cuisine: " + cui);

    setOverlayDisplay(true);
    setOverlayOpacity(true);
    ingredients.update(selectedRestaurantId);
    nutrition.update(selectedRestaurantId);
  });
};

init();
