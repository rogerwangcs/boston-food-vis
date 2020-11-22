import { getDishesWithIngredients, getRestaurants } from "../utils/api.js";
import { timeout } from "../utils/helpers.js";

const MapBox = async (dispatch) => {
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

  const mapBoxCon = map.getCanvasContainer();
  console.log(mapBoxCon);
  const svg = d3
    .select(mapBoxCon)
    .append("svg")
    .attr("class", "mapbox-container");
  const dots = svg
    .selectAll("circle")
    .data(restaurants)
    .enter()
    .append("circle")
    .attr("r", 5)
    .attr("stroke", "black")
    .attr("stroke-width", 2)
    .style("fill", "ff0000");

  const update = () => {
    dots
      .attr("cx", (d) => project([d.longitude, d.latitude]).x)
      .attr("cy", (d) => project([d.longitude, d.latitude]).y);
  };

  // Call update method and whenever map changes
  update();
  map.on("viewreset", update);
  map.on("move", update);
  map.on("moveend", update);
};

export default MapBox;
