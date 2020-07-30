import * as d3 from "d3";
import { height, width, zoomObj, zoomedOnClickState } from "./globalVals";
import { take } from "rxjs/operators";

export const zoomOutAll = () => {
  zoomObj.pipe(take(1)).subscribe((zoom) => {
    d3.select("#js-svg")
      .transition()
      .duration(1000)
      .call(
        zoom.transform,
        d3.zoomIdentity
          .translate(width / 2, height / 2)
          .scale(1)
          .translate(-width / 2, 0)
      );
    zoomedOnClickState.next(false);
  });
};
