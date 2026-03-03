const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");

// 1. Remove stepper-item 3 (Alternativas)
const stepperItemRegex =
  /<div class="stepper-item" onclick="goStep\(3\)">\s*<div class="stepper-num pend" id="snum-3">4<\/div>\s*<div>\s*<div class="stepper-label">Alternativas<\/div>\s*<div class="stepper-sub">Opciones de respuesta<\/div>\s*<\/div>\s*<\/div>/g;
html = html.replace(stepperItemRegex, "");

// 2. Renumber stepper-item 4 and 5
html = html.replace(/onclick="goStep\(4\)"/g, 'onclick="goStep(3)"');
html = html.replace(/id="snum-4">5<\/div>/g, 'id="snum-3">4</div>');
html = html.replace(/onclick="goStep\(5\)"/g, 'onclick="goStep(4)"');
html = html.replace(/id="snum-5">6<\/div>/g, 'id="snum-4">5</div>');

// 3. Remove tab-pane-custom id="step-3" (Alternativas)
const step3Regex =
  /<!-- PASO 3 -->[\s\S]*?<div class="tab-pane-custom" id="step-3">[\s\S]*?<!-- PASO 4 -->/;
// Oh wait, step-3 contains `<div class="tab-pane-custom" id="step-3">` until `<!-- PASO 4 -->`.
// I'll grab precisely from "<!-- PASO 3 -->" to just before "<!-- PASO 4 -->".
html = html.replace(/<!-- PASO 3 -->[\s\S]*?(?=<!-- PASO 4 -->)/, "");

// 4. Renumber PASO 4 and PASO 5 to PASO 3 and PASO 4
html = html.replace(/<!-- PASO 4 -->/g, "<!-- PASO 3 -->");
html = html.replace(/id="step-4"/g, 'id="step-3"');
html = html.replace(/<!-- PASO 5 -->/g, "<!-- PASO 4 -->");
html = html.replace(/id="step-5"/g, 'id="step-4"');

// 5. Update addMpcAlternativa function to resemble SEPO details: `clave, describe, pts`
const addMpcRegex =
  /function addMpcAlternativa\(\) \{[\s\S]*?function swMpcAlt\(sel\) \{[\s\S]*?\}/;
const newAddMpc = `function addMpcAlternativa() {
         const box = document.getElementById('mp_C_alternativas_box');
         const div = document.createElement('div');
         div.className = "d-flex gap-2 align-items-center p-2 border rounded bg-white shadow-sm";
         div.innerHTML = \`
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
            <div style="width: 70px;">
              <input type="number" class="form-control form-control-sm border-primary text-center" placeholder="Pts" value="0" min="0">
            </div>
            <button class="btn btn-sm btn-outline-danger border-0" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
         \`;
         box.appendChild(div);
      }

      function swMpcAlt(sel) {
         const c = sel.parentElement.nextElementSibling;
         if(sel.value === 'texto') {
            c.innerHTML = '<input type="text" class="form-control form-control-sm border-primary" placeholder="Descripción de la alternativa...">';
         } else {
            c.innerHTML = '<input type="file" class="form-control form-control-sm border-primary p-0" accept="image/*">';
         }
      }`;
html = html.replace(addMpcRegex, newAddMpc);

fs.writeFileSync("index.html", html);
console.log("Fixed alternates tab");
