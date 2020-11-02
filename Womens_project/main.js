/** 
* CONSTANTS AND GLOBALS 
* */
const width = window.innerWidth * 0.9,
  height = window.innerHeight / 3,
  paddingInner = 0.2,
  margin = { top: 20, bottom: 40, left: 40, right: 40 };
  default_selection = "Select a Service";
let svg;
let xScale;
let yScale;

/**
 * APPLICATION focus
 * */
let focus1 = {
  data: [],
  selectedFocus: "All"
};
/**
*LOAD DATA
**/
d3.csv("../data/womens_resource.csv", d3.autoType)
.then(raw_data => {
  console.log("raw_data", raw_data);
  focus1.data = raw_data;
init();
});

function init() {

/** SCALES */
// reference for d3.scales: https://github.com/d3/d3-scale
const xScale = d3
  .scaleBand()
  .domain(data.map(d => d.Borough))
  .range([margin.left, width - margin.right])
  .paddingInner(paddingInner);

const yScale = d3
  .scaleLinear()
  .domain([0, d3.max(data, d => d.OrganizationNumber)])
  .range([height - margin.bottom, margin.top]);

const xAxis = d3.axisBottom(xScale);
const yAxis = d3.axisLeft(yScale);

// UI ELEMENT SETUP
// add dropdown (HTML selection) for interaction
// HTML select reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select
const selectElement = d3.select("#dropdown").on("change", function() {
  console.log("new selected Focus is", this.value);
  // `this` === the selectElement
  // this.value holds the dropdown value a user just selected
  focus1.selectedFocus = this.value;
  draw(); // re-draw the graph based on this new selection
});

// add in dropdown options from the unique values in the data
selectElement
  .selectAll("option")
  .data([
    ...Array.from(new Set(focus1.data.map(d => d.focus1))),
    default_selection,
  ])
  .join("option")
  .attr("value", d => d)
  .text(d => d);
// this ensures that the selected value is the same as what we have in state when we initialize the options
selectElement.property("value", default_selection);

/** MAIN CODE */
svg = d3
  .select("#d3-container")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

  // add the xAxis
svg
  .append("g")
  .attr("class", "axis x-axis")
  .attr("transform", `translate(0,${height - margin.bottom})`)
  .call(xAxis)
  .append("text")
  .attr("class", "axis-label")
  .attr("x", "50%")
  .attr("dy", "3em")
  .text("Number of Protesters");
// add the yAxis
svg
  .append("g")
  .attr("class", "axis y-axis")
  .attr("transform", `translate(${margin.left},0)`)
  .call(yAxis)
  .append("text")
  .attr("class", "axis-label")
  .attr("y", "50%")
  .attr("dx", "-3em")
  .attr("writing-mode", "vertical-rl")
  .text("State Response");
draw(); // calls the draw function
}

/**
 * DRAW FUNCTION
 * we call this everytime there is an update to the data/Country
 * */
function draw() {
  // filter the data for the selectedLocation
  let filteredData = [];
  // if there is a selectedLocation, filter the data before mapping it to our elements
  if (Country.selectedLocation !== null) {
    filteredData = focus1.data.filter(d => d.focus1 === focus1.selectedFocus);
  }

// append rects
const rect = svg
  .selectAll("rect")
  .data(filteredData, d => d.focus1)
  .join("rect")
  .attr("y", d => yScale(d.OrganizationNumber))
  .attr("x", d => xScale(d.Borough))
  .attr("width", xScale.bandwidth())
  .attr("height", d => height - margin.bottom - yScale(d.OrganizationNumber))
  .attr("fill", "steelblue")

svg
  .append("g")
  .attr("class", "axis")
  .attr("transform", `translate(0, ${height - margin.bottom})`)
  .call(xAxis);
  });