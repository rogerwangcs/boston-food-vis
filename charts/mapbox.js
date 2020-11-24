import { getDishesWithIngredients, getRestaurants } from "../utils/api.js";
import { timeout } from "../utils/helpers.js";

const MapBox = async (dispatch) => {
  let selectedRestaurantId = null;
  let selectedRestaurant = null;
  mapboxgl.accessToken =
    "pk.eyJ1IjoiZW5qYWxvdCIsImEiOiJjaWhtdmxhNTIwb25zdHBsejk0NGdhODJhIn0.2-F2hS_oTZenAWc0BMf_uw";
  //Setup mapbox-gl map
  let map = new mapboxgl.Map({
    container: "mapbox", // container id
    style: "mapbox://styles/rogerwangcs/ckhph30v201zs19nzfgfsq31s",
    center: [-71.0989, 42.35],
    zoom: 12.15,
    dragPan: true,
    keyboard: false,
    dragRotate: false,
    scrollZoom: true,
    boxZoom: false,
  });

  // map d3 coordinates to mapbox coordinates
  const project = (d) => {
    return map.project(new mapboxgl.LngLat(d[0], d[1]));
  };

  let restaurants = await getRestaurants();
  await timeout(0); // set to 1000 when live
  dispatch.call("loaded", this);
  console.log(restaurants);

  // let dishes = await getDishesWithIngredients(
  //   "c738e262-2a7d-43d9-883f-cbf7c19d5693"
  // );

  map.flyTo({
    center: [-71.0989, 42.35],
    zoom: 12.3,
    speed: 0.1,
    curve: 1,
    easing: (t) => Math.log(t),
    essential: true,
  });

  const priceScale = d3
    .scaleLinear()
    .domain(d3.extent(restaurants.map((d) => d.price_scale)))
    .range([6, 9]);
  const colorScale = d3
    .scaleOrdinal()
    .domain([1, 2, 3])
    .range(d3.schemeCategory10);

  const mapBoxCon = map.getCanvasContainer();
  // console.log(mapBoxCon);
  const svg = d3
    .select(mapBoxCon)
    .append("svg")
    .attr("class", "mapbox-container");
  const dots = svg
    .selectAll("circle")
    .data(restaurants)
    .enter()
    .append("circle")
    .on("click", (e, d) => {
      map.flyTo({
        center: [d.longitude, d.latitude],
        zoom: 15,
        speed: 1.5,
        curve: 1,
        easing: (t) =>
          t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
        essential: true,
      });
      selectedRestaurantId = d.location_id;
      selectedRestaurant = d;
      dispatch.call("setRestaurant", this, d.location_id);
      update();
    })
    .on("mouseover", function (e, d) {
      d3.select("#name").text(d.brand_name);
      d3.select("#cuisine").text("Cuisine: " + d.cuisine_type);
      d3.select("#scale").text("Price Scale: " + d.price_scale);
      d3.select("#info").classed("hidden", false);
      return d3.select(this).transition().duration("50").attr("r", 20);
    })
    .on("mouseout", function (e, d) {
      if(selectedRestaurant == null) {
        d3.select("#info").classed("hidden", true);
      }
      else {
        d3.select("#name").text(selectedRestaurant.brand_name);
        d3.select("#cuisine").text("Cuisine: " + selectedRestaurant.cuisine_type);
        d3.select("#scale").text("Price Scale: " + selectedRestaurant.price_scale);
      }
      return d3
        .select(this)
        .transition()
        .duration("50")
        .attr(
          "r",
          d.location_id === selectedRestaurantId
            ? 20
            : priceScale(d.price_scale)
        )
        .style(("z-index", 0));
    });

  const update = () => {
    dots
      .attr("cx", (d) => project([d.longitude, d.latitude]).x)
      .attr("cy", (d) => project([d.longitude, d.latitude]).y)
      .attr("r", (d) =>
        d.location_id === selectedRestaurantId ? 20 : priceScale(d.price_scale)
      )
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .style("fill", (d) => colorScale(d.price_scale));
  };

  // Call update method and whenever map changes
  update();
  map.on("viewreset", update);
  map.on("move", update);
  map.on("moveend", update);
};

export default MapBox;
