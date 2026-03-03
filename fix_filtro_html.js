const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");

const regex =
  /<div class="col-md-3">\s*<label class="form-label">Código Ficha<\/label>\s*<input\s*class="form-control"\s*id="pfCod"\s*placeholder="Ej: CPS-001"\s*\/>\s*<\/div>\s*<div class="col-md-7">\s*<label class="form-label">Descripción<\/label>\s*<input\s*class="form-control bg-white"\s*id="pfDesc"\s*placeholder="Busca por descripción..."\s*\/>\s*<\/div>/;

if (regex.test(html)) {
  html = html.replace(
    regex,
    `<div class="col-md-10">
                      <label class="form-label"><i class="fas fa-search me-1"></i>Buscar Ficha</label>
                      <input
                        class="form-control bg-white"
                        id="pfCod"
                        placeholder="Buscar ficha por código o descripción..."
                      />
                    </div>`,
  );

  fs.writeFileSync("index.html", html);
  console.log("Filtro unificado actualizado correctamente.");
} else {
  console.log("No se encontro el target regex en HTML o ya fue reemplazado.");
}
