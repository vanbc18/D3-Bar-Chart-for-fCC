let w = 800;
let h = 400;
let padding = 50;
const barWidth = w / 275; //275 is the number of bars needed and it's found when you call console.log(json.data.length);

//this is where our chart will be displayed
const svg = d3.select("#dataviz").
append("svg").
attr("width", w).
attr("height", h);

//d3.json() is how to get API working with our chart
d3.json(
'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json').
then(json => {
  const dataset = json.data;
  const dates = dataset.map(item => new Date(item[0]));
  const datesFormat = dataset.map(item => item[0]);
  const vals = dataset.map(item => item[1]);

  //xScale & yScale help us get the min max values of both axes
  const xScale = d3.scaleTime().
  domain([d3.min(dates), d3.max(dates)]).
  range([padding, w - padding]);

  const xAxis = d3.axisBottom(xScale);
  //need to append "g"s in order to display x & y axes, don't forget to call them too
  svg.append("g").
  call(xAxis).
  attr("id", "x-axis").
  attr("transform", "translate(0," + (h - padding) + ")");

  const yScale = d3.scaleLinear().
  domain([0, d3.max(vals)]).
  range([h - padding, padding]);

  const yAxis = d3.axisLeft(yScale);

  svg.append("g").
  call(yAxis).
  attr("id", "y-axis").
  attr("transform", "translate(50, 0)");

  //tooltip part
  let tooltip = d3.select("body").
  append("div").
  attr("id", "tooltip");

  //our chart's bars
  svg.selectAll("rect").
  data(dataset).
  enter().
  append("rect").
  attr("class", "bar").
  attr("width", barWidth).
  attr("height", d => h - yScale(d[1]) - padding).
  attr("fill", "#69b3a2").
  attr("x", (d, i) => xScale(dates[i])).
  attr("y", (d, i) => yScale(d[1])).
  attr("data-date", d => d[0]).
  attr("data-gdp", (d, i) => d[1]).
  on("mouseover", (event, d) => tooltip.
  transition().
  style("opacity", 1).
  style("cursor", "default").
  style("left", event.pageX + "px").
  style("top", event.pageY - 50 + "px").
  attr("data-date", d[0].toLocaleString()) //had to use toLocaleString() to validate user story :'(
  .attr("class", "container").
  text(() => "Billions: $" + d[1] + ' on ' + d[0])).
  on("mouseout", () => tooltip.style("opacity", 0));
});