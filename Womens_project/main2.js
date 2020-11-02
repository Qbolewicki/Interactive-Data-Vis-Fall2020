//CONSTANTS AND GLOBALS

const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 50, left: 60, right: 40 },
  radius = 5;
  default_selection = "Select a City";

let svg;
let xScale;
let yScale;

//APPLICATION City

let focus1 = {
  data: [],
  selectedFocus: "All"
};


//LOAD DATA
d3.json("../data/womens_resource.csv", d3.autoType)
.then(raw_data => {
  console.log("raw_data", raw_data);
  focus1.data = raw_data;
  init();
});

//INITIALIZING FUNCTION
function init() {

  // SCALES
  xScale = d3
    .scaleBand()
    .domain(d3.extent(focus1.data, d => d.Borough))
    .range([margin.left, width - margin.right]);

  yScale = d3
    .scaleLinear()
    .domain(d3.extent(focus1.data, d => d.OrganizationNumber))
    .range([height - margin.bottom, margin.top]);

  // AXES
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  // UI ELEMENT SETUP
  // add dropdown (HTML selection) for interaction
  const selectElement = d3.select("#dropdown").on("change", function() {
    console.log("new selected Focus is", this.value);
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

  // create an svg element in our main `d3-container` element
  svg = d3
    .select("#d3-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // add the xAxis
  const xAxis = d3.axisBottom(xScale).ticks(data.length);

  draw(); // calls the draw function
}

//DRAW FUNCTION
//we call this everytime there is an update to the data/focus1
function draw() {
  // filter the data for the selectedFocus
  let filteredData = [];
  // if there is a selectedFocus, filter the data before mapping it to our elements
  if (focus1.selectedFocus !== null) {
    filteredData = focus1.data.filter(d => d.focus1 === focus1.selectedFocus);
  }

    // append rects
    const rect = svg
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("y", d => yScale(d.OrganizationNumber))
      .attr("x", d => xScale(d.Borough))
      .attr("width", xScale.bandwidth())
      .attr("height", d => height - margin.bottom - yScale(d.OrganizationNumber))
      .attr("fill", "steelblue");
}