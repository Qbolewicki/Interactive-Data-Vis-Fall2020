/**
 * CONSTANTS AND GLOBALS
 * */
const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 50, left: 60, right: 40 },
  radius = 5;
  default_selection = "Select a City";

/** these variables allow us to access anything we manipulate in
 * init() but need access to in draw().
 * All these variables are empty before we assign something to them.*/
let svg;
let xScale;
let yScale;

/**
 * APPLICATION City
 * */
let Country = {
  data: [],
  selectedLocation: "All"
};

/**
 * LOAD DATA
 * */
d3.json("../data/protests-europe-2009-2019.json", d3.autoType)
.then(raw_data => {
  console.log("raw_data", raw_data);
  Country.data = raw_data;
  init();
});

/**
 * INITIALIZING FUNCTION
 * this will be run *one time* when the data finishes loading in
 * */
function init() {

  // SCALES
  xScale = d3
    .scaleLinear()
    .domain(d3.extent(Country.data, d => d.Participants_average))
    .range([margin.left, width - margin.right]);

  yScale = d3
    .scaleLinear()
    .domain(d3.extent(Country.data, d => d.State_response_level))
    .range([height - margin.bottom, margin.top]);

  // AXES
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  // UI ELEMENT SETUP
  // add dropdown (HTML selection) for interaction
  // HTML select reference: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select
  const selectElement = d3.select("#dropdown").on("change", function() {
    console.log("new selected City is", this.value);
    // `this` === the selectElement
    // this.value holds the dropdown value a user just selected
    Country.selectedLocation = this.value;
    draw(); // re-draw the graph based on this new selection
  });

  // add in dropdown options from the unique values in the data
  selectElement
    .selectAll("option")
    .data([
      ...Array.from(new Set(Country.data.map(d => d.Location))),
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
    filteredData = Country.data.filter(d => d.Location === Country.selectedLocation);
  }

  const dot = svg
    .selectAll(".dot")
    .data(filteredData, d => d.Protest) // use `d.name` as the `key` to match between HTML and data elements
    .join(
      enter =>
        // enter selections -- all data elements that don't have a `.dot` element attached to them yet
        enter
          .append("circle")
          .attr("class", "dot") // Note: this is important so we can identify it in future updates
          .attr("r", radius)
          .attr("cx", d => xScale(d.Participants_average))
          .attr("cy", d => margin.bottom) // initial value - to be transitioned
          .call(enter =>
            enter
              .transition() // initialize transition
              .delay(d => 0 * d.Participants_average) // delay on each element
              .duration(1000) // duration 1000ms
              .attr("cy", d => yScale(d.State_response_level))
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
            .delay(d => 0 * d.Participants_average)
            .duration(1000)
            .attr("cy", height - margin.bottom)
            .remove()
        )
    );
}