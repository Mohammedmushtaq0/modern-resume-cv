const fs = require("fs");

// Load data
const data = JSON.parse(fs.readFileSync("data.json", "utf8"));
const jsData = JSON.stringify(data, null, 2);

// Read HTML
let html = fs.readFileSync("index.html", "utf8");

// Replace embedded data
const pattern = /(const data = )\{[\s\S]*?\}(?=\s*;)/;

if (pattern.test(html)) {
  html = html.replace(pattern, `$1${jsData}`);
} else {
  const startMarker = "const data = {";
  const startIndex = html.indexOf(startMarker);

  if (startIndex !== -1) {
    let braceCount = 0;
    let endIndex = startIndex + startMarker.length;

    for (let i = startIndex + startMarker.length; i < html.length; i++) {
      if (html[i] === "{") braceCount++;
      if (html[i] === "}") {
        if (braceCount === 0) {
          endIndex = i + 1;
          break;
        }
        braceCount--;
      }
    }

    if (endIndex > startIndex) {
      html =
        html.substring(0, startIndex + startMarker.length - 1) +
        `const data = ${jsData}` +
        html.substring(endIndex);
    }
  }
}

// Write
fs.writeFileSync("index.html", html, "utf8");

console.log("✓ Updated index.html with data from data.json");
