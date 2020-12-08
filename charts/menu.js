import { getDishes } from "../utils/api.js";

const Menu = (container) => {
  const width = 380;
  const height = 370;
  var margin = ({ top: 60, right: 10, bottom: 60, left: 50 });

  const svg = d3
    .select("#menu")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const update = async (restaurantID) => {
    if (!restaurantID) {
      return;
    }
    const dishes = await getDishes(restaurantID);

    svg
      .selectAll("text")
      .transition()
      .style("opacity", 0.0)
      .remove();

    svg
      .append("text")
      .attr("class", "title")
      .attr("y", -30)
      .attr("x", width / 2)
      .style("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "20px")
      .text("MENU");

    svg
      .append("text")
      .attr("y", 40)
      .attr("x", width / 2)
      .style("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "16px")
      .text("#1 "+dishes[0].dish_name);

    svg
      .append("text")
      .attr("y", 70)
      .attr("x", width / 2)
      .style("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "16px")
      .text("#2 " +dishes[1].dish_name);

    svg
      .append("text")
      .attr("y", 100)
      .attr("x", width / 2)
      .style("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "16px")
      .text("#3 " +dishes[2].dish_name);

    svg
      .append("text")
      .attr("y", 130)
      .attr("x", width / 2)
      .style("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "16px")
      .text("#4 " +dishes[3].dish_name);

    svg
      .append("text")
      .attr("y", 160)
      .attr("x", width / 2)
      .style("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "16px")
      .text("#5 " +dishes[4].dish_name);

    svg
      .append("text")
      .attr("y", 190)
      .attr("x", width / 2)
      .style("text-anchor", "middle")
      .style("fill", "white")
      .style("font-size", "16px")
      .text("#6 " +dishes[5].dish_name);

  };

  return {
    update,
  };
};

export default Menu;
