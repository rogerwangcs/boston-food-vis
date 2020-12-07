import { getDishesWithIngredients, getRestaurants } from "../utils/api.js";
import { timeout } from "../utils/helpers.js";

const MapBox = async (dispatch) => {
  let cuisineFilter = "";
  let priceFilter = "";

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

  let originalRestaurants = await getRestaurants();
  let restaurants = originalRestaurants;
  await timeout(0); // set to 1000 when live
  dispatch.call("loaded", this);

  map.flyTo({
    center: [-71.0989, 42.35],
    zoom: 12.3,
    speed: 0.1,
    curve: 1,
    easing: (t) => Math.log(t),
    essential: true,
  });

  const colorScale = d3
    .scaleLinear()
    .domain([1, 4])
    .range(["#ffdbc4", "#f0280a"]);

  const mapBoxCon = map.getCanvasContainer();

  const svg = d3
    .select(mapBoxCon)
    .append("svg")
    .attr("class", "mapbox-container");

  const hoverText = svg
    .append("text")
    .style("position", "absolute")
    .style("fill", "white")
    .style("text-anchor", "middle")
    .style("font-size", "20px");

  const leg = d3.select("#legend");
  var keys = [1, 2, 3, 4];

  leg
    .selectAll("leg")
    .data(keys)
    .enter()
    .append("circle")
    .attr("cx", 20)
    .attr("cy", function (d, i) {
      return 20 + i * 25;
    }) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("r", 7)
    .style("fill", function (d) {
      return colorScale(d);
    });

  leg
    .selectAll("labels")
    .data(keys)
    .enter()
    .append("text")
    .attr("x", 40)
    .attr("y", function (d, i) {
      return 20 + i * 25;
    })
    .style("fill", "white")
    .text(function (d) {
      return "$".repeat(parseInt(d));
    })
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle");

  const bar = d3.select("#cuisines");
  const cuisines = [
    "Italian",
    "Sandwiches",
    "Chinese",
    "Sushi",
    "Mexican",
    "Breakfast",
    "Pizza",
    "Bar",
    "Cafe",
  ];

  const cuisineButtons = bar
    .selectAll("cuis")
    .data(cuisines)
    .enter()
    .append("img")
    .style("top", "10px")
    .style("left", function (d, i) {
      return 20 + i * 85 + "px";
    })
    .style("width", "70px")
    .style("height", "70px")
    .attr("src", function (d) {
      return "images/" + d.toLowerCase() + ".png";
    })
    .style("filter", (d) => {
      cuisineFilter === d
        ? "brightness(1) sepia(1) saturate(10000%) hue-rotate(1deg)"
        : "none";
    })
    .on("click", (e, d) => {
      if (cuisineFilter === d) cuisineFilter = "";
      else cuisineFilter = d;
      filterUpdate();
    });

  const dots = svg
    .selectAll("circle")
    .data(restaurants)
    .enter()
    .append("circle")
    .on("click", (e, d) => {
      map.flyTo({
        center: [d.longitude, d.latitude],
        speed: 1.3,
        curve: 1,
        easing: (t) =>
          t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
        essential: true,
      });
      map.once("moveend", () => {
        selectedRestaurantId = d.location_id;
        selectedRestaurant = d;
        dispatch.call("setRestaurant", this, d.location_id);
        update();
      });
    })
    .on("mouseover", function (e, d) {
      let cs = d.cuisine_type.split(";");
      let i;
      let cui = "";
      for (i = 0; i < cs.length; i++) {
        let x;
        let wo = cs[i].split("_");
        for (x = 0; x < wo.length; x++) {
          cui += wo[x].charAt(0).toUpperCase() + wo[x].slice(1);
          if (x != wo.length - 1) {
            cui += " ";
          }
        }
        if (i != cs.length - 1) {
          cui += ", ";
        }
      }
      d3.select("#name").text(d.brand_name);
      d3.select("#cuisine").text("Cuisine: " + cui);
      d3.select("#scale").text(
        "Price Scale: " + "$".repeat(parseInt(d.price_scale))
      );
      d3.select("#restaurant").style("opacity", 1);
      // hoverText
      //   .attr("x", e.clientX)
      //   .attr("y", e.clientY - 35)
      //   .text(d.brand_name)
      //   .style("display", "block");
      return d3.select(this).raise().transition().duration("250").attr("r", 20);
    })
    .on("mouseout", function (e, d) {
      // hoverText.style("display", "none");
      d3.select("#restaurant").style("opacity", 0);
      return d3
        .select(this)
        .transition()
        .duration("50")
        .attr("r", d.location_id === selectedRestaurantId ? 20 : 6)
        .style(("z-index", 0));
    });

  const filterUpdate = () => {
    if (cuisineFilter === "") {
      restaurants = originalRestaurants;
    } else {
      restaurants = originalRestaurants.filter((d) =>
        d.cuisine_type.split(";").includes(cuisineFilter.toLowerCase())
      );
    }
    svg
      .selectAll("circle")
      .data(restaurants)
      .enter()
      .append("circle")
      .on("click", (e, d) => {
        map.flyTo({
          center: [d.longitude, d.latitude],
          speed: 1.3,
          curve: 1,
          easing: (t) =>
            t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
          essential: true,
        });
        map.once("moveend", () => {
          selectedRestaurantId = d.location_id;
          selectedRestaurant = d;
          dispatch.call("setRestaurant", this, d.location_id);
          update();
        });
      })
      .on("mouseover", function (e, d) {
        let cs = d.cuisine_type.split(";");
        let i;
        let cui = "";
        for (i = 0; i < cs.length; i++) {
          let x;
          let wo = cs[i].split("_");
          for (x = 0; x < wo.length; x++) {
            cui += wo[x].charAt(0).toUpperCase() + wo[x].slice(1);
            if (x != wo.length - 1) {
              cui += " ";
            }
          }
          if (i != cs.length - 1) {
            cui += ", ";
          }
        }
        d3.select("#name").text(d.brand_name);
        d3.select("#cuisine").text("Cuisine: " + cui);
        d3.select("#scale").text(
          "Price Scale: " + "$".repeat(parseInt(d.price_scale))
        );
        d3.select("#restaurant").style("opacity", 1);
        // hoverText
        //   .attr("x", e.clientX)
        //   .attr("y", e.clientY - 35)
        //   .text(d.brand_name)
        //   .style("display", "block");
        return d3
          .select(this)
          .raise()
          .transition()
          .duration("250")
          .attr("r", 20);
      })
      .on("mouseout", function (e, d) {
        // hoverText.style("display", "none");
        d3.select("#restaurant").style("opacity", 0);
        return d3
          .select(this)
          .transition()
          .duration("50")
          .attr("r", d.location_id === selectedRestaurantId ? 20 : 6)
          .style(("z-index", 0));
      });
    svg.selectAll("circle").data(restaurants).exit().remove();
    update();
  };

  const update = () => {
    svg
      .selectAll("circle")
      .attr("cx", (d) => project([d.longitude, d.latitude]).x)
      .attr("cy", (d) => project([d.longitude, d.latitude]).y)
      .attr("r", (d) => (d.location_id === selectedRestaurantId ? 20 : 6))
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .style("fill", (d) => colorScale(d.price_scale));

    cuisineButtons
      .style("filter", (d) =>
        cuisineFilter === d
          ? "brightness(1) sepia(1) saturate(10000%) hue-rotate(1deg)"
          : "none"
      )
      .style("transform", (d) =>
        cuisineFilter === d ? "scale(1.08) rotate(2deg)" : "none"
      );
  };

  dispatch.on("goBack", (id) => {
    selectedRestaurantId = id;
    update();
  });

  // Call update method and whenever map changes
  map.on("viewreset", update);
  map.on("move", update);
  map.on("moveend", update);
  update();
};

export default MapBox;
