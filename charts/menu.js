import { getDishes } from "../utils/api.js";

const Menu = async (container) => {
  const width = 310;
  const height = 370;
  var margin = { top: 60, right: 10, bottom: 60, left: 50 };

  const svg = d3
    .select("#menu")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg
    .append("text")
    .attr("class", "title")
    .attr("y", -30)
    .attr("x", width / 2)
    .style("text-anchor", "middle")
    .style("fill", "white")
    .style("font-size", "20px")
    .text("MENU");

  const update = async (restaurantID) => {
    if (!restaurantID) {
      return;
    }
    const dishes = await getDishes(restaurantID);
    console.log(dishes);
    svg
      .append("text")
      .attr("y", -40)
      .attr("x", width / 2)
      .style("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "14px")
      .text(dishes[0].dish_name);

    svg
      .append("text")
      .attr("y", -50)
      .attr("x", width / 2)
      .style("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "14px")
      .text(dishes[1].dish_name);

    svg
      .append("text")
      .attr("y", -60)
      .attr("x", width / 2)
      .style("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "14px")
      .text(dishes[2].dish_name);

    svg
      .append("text")
      .attr("y", -70)
      .attr("x", width / 2)
      .style("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "14px")
      .text(dishes[3].dish_name);

    svg
      .append("text")
      .attr("y", -80)
      .attr("x", width / 2)
      .style("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "14px")
      .text(dishes[4].dish_name);

    svg
      .append("text")
      .attr("y", -90)
      .attr("x", width / 2)
      .style("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "14px")
      .text(dishes[5].dish_name);
  };

  return {
    update,
  };
};

export default Menu;
