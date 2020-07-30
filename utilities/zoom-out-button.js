import * as d3 from "d3";
import { width } from "./globalVals";
import { zoomOutAll } from "./zoom-out-all";

export const addZoomOutButton = () => {
  const mainSvg = d3.select("#js-svg");
  const zoomOutButtonGroup = mainSvg
    .append("g")
    .attr("id", "zoom-out-button-group");

  zoomOutButtonGroup
    .append("rect")
    .attr("x", 1)
    .attr("y", 1)
    .attr("id", "zoom-out-button")
    .style("fill", "white")
    .style("stroke", "#767676")
    .style("stroke-width", "2px")
    .attr("rx", "15")
    .attr("transform", `translate(${width - 80}, 20), scale(0.15)`)
    .attr("height", "150px")
    .attr("width", "150px")
    .attr("cursor", "pointer")
    .on("mouseover", function (d) {
      d3.select(this).style("fill", "#d1d1d1");
    })
    .on("mouseout", function (d) {
      d3.select(this).style("fill", "white");
    })
    .on("click", (_) => zoomOutAll());

  zoomOutButtonGroup
    .append("path")
    .attr(
      "d",
      "M84.85,68.86H45.65a2.35,2.35,0,0,1-2.35-2.35V65a2.36,2.36,0,0,1,2.35-2.36h39.2A2.36,2.36,0,0,1,87.2,65v1.56A2.35,2.35,0,0,1,84.85,68.86Zm39.29,53.55-2.21,2.21a2.37,2.37,0,0,1-3.34,0L93.31,99.34a2.33,2.33,0,0,1-.68-1.67V96a40.74,40.74,0,1,1,2.9-2.9h1.66a2.41,2.41,0,0,1,1.67.68l25.28,25.29A2.35,2.35,0,0,1,124.14,122.41ZM99.78,65.77a34.5,34.5,0,1,0-34.49,34.49A34.47,34.47,0,0,0,99.78,65.77Z"
    )
    .attr("fill", "#767676")
    .attr("transform", `translate(${width - 80}, 20), scale(0.15)`)
    .attr("cursor", "pointer")
    .on("mouseover", function (d) {
      d3.select("#zoom-out-button").style("fill", "#d1d1d1");
    })
    .on("mouseout", function (d) {
      d3.select("#zoom-out-button").style("fill", "white");
    })
    .on("click", (_) => zoomOutAll());
};

export const removeZoomOutButton = () => {
  const mainSvg = d3.select("#js-svg");
  mainSvg.select("#zoom-out-button-group").remove();
};
