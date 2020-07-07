import * as d3 from "d3";
import {
  selectedID,
  initialLocations,
  width,
  height,
  zoomObj,
} from "./globalVals";
import { take } from "rxjs/operators";

export const zoomOnElement = () => {
  zoomObj.subscribe((zoom) => {
    if (zoom !== null) {
      selectedID.pipe(take(1)).subscribe((id) => {
        if (id !== null || id !== undefined) {
          initialLocations.pipe(take(1)).subscribe((initialItems) => {
            if (initialItems !== null) {
              const xPos = initialItems.find((item) => item.id === id).xPos;
              d3.select("#js-svg")
                .transition()
                .duration(1000)
                .call(
                  zoom.transform,
                  d3.zoomIdentity
                    .translate(width / 2, height / 2)
                    .scale(8.5)
                    .translate(-xPos, 0)
                );
            }
          });
        }
      });
    }
  });
};
