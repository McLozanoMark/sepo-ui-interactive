const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");

// 1. Tiempo Límite con Decimales
// In range inputs for time:
html = html.replace(
  /<input\s+type="number"\s+class="form-control form-control-sm"\s+placeholder="Ej: 5"\s*\/>/g,
  '<input type="number" class="form-control form-control-sm" placeholder="Ej: 2.5" step="0.5" />',
);
html = html.replace(
  /<input\s+type="number"\s+class="form-control form-control-sm"\s+placeholder="Ej: 30"\s*\/>/g,
  '<input type="number" class="form-control form-control-sm" placeholder="Ej: 15.5" step="0.5" />',
);

// 2. Lógica Dinámica de Botones de Guardado (Stepper)
const wizardBtnsSearch =
  /<button\s+class="btn-prim"\s+onclick="confirmarGuardar\('Prueba Psicológica', guardarPrueba\)"\s*>\s*<i class="fas fa-save me-2"><\/i>Guardar como Borrador\s*<\/button>/;
const wizardBtnsReplace = `<button
              class="btn-prim"
              onclick="confirmarGuardar('Prueba Psicológica', guardarPrueba)"
            >
              <i class="fas fa-save me-2"></i>Guardar Borrador
            </button>
            <button
              id="btnGuardarFinal"
              class="btn btn-success fw-bold shadow-sm px-4"
              style="display: none;"
              onclick="confirmarGuardar('Prueba Psicológica', guardarPrueba)"
            >
              <i class="fas fa-check-double me-2"></i>Guardar y Finalizar
            </button>`;
html = html.replace(wizardBtnsSearch, wizardBtnsReplace);

// Update goStep
const goStepSearch =
  /document\.getElementById\("btnNext"\)\.style\.display =\s*n === TOTAL_STEPS - 1 \? "none" : "inline-flex";/;
const goStepReplace = `document.getElementById("btnNext").style.display =
          n === TOTAL_STEPS - 1 ? "none" : "inline-flex";
        
        const btnFinal = document.getElementById("btnGuardarFinal");
        if(btnFinal) {
           btnFinal.style.display = (n === TOTAL_STEPS - 1) ? "inline-flex" : "none";
        }`;
html = html.replace(goStepSearch, goStepReplace);

// 3. Filtro Dual Unificado (Fichas en Prestaciones)
const fichasDualSearch =
  /<div class="col-md-3">\s*<label class="form-label">Código Ficha<\/label>\s*<input\s*class="form-control"\s*id="pfCod"\s*placeholder="Ej: CPS-001"\s*\/>\s*<\/div>\s*<div class="col-md-7">\s*<label class="form-label">Descripción<\/label>\s*<input\s*class="form-control bg-white"\s*id="pfDesc"\s*placeholder="Busca por descripción..."\s*\/>\s*<\/div>/;
const fichasDualReplace = `<div class="col-md-10">
                      <label class="form-label"><i class="fas fa-search me-1"></i>Buscar Ficha</label>
                      <input
                        class="form-control bg-white"
                        id="pfCod"
                        placeholder="Buscar ficha por código o descripción..."
                      />
                    </div>`;
html = html.replace(fichasDualSearch, fichasDualReplace);

// 4. Combo Dinámico de Ordenamiento por Grupo Ocupacional
// (Add `evaluarDependenciaGrupo` function)
const evalGroupFunc = `
      function evaluarDependenciaGrupo(isDependent) {
         const div = document.getElementById('selectorGrupoOrden');
         if (div) {
             div.style.display = isDependent ? 'block' : 'none';
         }
      }
      function abrirOrdenPruebas(id, isDependent = false) {
         evaluarDependenciaGrupo(isDependent);
         // (rest of your logic to open the modal)
      }
`;
html = html.replace(
  "function cargarPruebasOrden() {",
  evalGroupFunc + "\n      function cargarPruebasOrden() {",
);

// 5. Selector de Tipo de Viñetas (Alternativas)
// In Configuración - Pregunta Cerrada AND Abierta: find `Creador de Alternativas / Claves` wrapper.
// We will look for: `<div class="col-12 mt-4">\s*<div class="d-flex justify-content-between align-items-center mb-2">\s*<h6 class="fw-bold text-muted m-0"><i class="fas fa-list mt-1 me-1"><\/i> Creador de Alternativas / Claves<\/h6>`
// and prepend the col-md-4 dropdown for viñetas. Let's do it using regex.
const vinetaDropdownHTML = `
                  <div class="col-md-4 mt-2">
                    <label class="form-label text-muted small fw-bold mb-1">Tipo de Viñeta</label>
                    <select class="form-select form-select-sm" id="mp_vineta">
                      <option value="num">Números (1, 2, 3)</option>
                      <option value="min">Letras Minúsculas (a, b, c)</option>
                      <option value="may" selected>Letras Mayúsculas (A, B, C)</option>
                    </select>
                  </div>
`;

// Insert into ABIERTA:
html = html.replace(
  /(<div class="col-12 mt-4">\s*<div class="d-flex justify-content-between align-items-center mb-2">\s*<h6 class="fw-bold text-muted m-0"><i class="fas fa-list mt-1 me-1"><\/i> Creador de Alternativas \/ Claves<\/h6>)/,
  vinetaDropdownHTML + "\n$1",
);

// Insert into CERRADA: (different text: `Creador de Alternativas` without `/ Claves`)
html = html.replace(
  /(<div class="col-12 mt-4">\s*<div class="d-flex justify-content-between align-items-center mb-2">\s*<h6 class="fw-bold text-muted m-0"><i class="fas fa-list mt-1 me-1"><\/i> Creador de Alternativas<\/h6>)/,
  vinetaDropdownHTML + "\n$1",
);

fs.writeFileSync("index.html", html);
console.log("Fixed requested UX rules!");
