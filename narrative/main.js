/**
 * CONSTANTS AND GLOBALS
 * */
const width = window.innerWidth * 0.9,
  height = window.innerHeight * 0.7,
  margin = { top: 10, bottom: 10, left: 10, right: 10};

/** these variables allow us to access anything we manipulate in
 * init() but need access to in draw().
 * All these variables are empty before we assign something to them.*/
let svg;
let borough = {
  geojson: null,
  OrganizationNumber: null,
  hover: {
    latitude: null,
    longitude: null,
    borough: null,
  },
};

Promise.all([
  d3.json("../data/BoroughBoundaries.json"),
  d3.csv("../data/womens_resource.csv", d3.autoType),
]).then(([geojson, OrganizationNumber]) => {
  borough.geojson = geojson;
  borough.OrganizationNumber = OrganizationNumber;
  // console.log("borough: ", borough);
  init();
});

/**
 * INITIALIZING FUNCTION
 * this will be run *one time* when the data finishes loading in
 * */
function init() {
  // our projection and path are only defined once, and we don't need to access them in the draw function,
  // so they can be locally scoped to init()
  const projection = d3.geoAlbers().fitSize([width, height], borough.geojson);
  const path = d3.geoPath().projection(projection);

  // create an svg element in our main `d3-container` element
  svg = d3
    .select("#d3-container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  svg
    .selectAll(".borough")
    // all of the features of the geojson, meaning all the states as individuals
    .data(borough.geojson.features)
    .join("path")
    .attr("d", path)
    .attr("class", "borough")
    .attr("fill", "transparent")
    .on("mouseover", d => {
      // when the mouse rolls over this feature, do this
      borough.hover["borough"] = d.properties.NAME;
      draw(); // re-call the draw function when we set a new hoveredState
    });
  //Add point to map
  const dot = { circle: d => d.OrganizationNumber}
  svg
    .selectAll("circle")
    .data(borough.OrganizationNumber)
    .join("circle")
    .attr("r", 5)
    .attr("transform", d => {
      const [x, y] = projection([d.longitude, d.latitude]);
      return `translate(${x}, ${y})`;
    });
  
    let zoom = d3.zoom()
      .scaleExtent([1, 40])
      .translateExtent([[0.8, 0.6], [width, height]])
      .extent([[0.8, 0.6], [width, height]])
      .on('zoom', () => {
        svg.attr('transform', d3.event.transform)
       });
     
    svg.call(zoom);

  draw(); // calls the draw function
}

/**
 * DRAW FUNCTION
 * we call this everytime there is an update to the data/borough
 * */
function draw() {
  // return an array of [key, value] pairs
  hoverData = Object.entries(borough.hover);

  d3.select("#hover-content")
    .selectAll("div.row")
    .data(hoverData)
    .join("div")
    .attr("class", "row")
    .html(
      d =>
        // each d is [key, value] pair
        d[1] // check if value exist
          ? `${d[0]}: ${d[1]}` // if they do, fill them in
          : null // otherwise, show nothing
    );
}