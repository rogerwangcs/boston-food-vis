import { getDishesWithIngredients } from "../utils/api.js";

const Nutrition = (container) => {
  // set the dimensions and margins of the graph
  const width = 250;
  const height = 250;
  var margin = ({top: 60, right: 10, bottom: 60, left: 50});

  // append the svg object to the div called 'ingredients'
  const svg = d3
    .select("#nutrition")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const xScale = d3
    .scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.1);

  const yScale = d3
      .scaleLinear()
      .range([height, 0]);

  const colorScale = d3
    .scaleOrdinal()
    .range(d3.schemeTableau10);

  const xAxis = d3.axisBottom()
      .scale(xScale)

  svg.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);
      
  const yAxis = d3.axisLeft()
      .scale(yScale);

  svg.append("g")
      .attr("class", "axis y-axis")
      .call(yAxis);

  svg.append("text")
    .attr("class", "cal")
    .attr('x', width/2)
    .attr('y', -10)
    .style("text-anchor", "middle")
    .style('fill', 'white')
    .style("font-size", "14px");
  
  svg.append("text")
    .attr("class", "y label")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style('fill', 'white')
    .style("font-size", "14px")
    .text("Grams(g)");

  svg.append("text")
    .attr("class", "x label")
    .attr("y", height + 40)
    .attr("x", width/2)
    .style("text-anchor", "middle")
    .style('fill', 'white')
    .style("font-size", "14px")
    .text("Nutrient");

  svg.append("text")
    .attr("class", "title")
    .attr("y", -30)
    .attr("x", width/2)
    .style("text-anchor", "middle")
    .style('fill', 'white')
    .style("font-size", "20px")
    .text("NUTRITION");

  const update = async (restaurantID) => {
    if (!restaurantID) {
      return;
    }
    const dishes = await getDishesWithIngredients(restaurantID);

    // Create data
    let nutrition = [];
    let calories = 0;
    let i;
    for(i=0;i<dishes.length;i++) {
      if(nutrition.length > 0){
        calories = (calories + dishes[i].calories)/2;
        nutrition[0].amount = (nutrition[0].amount + dishes[i].carbohydrate)/2;
        nutrition[1].amount = (nutrition[1].amount + dishes[i].fiber)/2;
        nutrition[2].amount = (nutrition[2].amount + dishes[i].protein)/2;
        nutrition[3].amount = (nutrition[3].amount + dishes[i].saturated_fat)/2;
        nutrition[4].amount = (nutrition[4].amount + dishes[i].sugar)/2;
      }
      else {
        calories = dishes[i].calories;
        nutrition = [ 
          {name: "carbohydrate", amount: dishes[i].carbohydrate},
          {name: "fiber", amount: dishes[i].fiber},
          {name: "protein", amount: dishes[i].protein},
          {name: "saturated_fat", amount: dishes[i].saturated_fat},
          {name: "sugar", amount: dishes[i].sugar}
        ];
      }
    }

    xScale.domain(nutrition.map(d => d.name));
    yScale.domain([0, d3.max(nutrition, function(d) { return d.amount; })]);
    colorScale.domain(new Set(nutrition.map(d => d.name)))

    svg.select(".cal")
      .text("Avg Calories: " + Math.round(calories));

    svg.select(".x-axis")
      .call(xAxis);
    
    svg.select(".y-axis")
      .call(yAxis);

    // clears any old data
    let bars = svg
      .selectAll(".bar")
      .remove()
      .exit()
      .data(nutrition);

    bars
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function(d) {
        return xScale(d.name);
      })
      .attr("y", function(d) {
        return yScale(d.amount);
      })
      .attr("height", function(d) {
        return height - yScale(d.amount);
      })
      .attr("width", xScale.bandwidth())
      .attr('fill', function(d) {
        return colorScale(d.name)
      });
  };

  return {
    update,
  };
};

export default Nutrition;
