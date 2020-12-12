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
console.log (d3.rollup)

const barData = d3.rollups(focus1.data, v => v.length, d => d.Borough)
.map(([borough, count]) => ({borough: borough, count: count }))

console.log(barData)

//SCALES
xScale = d3
  .scaleBand()
  .domain(Array.from(new Set(focus1.data.map(d => d.Borough))))
  .range([margin.left, width - margin.right])
  .paddingInner(paddingInner);

  console.log(Array.from(new Set(focus1.data.map(d => d.Borough))))

yScale = d3
  .scaleLinear()
  .domain(focus1.data.map, v => v.length, d => d.Borough)
  .range([height - margin.bottom, margin.top]);

  console.log(focus1.data, v => v.length, d => d.Borough)

const xAxis = d3.axisBottom(xScale);
const yAxis = d3.axisLeft(yScale);

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
    .text("Number of Locations");

  draw();
}

//DRAW FUNCTION
function draw() {
  let filteredData = [];
  if (focus1.selectedFocus !== "All") {
    filteredData = focus1.data.filter(d => d.focus1 === focus1.selectedFocus);
  }

  const bars = svg
    .selectAll(".bars")
    .data(filteredData, d => d.name)
    .join(
      enter =>
        enter
          .append("bars")
          .attr("class", "bars")
          .attr("x", d => xScale(d.Borough))
          .attr("y", d => yScale(d.Borough))
          .attr("width", xScale.bandwidth())
          .attr("height", d => height - margin.bottom - yScale(d.OrganizationNumber))
          .call(enter =>
            enter
              .transition()
              .duration(500)
              .attr("y", d => yScale(d.Borough))
          ),
      update =>
        update.call(update =>
          update
            .transition()
            .duration(250)
        ),
      exit =>
        exit.call(exit =>
          exit
            .transition()
            .delay(d => 50 * d.Borough)
            .duration(500)
            .attr("y", height - margin.bottom)
            .remove()
        )
    );
}