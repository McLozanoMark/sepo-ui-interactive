const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");

// remove resetBox("boxAlt"...) calls
html = html.replace(
  /resetBox\("boxAlt", "emptyAlt", "fas fa-list", "Sin alternativas\."\);/g,
  "",
);

// nullify addAlternativa and rowAlternativa block (not strictly needed since step-3 is gone but cleans up the script)
const addAltRegex =
  /function addAlternativa\(\) \{[\s\S]*?rowAlternativa\(clave, desc, pts\);[\s\S]*?\}\s*function rowAlternativa\(clave, desc, pts\) \{[\s\S]*?\}/;
html = html.replace(addAltRegex, "");

fs.writeFileSync("index.html", html);
console.log("Cleanup complete");
