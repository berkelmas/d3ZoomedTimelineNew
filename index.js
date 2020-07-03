import { createTimeline, zoomOnElement } from "./main";
import { setSelectedID, selectedID } from "./utilities/globalVals";
import { renderData } from "./utilities/render-data";

createTimeline(
  "#container",
  () => "zoom",
  (d) => console.log(d)
);

document.getElementById("zoom-button").addEventListener("click", (_) => {
  const val = document.getElementById("id-input").value;
  selectedID.next(val);
});
