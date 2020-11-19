const 
  width = window.innerWidth * .40,
  height = window.innerHeight * .6,
  margin = { top: height/20, bottom: 0, left: 50, right: 50};

var svg1 = d3
      .select("#d3-container-3")
      .append("svg")
      .attr("width", width)
      .attr("height", height)

    tool = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip1")
      .style("opacity", 0)

var allGroup1 = ["Arson", "Burglary", "Dangerous Weapons", "Felony Assault", "Grand Larceny", "Rape", "Robbery", "Sex Crimes", "Murder-NNM"]

    d3.select("#selectButton1")
      .selectAll('myOptions')
      .data(allGroup1)
      .enter()
      .append('option')
      .text(function (d) { return d; })
      .attr("value", function (d) { return d; });

var x = d3
      .scaleBand()
      .range([margin.top/.3, width - 100 ])
      .padding(0.5);

var xAxis1 = svg1
      .append("g")
      .attr("transform", `translate(0,${height - margin.top - margin.top})`)
      .style("color", "whitesmoke")
      .style("font-size", ".6vw")

var y = d3
      .scaleLinear()
      .range([ height - margin.top - margin.top, margin.top * 2]);

var yAxis1 = svg1
      .append("g")
      .attr("class", "myYaxis")
      .attr("transform", `translate(${margin.top/.3})`)
      .style("color", "whitesmoke")
      .style("font-size", ".6vw")

update = (selectedVar) => {

  d3.csv("data1/crime_whole_12.csv").then(data1 => {
    console.log(data1);

    x
      .domain(data1.map(d => d.Borough))

    xAxis1
      .transition().duration(500).call(d3.axisBottom(x))

    y
      .domain([0, d3.max(data1, function(d) { return +d[selectedVar] }) + (d3.max(data1, function(d) { return +d[selectedVar] })/15 )]);

    yAxis1
      .transition()
      .duration(1000)
      .call(d3.axisLeft(y));

    svg1
      .append("text")
      .attr("class", "axis-label")
      .attr("y", "50%")
      .attr("dx", "2em")
      .style("fill", "whitesmoke")
      .style("font-size", ".9vw")
      .attr("writing-mode", "vertical-rl")
      .text("Average # of Arrests per 100,000 people per year")

    var u = svg1
      .selectAll("rect")
      .data(data1)
    
    u.enter()
      .append("rect")
      .merge(u)
      .transition()
      .duration(1000)
        .attr("x", function(d) { return x(d.Borough); })
        .attr("y", function(d) { return y(d[selectedVar]); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - margin.top - margin.top - y(d[selectedVar]); })
        .attr("fill", "rgb(212, 204, 204)")
        .attr("stroke", "whitesmoke")
        .attr("stroke-width", "2")
  })
}

update('Arson')

  d3
    .select("#selectButton1")
    .on("change", function(d) {
  var selectedOption1 = d3.select(this).property("value")
    update(selectedOption1)
  })

