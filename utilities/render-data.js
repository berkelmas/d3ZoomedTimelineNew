export const renderData = (
  mainSvg,
  clusteredData,
  xscale,
  activeID = null,
  onElementClick,
  onTopCircleClick
) => {
  const todaysEl = mainSvg
    .selectAll(".today-line")
    .data([new Date()])
    .enter()
    .append("g")
    .attr("id", "today-line-group");

  todaysEl
    .append("rect")
    .attr("id", "todays-line")
    .attr("x", (d) => xscale(d) + 44)
    .attr("width", 2)
    .attr("height", 188)
    .attr("y", 0)
    .attr("r", 5)
    .attr("rx", 2)
    .style("fill", "#43A0EE");

  const rectEls = mainSvg
    .selectAll(".rect")
    .data(clusteredData)
    .enter()
    .append("g")
    .attr("id", "data-container-rect");

  // RENDER NORMAL DATA
  rectEls
    .append("rect")
    .filter((d) => d["type"] !== "cluster")
    .attr("x", (d) => xscale(d.date))
    .attr("width", 55)
    .attr("height", 16)
    .attr("y", 60)
    .attr("r", 5)
    .attr("rx", 2)
    .style("cursor", "pointer")
    .on("click", (d) => onElementClick(d))
    .style("fill", "#43A0EE");

  // RENDER CLUSTERS
  rectEls
    .append("rect")
    .filter((d) => d["type"] === "cluster")
    .attr("x", (d) => xscale(d.date))
    .attr("width", 27)
    .attr("height", 27)
    .attr("y", 48)
    .attr("r", 5)
    .attr("rx", 2)
    .style("fill", "#F5B640");

  // ADD TEXT TO NORMAL DATA
  rectEls
    .append("text")
    .filter((d) => d["type"] !== "cluster")
    .attr("x", function (d, i) {
      return xscale(d.date) + 10;
    })
    .attr("y", 71)
    .attr("id", "item-id-text")
    .style("font-size", "9px")
    .style("fill", "white")
    .text((d) => d.id)
    .style("cursor", "pointer")
    .on("click", (d) => onElementClick(d));

  // ADD TEXT TO CLUSTERS
  rectEls
    .append("text")
    .filter((d) => d["type"] === "cluster")
    .attr("x", function (d, i) {
      return xscale(d.date) + 10;
    })
    .attr("y", 66)
    .attr("id", "item-id-text")
    .style("font-size", "14px")
    .style("fill", "white")
    .text((d) => d.children.length);

  // ADD CIRCLE AT TOP TO NORMAL DATA
  rectEls
    .append("path")
    .filter((d) => d["type"] !== "cluster")
    .filter((d) => d["id"] === activeID)
    .classed("fill-green", true)
    .attr("transform", function (d, i) {
      return `translate(${xscale(d.date) + 20}, 31), scale(0.045)`;
    })
    .attr(
      "d",
      "M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0z"
    )
    .style("cursor", "pointer")
    .classed("shadow", true)
    .on("click", onTopCircleClick);

  // ADD CIRCLE AT TOP TO CLUSTER DATA
  rectEls
    .append("circle")
    .filter((d) => d["type"] === "cluster")
    .filter((d) => d["children"].findIndex((i) => i["id"] === activeID) !== -1)
    .classed("fill-green", true)
    .attr("cx", function (d, i) {
      return xscale(d.date) + 14;
    })
    .attr("cy", 40)
    .attr("r", 5)
    .style("cursor", "pointer")
    .classed("shadow", true)
    .on("click", onTopCircleClick);
};
