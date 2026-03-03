const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");

// 1. Add SortableJS right before the last closing script or body
if (!html.includes("Sortable.min.js")) {
  html = html.replace(
    "</body>",
    '  <script src="https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js"></script>\n</body>',
  );
}

// 2. Modify rowPregunta to include Duplicate Button
const originalRowPregunta = `          <div class="d-flex gap-1">
            <button class="btn btn-sm btn-light border"><i class="fas fa-edit text-muted"></i></button>
            <button class="btn btn-sm btn-light border text-danger" onclick="this.closest('.item-row').remove()"><i class="fas fa-trash"></i></button>
          </div>
        </li>\`;`;

const newRowPregunta = `          <div class="d-flex flex-column gap-1">
            <button class="btn btn-sm btn-light border" title="Editar"><i class="fas fa-edit text-muted"></i></button>
            <button class="btn btn-sm btn-light border text-primary" title="Duplicar" onclick="duplicarPregunta(this)"><i class="fas fa-copy"></i></button>
            <button class="btn btn-sm btn-light border text-danger" title="Eliminar" onclick="this.closest('.item-row').remove()"><i class="fas fa-trash"></i></button>
          </div>
        </li>\`;`;
html = html.replace(originalRowPregunta, newRowPregunta);

// Injection script for duplicarPregunta:
const duplicarPreguntaCode = `      function duplicarPregunta(btn) {
         const row = btn.closest('.item-row');
         const clone = row.cloneNode(true);
         clone.classList.remove('dragging');
         clone.style.opacity = '1';
         row.after(clone);
         dragEndPregRow(); // to renumber
      }\n\n      function rowPregunta(`;
html = html.replace("function rowPregunta(", duplicarPreguntaCode);

// 3. Image Dimensions in Question Box
html = html.replace(
  '<input type="file" class="form-control" accept="image/*">',
  '<input type="file" class="form-control" accept="image/*" style="display:inline-block; width:calc(100% - 110px);"><select class="form-select form-select-sm mt-1 float-end w-auto d-inline-block ps-2 pe-4" title="Tamaño de vista"><option value="small">Pequeño</option><option value="medium" selected>Mediano</option><option value="large">Grande</option></select>',
);
// wait, replace all matches for boxImage
html = html.replace(
  /<input type="file" class="form-control" accept="image\/\*">/g,
  '<div class="d-flex gap-2 mt-1"><input type="file" class="form-control" accept="image/*"><select class="form-select px-2 w-auto border-secondary"><option value="small">IMG: Pequeño</option><option value="medium" selected>IMG: Mediano</option><option value="large">IMG: Grande</option></select></div>',
);

// 4. Update alternatives: drag handles, duplicate button, image dimensions.
const altTemplateA = `         div.className = "d-flex gap-2 align-items-center p-2 border rounded bg-white shadow-sm item-alt";
         div.innerHTML = \`
            <i class="fas fa-grip-vertical text-black-50 handle" style="cursor: grab;"></i>
            <div style="width: 80px;">
              <input type="text" class="form-control form-control-sm border-warning fw-bold text-center" placeholder="A, B...">
            </div>
            <div style="width: 100px;">
              <select class="form-select form-select-sm mpc-tipoalt bg-light text-muted" onchange="swMpcAlt(this)">
                 <option value="texto">Texto</option>
                 <option value="imagen">Imagen</option>
              </select>
            </div>
            <div class="flex-grow-1 mpc-dynamic-box">
               <input type="text" class="form-control form-control-sm border-warning" placeholder="Descripción de la alternativa...">
            </div>
            <div style="width: 60px;">
              <input type="number" class="form-control form-control-sm border-warning text-center" placeholder="Pts" value="0" min="0">
            </div>
            <button class="btn btn-sm btn-outline-primary border-0" title="Duplicar" onclick="duplicarAlternativa(this)"><i class="fas fa-copy"></i></button>
            <button class="btn btn-sm btn-outline-danger border-0" title="Eliminar" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
         \`;`;

const altTemplateC = `         div.className = "d-flex gap-2 align-items-center p-2 border rounded bg-white shadow-sm item-alt";
         div.innerHTML = \`
            <i class="fas fa-grip-vertical text-black-50 handle" style="cursor: grab;"></i>
            <div style="width: 80px;">
              <input type="text" class="form-control form-control-sm border-primary fw-bold text-center" placeholder="A, B...">
            </div>
            <div style="width: 100px;">
              <select class="form-select form-select-sm mpc-tipoalt bg-light text-muted" onchange="swMpcAlt(this)">
                 <option value="texto">Texto</option>
                 <option value="imagen">Imagen</option>
              </select>
            </div>
            <div class="flex-grow-1 mpc-dynamic-box">
               <input type="text" class="form-control form-control-sm border-primary" placeholder="Descripción de la alternativa...">
            </div>
            <div style="width: 60px;">
              <input type="number" class="form-control form-control-sm border-primary text-center" placeholder="Pts" value="0" min="0">
            </div>
            <button class="btn btn-sm btn-outline-primary border-0" title="Duplicar" onclick="duplicarAlternativa(this)"><i class="fas fa-copy"></i></button>
            <button class="btn btn-sm btn-outline-danger border-0" title="Eliminar" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
         \`;`;

