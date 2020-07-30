import * as d3 from "d3";
import { addMainPathLinearDef } from "./utilities/add-defs";
import { clusterBuilder } from "./utilities/cluster-builder";
import {
  width,
  height,
  xscale,
  x_axis,
  selectedID,
  initialLocations,
  zoomObj,
  setSelectedDate,
  mainData,
  currentScale,
  setMainData,
  zoomedOnClickState,
} from "./utilities/globalVals";
import { styleAxis } from "./utilities/styleAxis";
import { zoomOnElement } from "./utilities/zoom-on-element";
import {
  addZoomOutButton,
  removeZoomOutButton,
} from "./utilities/zoom-out-button";
import {
  selectedDate,
  setCurrentZoom,
  currentZoom,
  setCurrentScale,
} from "./utilities/globalVals";
import { renderData } from "./utilities/render-data";
import { take } from "rxjs/operators";

let zoom;
let mainSvg;
let clusteredData;
let currentXScale = xscale;

export const createTimeline = async (
  selector,
  chartData,
  onZoom,
  onElementClick
) => {
  setMainData(chartData);
  clusteredData = clusterBuilder(chartData, 40);

  setSelectedDate(new Date(new Date().getFullYear(), 1, 1));
  xscale.domain(
    d3.extent([
      new Date(selectedDate.getFullYear(), 0, 1),
      new Date(selectedDate.getFullYear(), 11, 31),
    ])
  );

  currentXScale = d3
    .scaleTime()
    .domain(
      d3.extent([
        new Date(selectedDate.getFullYear(), 0, 1),
        new Date(selectedDate.getFullYear(), 11, 31),
      ])
    )
    .range([0, width - 100]);

  zoomObj.next(null);
  initialLocations.next(null);
  zoomedOnClickState.next(false);
  setCurrentZoom(1);
  setCurrentScale(null);
  d3.select(selector)
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${200}`)
    .attr("id", "js-svg");
  mainSvg = d3.select("#js-svg");

  addMainPathLinearDef(mainSvg);

  x_axis.scale(currentXScale);
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

  zoomedOnClickState.subscribe((res) => {
    if (res) {
      addZoomOutButton();
    } else {
      removeZoomOutButton();
    }
  });

  selectedID.subscribe((id) => {
    if (id !== null) {
      d3.selectAll("#data-container-rect").remove();
      d3.selectAll("#today-line-group").remove();
      if (currentScale) {
        renderData(
          mainSvg,
          clusteredData,
          currentXScale,
          id,
          onElementClick,
          (_) => zoomOnElement()
        );
      } else {
        renderData(
          mainSvg,
          clusteredData,
          currentXScale.domain(
            d3.extent([
              new Date(selectedDate.getFullYear(), 0, 1),
              new Date(selectedDate.getFullYear(), 11, 31),
            ])
          ),
          id,
          onElementClick,
          (_) => zoomOnElement()
        );
      }
    }
  });
};
