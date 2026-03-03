const fs = require("fs");
const html = fs.readFileSync("index.html", "utf8");

const regexInp = /<input[^>]+placeholder=\"([^"']*buscar[^"']*)\"[^>]*>/gi;
let m;
while ((m = regexInp.exec(html)) !== null) {
  const inputFull = m[0];
  const idMatch = inputFull.match(/id=\"([^\"]+)\"/);
  const idStr = idMatch ? idMatch[1] : "SIN_ID";
  console.log("ID: " + idStr + " -> " + m[1]);
}
