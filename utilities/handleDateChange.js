import * as d3 from "d3";
import {
  width,
  height,
  xscale,
  x_axis,
  setSelectedDate,
  currentScale,
  selectedID,
  mainData,
  initialLocations,
} from "./globalVals";
import { styleAxis } from "./styleAxis";
import { clusterBuilder } from "./cluster-builder";
// import { notificationsData } from "../data/mock-data";
import { renderData } from "./render-data";
import { zoomOnElement } from "./zoom-on-element";
import { take } from "rxjs/operators";

export const handleDateChange = (year, onElementClick) => {
  setSelectedDate(new Date(year, 0, 1));
  xscale.domain(d3.extent([new Date(year, 0, 1), new Date(year, 11, 31)]));
  initialLocations.next(
    mainData.map((item) => ({
      ...item,
      xPos: xscale(item.date),
    }))
  );
  const svg = d3.select("body").transition();
  if (currentScale) {
    const newXScale = currentScale.rescaleX(xscale);

    svg.select(".x.axis").call(d3.axisBottom().scale(newXScale));

    d3.selectAll("#data-container-rect").remove();
    d3.selectAll("#today-line-group").remove();
    const newClusterData = clusterBuilder(
      mainData,
      currentScale ? 40 / currentScale.k : 40
    );

    selectedID.pipe(take(1)).subscribe((id) => {
      const mainSvg = d3.select("#js-svg");
      renderData(
        mainSvg,
        newClusterData,
        newXScale,
        id,
        onElementClick,
        zoomOnElement
      );
    });
    styleAxis(d3.select("#js-svg"), newXScale, 500);

    d3.select("#js-svg")
      .selectAll("#todays-line")
      .attr("x", (d) => newXScale(d) + 44);
  } else {
    svg.select(".x.axis").call(d3.axisBottom().scale(xscale));

    d3.selectAll("#data-container-rect").remove();
    const newClusterData = clusterBuilder(
      mainData,
      currentScale ? 40 / currentScale.k : 40
    );

    selectedID.pipe(take(1)).subscribe((id) => {
      const mainSvg = d3.select("#js-svg");
      renderData(
        mainSvg,
        newClusterData,
        xscale,
        id,
        onElementClick,
        zoomOnElement
      );
    });
    styleAxis(d3.select("#js-svg"), xscale);

    d3.select("#js-svg")
      .selectAll("#todays-line")
      .attr("x", (d) => xscale(d) + 44);
  }
};
