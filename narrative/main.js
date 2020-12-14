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
  const projection = d3.geoAlbers()
    .center([4, 47])                // GPS of location to zoom on
    .scale(1020)   
    .fitSize([width/1, height/1], borough.geojson);
  const path = d3.geoPath().projection(projection);

  svg = d3
    .select("#my_dataviz")
    .append("svg")
    .attr("width", width)
    .attr("height", height);
    
  svg
    .selectAll("#my_dataviz")
    // all of the features of the geojson, meaning all the states as individuals
    .data(borough.geojson.features)
    .join("path")
    .attr("d", path)
    .attr("class", "borough")
    .attr("fill", "transparent")
    
     // create a tooltip
  var Tooltip = d3.select("#my_dataviz")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 1)
    .style("border", "")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")

     var mouseover = function(d) {
      Tooltip
      .style("opacity", 1)
    }

    var mousemove = function(d) {
      Tooltip
        .html("Primary Service: " + d.focus1 
           + "<br>" 
           + "Secondary Service: " + d.focus2 
           + "<br>" 
           + "Streeet Address: " + d.Address1 
           + "<br>" 
           + "Borough: " + d.boro_name)
        .style("left", (d3.mouse(this)[0]+10) + "px")
        .style("top", (d3.mouse(this)[1]) + "px")
    }

    var mouseleave = function(d) {
      Tooltip
      .style("opacity", 0)
    }

  //Add point to map
  const dot = {circle: d => d.OrganizationNumber}
  svg
    .selectAll("circle")
    .data(borough.OrganizationNumber)
    .enter()
    .append("circle")
    .attr("r", 5)
    .attr("transform", d => {
      const [x, y] = projection([d.longitude, d.latitude]);
      return `translate(${x}, ${y})`})
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
 
    let zoom = d3.zoom()
       .scaleExtent([1, 2])
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

}