export function downloadJson(jsonStr: string, name: string) {
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:application/json;charset=utf-8," + encodeURIComponent(jsonStr)
  );
  element.setAttribute("download", `${name}.json`);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
