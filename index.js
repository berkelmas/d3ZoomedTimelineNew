import { createTimeline, zoomOnElement } from "./main";

createTimeline(
  "#container",
  () => console.log("deneme"),
  (d) => zoomOnElement(d.id)
);

document.getElementById("zoom-button").addEventListener("click", (_) => {
  const val = document.getElementById("id-input").value;
  zoomOnElement(val);
});
