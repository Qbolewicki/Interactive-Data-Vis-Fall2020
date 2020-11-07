/** 
* CONSTANTS AND GLOBALS 
* */
const width = window.innerWidth * 0.7,
height = window.innerHeight * 0.7,
  paddingInner = 0.2,
  margin = { top: 20, bottom: 50, left: 60, right: 40 },
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
  xScale = d3
    .scaleBand()
    .domain(d3.extent(focus1.data, d => d.Borough))
    .range([margin.left, width - margin.right])
    .paddingInner(paddingInner);
  yScale = d3
    .scaleLinear()
    .domain(d3.extent(focus1.data, d => d.OrganizationNumber))
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
    .text("Borough");
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
    .text("Number of Organizations");
  
  draw();
}
/**
 * DRAW FUNCTION
 * we call this everytime there is an update to the data/Country
 * */
function draw() {
  // filter the data for the selectedLocation
  let filteredData = [];
  // if there is a selectedLocation, filter the data before mapping it to our elements
  if (focus1.selectedFocus !== null) {
    filteredData = focus1.data.filter(d => d.focus1 === selectedFocus);
  }
  const rect = svg
  .selectAll("rect")
  .data(filteredData, d => d.focus1) // use `d.name` as the `key` to match between HTML and data elements
  .join(
    enter =>
      // enter selections -- all data elements that don't have a `.dot` element attached to them yet
      enter
        .append("rect")
        .attr("class", "rect") // Note: this is important so we can identify it in future updates
        .attr("x", d => xScale(d.Borough))
        .attr("y", d => margin.bottom) // initial value - to be transitioned
        .call(enter =>
          enter
            .transition() // initialize transition
            .delay(d => 0 * d.Borough) // delay on each element
            .duration(1000) // duration 1000ms
            .attr("y", d => yScale(d.OrganizationNumber))
        ),
    update =>
      update.call(update =>
        // update selections -- all data elements that match with a `.dot` element
        update
          .transition()
          .duration(1000)
          .transition()
          .duration(250)
          .attr("stroke", "lightgrey")
      ),
    exit =>
      exit.call(exit =>
        // exit selections -- all the `.dot` element that no longer match to HTML elements
        exit
          .transition()
          .delay(d => 0 * d.Borough)
          .duration(1000)
          .attr("y", height - margin.bottom)
          .remove()
      )
  );
}