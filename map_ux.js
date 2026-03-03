const fs = require("fs");
const html = fs.readFileSync("index.html", "utf8");

// Buscadores
const searchInputs = Array.from(
  html.matchAll(/<input[^>]+id="([^"]*buscar[^"]*)"/gi),
).map((m) => m[1]);
console.log("--- Buscadores ---");
console.log(searchInputs.join(", "));

// Filtros select
const filtrosSelect = Array.from(
  html.matchAll(/<select[^>]+id="([^"]*filtro[^"]*)"/gi),
).map((m) => m[1]);
console.log("--- Filtros Select ---");
console.log(filtrosSelect.join(", "));

// Paginadores
const paginators = Array.from(html.matchAll(/class="[^"]*pagination[^"]*"/gi));
console.log("--- Paginadores ---");
console.log(paginators.length + " paginadores encontrados");

// Tables or list containers
console.log("--- Contenedores ---");
const listM = html.match(/class="[^"]*card-item[^"]*"/g);
console.log("Card items: " + (listM ? listM.length : 0));
const tbodyM = html.match(/<tbody[^>]*>/g);
console.log("tbodys: " + (tbodyM ? tbodyM.length : 0));