// Inject into addMpaAlternativa
html = html.replace(
  /div\.className = "d-flex gap-2 align-items-center p-2 border rounded bg-white shadow-sm";[\s]*div\.innerHTML = `[\s\S]*?<\/button>\s*`;/g,
  (match) => {
    if (match.includes("border-warning")) return altTemplateA;
    if (match.includes("border-primary")) return altTemplateC;
    return match;
  },
);

const duplicarAlternativaCode = `      function duplicarAlternativa(btn) {
         const row = btn.closest('.d-flex');
         const clone = row.cloneNode(true);
         // Transfer select states
         const selOriginal = row.querySelector('select');
         const selClone = clone.querySelector('select');
         if(selOriginal && selClone) { selClone.value = selOriginal.value; }
         row.after(clone);
      }

      function swMpcAlt(sel) {`;
html = html.replace("function swMpcAlt(sel) {", duplicarAlternativaCode);

// Image select logic for alternatives:
html = html.replace(
  `c.innerHTML = '<input type="file" class="form-control form-control-sm border-primary p-0" accept="image/*">';`,
  `c.innerHTML = '<div class="d-flex"><input type="file" class="form-control form-control-sm border-secondary p-0 border-end-0" accept="image/*" style="border-radius: 4px 0 0 4px;"><select class="form-select form-select-sm px-1 border-secondary border-start-0 text-muted" style="width:90px; border-radius: 0 4px 4px 0"><option value="small">Pqñ</option><option value="medium" selected>Med</option><option value="large">Grd</option></select></div>';`,
);

// 5. Initialize SortableJS in renderizarControlesPregunta()
html = html.replace(
  `document.getElementById('mp_A_alternativas_box').innerHTML = '';`,
  `const bA = document.getElementById('mp_A_alternativas_box'); bA.innerHTML = ''; if(!bA.dataset.sortInit) { Sortable.create(bA, {handle: '.handle', animation: 150}); bA.dataset.sortInit = '1'; }`,
);
html = html.replace(
  `document.getElementById('mp_C_alternativas_box').innerHTML = '';`,
  `const bC = document.getElementById('mp_C_alternativas_box'); bC.innerHTML = ''; if(!bC.dataset.sortInit) { Sortable.create(bC, {handle: '.handle', animation: 150}); bC.dataset.sortInit = '1'; }`,
);

// 6. Populate Demo questions cleanly
const oldDemosteps = `          if (d.step >= 3) {
            pushItem(
              "boxPreg",
              "emptyPreg",
              rowPregunta(1, "¿Con qué frecuencia siente tensión muscular?"),
            );
            pushItem(
              "boxPreg",
              "emptyPreg",
              rowPregunta(2, "¿Experimenta dificultad para concentrarse?"),
            );
            pushItem(
              "boxPreg",
              "emptyPreg",
              rowPregunta(3, "¿Siente palpitaciones frecuentes?"),
            );
          }
          if (d.step >= 4) {
            pushItem(
              "boxFac",
              "emptyFac",
              rowFactor("FAC-001", "Ansiedad Somática"),
            );
            pushItem(
              "boxFac",
              "emptyFac",
              rowFactor("FAC-002", "Ansiedad Cognitiva"),
            );
          }
          if (d.step >= 5) {
            pushItem("boxResp", "emptyResp", rowRespuesta(1, "B", "FAC-001"));
            pushItem("boxResp", "emptyResp", rowRespuesta(2, "C", "FAC-002"));
            pushItem("boxResp", "emptyResp", rowRespuesta(3, "A", "FAC-001"));
          }`;

const newDemoSteps = `          if (d.step >= 2) { // 2 = 'Preguntas' tab since changes
            pushItem("boxPreg", "emptyPreg", rowPregunta(1, "¿Con qué frecuencia siente tensión muscular?", "cerrada"));
            pushItem("boxPreg", "emptyPreg", rowPregunta(2, "¿Dibuja a una persona bajo la lluvia?", "abierta"));
            pushItem("boxPreg", "emptyPreg", rowPregunta(3, "Indique los problemas que reconoce frecuentemente", "cerrada"));
          }
          if (d.step >= 3) { // Factores
            pushItem("boxFac", "emptyFac", rowFactor("FAC-001", "Ansiedad Somática"));
            pushItem("boxFac", "emptyFac", rowFactor("FAC-002", "Ansiedad Cognitiva"));
          }
          if (d.step >= 4) { // Respuestas
            pushItem("boxResp", "emptyResp", rowRespuesta(1, "B", "FAC-001"));
            pushItem("boxResp", "emptyResp", rowRespuesta(2, "C", "FAC-002"));
          }`;

html = html.replace(oldDemosteps, newDemoSteps);

fs.writeFileSync("index.html", html);
console.log("Great success on refinements");
