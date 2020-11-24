import { getDishesWithIngredients } from "../utils/api.js";

const Ingredients = (container) => {
  // set the dimensions and margins of the graph
  const width = 500;
  const height = 500;
  const margin = 100;

  // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
  const radius = Math.min(width, height) / 2 - margin;

  // append the svg object to the div called 'ingredients'
  const svg = d3
    .select("#ingredients")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  const update = async (restaurantID) => {
    if (!restaurantID) {
      return;
    }
    const dishes = await getDishesWithIngredients(restaurantID);

    // Create data
    let newData = new Proxy(
      {},
      {
        get: (target, name) => (name in target ? target[name] : 0),
      }
    );
    dishes.map((d) => {
      for (const [key, value] of Object.entries(d["ingredients"])) {
        newData[value.split(",")[0]] += 1;
      }
    });

    let sortedObject = {};
    sortedObject = Object.keys(newData)
      .sort((a, b) => newData[b] - newData[a])
      .reduce((a, v) => {
        a[v] = newData[v];
        return a;
      }, {});

    //First 20
    let topIngredients = Object.keys(sortedObject) //get the keys out
      .slice(0, 20) //get the first N
      .reduce(function (memo, current) {
        //generate a new object out of them
        memo[current] = sortedObject[current];
        return memo;
      }, {});

    // clears any old data
    svg
      .selectAll("path")
      .transition()
      .style("opacity", 0.0)
      .duration(500)
      .remove();
    svg
      .selectAll("polyline")
      .transition()
      .style("opacity", 0.0)
      .duration(500)
      .remove();
    svg
      .selectAll("text")
      .transition()
      .style("opacity", 0.0)
      .duration(500)
      .remove();

    // set the color scale
    const color = d3
      .scaleOrdinal()
      .domain(Object.keys(sortedObject))
      .range(d3.schemeDark2);

    // Compute the position of each group on the pie:
    const pie = d3
      .pie()
      .sort(null) // Do not sort group by size
      .value(function (d) {
        return d.value;
      });
    const data_ready = pie(d3.entries(topIngredients));

    // The arc generator
    const arc = d3
      .arc()
      .innerRadius(radius * 0.5) // This is the size of the donut hole
      .outerRadius(radius * 0.8);

    // Another arc that won't be drawn. Just for labels positioning
    const outerArc = d3
      .arc()
      .innerRadius(radius * 0.9)
      .outerRadius(radius * 0.9);

    // Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
    svg
      .selectAll("allSlices")
      .data(data_ready)
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", function (d) {
        return color(d.data.key);
      })
      .attr("stroke", "white")
      .style("stroke-width", "1px")
      .style("opacity", 0)
      .transition()
      .duration(500)
      .style("opacity", 1);

    // Add the polylines between chart and labels:
    svg
      .selectAll("allPolylines")
      .data(data_ready)
      .enter()
      .append("polyline")
      .attr("stroke", "black")
      .style("fill", "none")
      .attr("stroke-width", 1)
      .attr("points", function (d) {
        var posA = arc.centroid(d); // line insertion in the slice
        var posB = outerArc.centroid(d); // line break: we use the other arc generator that has been built only for that
        var posC = outerArc.centroid(d); // Label position = almost the same as posB
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2; // we need the angle to see if the X position will be at the extreme right or extreme left
        posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1); // multiply by 1 or -1 to put it on the right or on the left
        return [posA, posB, posC];
      })
      .style("opacity", 0)
      .transition()
      .duration(500)
      .style("opacity", 1);

    // Add the polylines between chart and labels:
    svg
      .selectAll("allLabels")
      .data(data_ready)
      .enter()
      .append("text")
      .text(function (d) {
        return d.data.key;
      })
      .attr("transform", function (d) {
        var pos = outerArc.centroid(d);
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
        return "translate(" + pos + ")";
      })
      .style("text-anchor", function (d) {
        var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        return midangle < Math.PI ? "start" : "end";
      })
      .style("color", "white")
      .style("opacity", 0)
      .transition()
      .duration(500)
      .style("opacity", 1);
  };

  return {
    update,
  };
};

export default Ingredients;
