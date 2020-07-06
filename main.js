import * as d3 from "d3";
import { notificationsData } from "./data/mock-data";
import {
  addMainPathLinearDef,
  rescaleLinearGradientOnZoom,
} from "./utilities/add-defs";
import { clusterBuilder } from "./utilities/cluster-builder";
import { handleDateChange } from "./utilities/handleDateChange";
import {
  width,
  height,
  xscale,
  x_axis,
  selectedID,
  initialLocations,
  zoomObj,
} from "./utilities/globalVals";
import { styleAxis } from "./utilities/styleAxis";
import { zoomOnElement } from "./utilities/zoom-on-element";
import {
  selectedDate,
  setCurrentZoom,
  currentZoom,
  setCurrentScale,
} from "./utilities/globalVals";
import { renderData } from "./utilities/render-data";
import { take } from "rxjs/operators";

let zoom;
// let initialLocations;
let mainSvg;
let clusteredData;
let currentXScale = xscale;

export const createTimeline = (selector, chartData, onZoom, onElementClick) => {
  clusteredData = clusterBuilder(chartData, 40);

  const svgContainer = d3
    .select(selector)
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${200}`)
    .attr("id", "js-svg");
  mainSvg = d3.select("#js-svg");

  addMainPathLinearDef(mainSvg);

  const xAxisTranslate = height / 3.5;
  const gX = mainSvg
    .append("g")
    .classed("x axis", true)
    .attr("transform", "translate(50, " + xAxisTranslate + ")")
    .call(x_axis);

  zoom = d3
    .zoom()
    .translateExtent([
      [0, 0],
      [width, height],
    ])
    .scaleExtent([1, 50])
    .on("zoom", async () => {
      const pointToDateScale = d3
        .scaleLinear()
        .domain([0, 900])
        .range([
          new Date(selectedDate.getFullYear(), 0, 1),
          new Date(selectedDate.getFullYear(), 11, 31),
        ]);
      // zoom level is between 1 - 50;
      setCurrentZoom(d3.event.transform.k);

      // AXIS STARTING DATE
      const axisStartDate = pointToDateScale(
        -d3.event.transform.x / currentZoom
      );
      const axisEndDate = pointToDateScale(
        -d3.event.transform.x / currentZoom + 900 / currentZoom
      );
      onZoom(axisStartDate, axisEndDate);

      clusteredData = clusterBuilder(chartData, 40 / currentZoom);
      const new_xScale = d3.event.transform.rescaleX(xscale);
      currentXScale = new_xScale;
      setCurrentScale(d3.event.transform);

      d3.selectAll("#data-container-rect").remove();
      d3.selectAll("#today-line-group").remove();
      setTimeout(() => {
        styleAxis(mainSvg, new_xScale, 0);
      }, 0);

      gX.call(x_axis.scale(new_xScale));
      selectedID.pipe(take(1)).subscribe((id) => {
        renderData(mainSvg, clusteredData, new_xScale, id, onElementClick, () =>
          zoomOnElement()
        );
      });
    });
  zoomObj.next(zoom);
  mainSvg.call(zoom);

  renderData(mainSvg, clusteredData, xscale, null, onElementClick, () =>
    zoomOnElement()
  );
  styleAxis(mainSvg, xscale);

  // GET INITIAL LOCATIONS OF ALL DATA
  initialLocations.next(
    chartData.map((item) => ({
      ...item,
      xPos: xscale(item.date),
    }))
  );

  selectedID.subscribe((id) => {
    if (id !== null) {
      d3.selectAll("#data-container-rect").remove();
      d3.selectAll("#today-line-group").remove();
      renderData(
        mainSvg,
        clusteredData,
        currentXScale,
        id,
        onElementClick,
        (_) => zoomOnElement()
      );
    }
  });
};

// export const zoomOnElement = () => {
//   selectedID.pipe(take(1)).subscribe((id) => {
//     if (id !== null || id !== undefined) {
//       initialLocations.pipe(take(1)).subscribe((initialItems) => {
//         const xPos = initialItems.find((item) => item.id === id).xPos;
//         mainSvg
//           .transition()
//           .duration(1000)
//           .call(
//             zoom.transform,
//             d3.zoomIdentity
//               .translate(width / 2, height / 2)
//               .scale(8.5)
//               .translate(-xPos, 0)
//           );
//       });
//     }
//   });
// };
