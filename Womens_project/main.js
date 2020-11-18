/** 
* CONSTANTS AND GLOBALS 
* */
const width = window.innerWidth * 0.7,
height = window.innerHeight * 0.7,
  paddingInner = 0.2,
  margin = { top: 20, bottom: 50, left: 60, right: 40 },
  radius = 5;
  default_selection = "Select a Service";

let svg;
let xScale;
let yScale;

/**
 * APPLICATION focus
 * */
let focus1 = {
  data: [],
  selectedFocus: "All",
};

/**
*LOAD DATA
**/
d3.csv("../data/womens_resource.csv", 
d3.autoType)
.then(raw_data => {
  console.log("raw_data", raw_data);
  focus1.data = raw_data;
init();
});

//INITIALIZING FUNCTION
function init() {

  /** SCALES */
  xScale = d3
    .scaleBand()
    .domain(Array.from(new Set(focus1.data.map(d => d.Borough))))
    .range([margin.left, width - margin.right])
    .paddingInner(paddingInner);

  console.log(Array.from(new Set(focus1.data.map(d => d.Borough))))

  yScale = d3
    .scaleLinear()
    .domain(0, d3.max(focus1.data, d => d.OrganizationNumber))
    .range([height - margin.bottom, margin.top]);
 
// AXES
const xAxis = d3.axisBottom(xScale);
const yAxis = d3.axisLeft(yScale);
  
  // UI ELEMENT SETUP
  // add dropdown (HTML selection) for interaction
  // HTML select reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select
  const selectElement = d3.select("#dropdown").on("change", function() {
    console.log("new selected focus is", this.value);
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
  
      // append rects
const rect = svg
  .selectAll("rect")
  .data(data)
  .join("rect")
  .attr("y", d => yScale(d.OrganizationNumber))
  .attr("x", d => xScalex(d.Borough))
  .attr("width", xScale.bandwidth())
  .attr("height", d => height - margin.bottom - yScale(d.OrganizationNumber))
  .attr("fill", "steelblue")

// append text
const text = svg
  .selectAll("text")
  .data(data)
  .join("text")
  .attr("class", "label")
  // this allows us to position the text in the center of the bar
  .attr("x", d => xScale(d.Borough) + (xScale.bandwidth() / 2))
  .attr("y", d => yScale(d.OrganizationNumber))
  .text(d => d.count)
  .attr("dy", "1.25em");
  
  svg
    .append("g")
    .attr("class", "axis")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(xAxis);

  draw();
}
/**
 * DRAW FUNCTION
 * we call this everytime there is an update to the data/Country
 * */
function draw() {
  // filter the data for the selectedLocation
  let filteredData = focus1.data;
  // if there is a selectedLocation, filter the data before mapping it to our elements
  if (focus1.selectedFocus !== "All") {
    filteredData = focus1.data.filter(d => d.Focus === focus1.selectedFocus);
  }
  
}