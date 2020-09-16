d3.csv("./protests-europe-2009-2019.csv").then(data => {

    console.log("data", data);
    
    const table = d3.select("#d3-table")

    /*header*/
    const thead = table.append("thead");

    thead
        .append("tr")
        .selectAll("th")
        .data(data.columns)
        .join("td")
        .text(d => d);

    /*body*/

    const rows = table
        .append("tbody")
        .selectAll("tr")
        .data(data)
        .join("tr");

    rows
        .selectAll("td")
        .data(d => Object.values(d))
        .join("td")
        //?=if, :=else, 
        .attr("class", d => d == "beatings" ? "beatings" : null)
        .text(d => d);

});