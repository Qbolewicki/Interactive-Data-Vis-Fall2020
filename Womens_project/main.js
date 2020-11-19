//CONSTANTS AND GLOBALS
const width = window.innerWidth * 0.7,
height = window.innerHeight * 0.7,
  paddingInner = 0.2,
  margin = { top: 20, bottom: 50, left: 60, right: 40 },
  default_selection = "Select a Service";

let svg;
let xScale;
let yScale;

//APPLICATION
let focus1 = {
  data: [],
  selectedFocus: "All",
};

//LOAD DATA
d3.csv("../data/womens_resource.csv", 
d3.autoType )
.then(raw_data => {
  console.log("raw_data", raw_data);
  focus1.data = raw_data;
init();
});
function init() {

// UI ELEMENT SETUP
const selectElement = d3.select("#dropdown").on("change", function() {
  console.log("new selected focus is", this.value);
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

//SCALES
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

const xAxis = d3.axisBottom(xScale).ticks(data.length);
const yAxis = d3.axisLeft(yScale);
  
svg
  .append("g")
  .attr("class", "axis")
  .attr("transform", `translate(0, ${height - margin.bottom})`)
  .call(xAxis);

draw();
}
//DRAW FUNCTION
function draw() {
  let filteredData = [];
  if (focus1.selectedFocus !== "All") {
    filteredData = focus1.data.filter(d => d.Focus === focus1.selectedFocus);
  }
  const rect = svg
    .selectAll("rect")
    .data(filteredData, d => d.focus1)
    .join(
      enter =>
        enter
          .append("rect")
          .attr("class", "rect")
          .attr("x", d => xScale(d.Borough))
          .attr("y", d => margin.bottom) // initial value - to be transitioned
          .call(enter =>
            enter
              .transition()
              .delay(d => 0 * d.Borough)
              .duration(1000) // duration
              .attr("y", d => yScale(d.OrganizationNumber))
          ),
      update =>
        update.call(update =>
          update
            .transition()
            .duration(1000)
            .transition()
            .duration(250)
            .attr("stroke", "lightgrey")
        ),
      exit =>
        exit.call(exit =>
          exit
            .transition()
            .delay(d => 0 * d.Borough)
            .duration(1000)
            .attr("cy", height - margin.bottom)
            .remove()
        )
    );
}
