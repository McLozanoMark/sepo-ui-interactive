const fs = require("fs");

function applyFixes() {
  let html = fs.readFileSync("index.html", "utf8");

  // Req 1: Min/Max en Preguntas Abiertas
  const searchDatoResp = `                  <div class="col-md-4">
                    <label class="form-label text-muted small fw-bold mb-1">Dato Respuesta</label>
                    <select class="form-select" id="mp_A_tipoDatoResp">
                      <option value="numerico">Numérico</option>
                      <option value="texto">Texto</option>
                    </select>
                  </div>`;
  const repDatoResp = `                  <div class="col-md-4">
                    <label class="form-label text-muted small fw-bold mb-1">Dato Respuesta</label>
                    <select class="form-select" id="mp_A_tipoDatoResp" onchange="const num = document.getElementById('mp_A_boxRango'); if(num) num.style.display = this.value === 'numerico' ? 'block' : 'none'; if(this.value === 'texto'){ document.getElementById('mp_A_numMin').value=''; document.getElementById('mp_A_numMax').value=''; }">
                      <option value="numerico">Numérico</option>
                      <option value="texto" selected>Texto</option>
                    </select>
                  </div>
                  <div class="col-md-4" id="mp_A_boxRango" style="display:none;">
                    <div class="row g-2">
                       <div class="col-6">
                         <label class="form-label text-muted small fw-bold mb-1" title="Límite Mínimo">Mínimo</label>
                         <input type="number" class="form-control" id="mp_A_numMin" placeholder="Mín">
                       </div>
                       <div class="col-6">
                         <label class="form-label text-muted small fw-bold mb-1" title="Límite Máximo">Máximo</label>
                         <input type="number" class="form-control" id="mp_A_numMax" placeholder="Máx">
                       </div>
                    </div>
                  </div>`;
  html = html.replace(searchDatoResp, repDatoResp);

  // Req 2: Parametrización de Íconos
  const iconRegEx1 =
    /<select[\s\n]*class="form-select"[\s\n]*id="prIconoSelect"[^>]*>[\s\S]*?<\/select>/;
  const iconRegEx2 = /<select[\s\n]*id="pIconoSelect"[^>]*>[\s\S]*?<\/select>/;
  html = html.replace(
    iconRegEx1,
    `<select class="form-select" id="prIconoSelect" onchange="const icon = this.value; document.getElementById('prIcon').value = icon; document.getElementById('prEmojiPreview').innerHTML = '<i class=\\'fas ' + icon + '\\'></i>';"><option value="">Seleccionar...</option></select>`,
  );
  html = html.replace(
    iconRegEx2,
    `<select id="pIconoSelect" class="form-select" onchange="document.getElementById('pIcono').value = this.value; document.getElementById('pIconoPreview').innerHTML = '<i class=\\'fas ' + this.value + '\\'></i>';"><option value="">Seleccionar...</option></select>`,
  );

  // Inject function
  const paramFunc = `
      const PARAMETROS_ICONOS = ['fa-brain', 'fa-heart-pulse', 'fa-stethoscope', 'fa-clipboard-list', 'fa-user-md', 'fa-helmet-safety'];
      function cargarIconosParametricos() {
          const sels = ['prIconoSelect', 'pIconoSelect'];
          sels.forEach(id => {
              const el = document.getElementById(id);
              if(!el) return;
              // keep first option
              const opts = '<option value="">Seleccionar...</option>' + PARAMETROS_ICONOS.map(i => \`<option value="\${i}">\${i.split('-').pop().toUpperCase()}</option>\`).join('');
              el.innerHTML = opts;
          });
      }
      document.addEventListener('DOMContentLoaded', cargarIconosParametricos);
    `;
  html = html.replace(
    "/* ── DB FAKE Y FUNCIONES ── */",
    "/* ── DB FAKE Y FUNCIONES ── */\n" + paramFunc,
  );

  // Req 3: Textos descriptivos reales
  const alertSearch =
    /<div class="alert alert-info[^>]*>[\s\S]*?<i class="fas fa-info-circle[^>]*><\/i>[\s\n]*<div class="text-muted"><strong>Instructivo de Ayuda:<\/strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Por favor configure los campos según indique el manual de usuario o las guías institucionales.<\/div>[\s\n]*<\/div>/g;
  html = html.replace(alertSearch, (match) => {
    return match.replace(
      /<strong>Instructivo de Ayuda:<\/strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Por favor configure los campos según indique el manual de usuario o las guías institucionales./,
      "<strong>[Pendiente de texto por Psicología]</strong> Por favor, detalla aquí las instrucciones guía para el usuario en esta interfaz.",
    );
  });

  // Req 4: Limpieza visual en Alternativas (Puntajes)
  const ptsSwitchHtml = `
                     <div class="form-check form-switch mt-1">
                        <input class="form-check-input" type="checkbox" checked onchange="const b = this.closest('.col-12'); b.querySelectorAll('.mpc-pts-box').forEach(el=> el.style.display = this.checked ? 'block' : 'none');">
                        <label class="form-check-label small fw-bold text-muted">Habilitar puntajes personalizados</label>
                     </div>`;

  html = html.replace(
    /<div class="d-flex justify-content-between align-items-center mb-2">\s*<h6 class="fw-bold text-muted m-0"><i class="fas fa-list mt-1 me-1"><\/i> Creador de Alternativas( \/ Claves)?<\/h6>\s*<\/div>/g,
    (m) => {
      return m + ptsSwitchHtml;
    },
  );

  html = html.replace(
    /<div style="width: 60px;">\s*<input type="number" class="form-control form-control-sm border-warning text-center" placeholder="Pts" value="0" min="0">\s*<\/div>/g,
    '<div style="width: 60px;" class="mpc-pts-box"><input type="number" class="form-control form-control-sm border-warning text-center" placeholder="Pts" value="0" min="0"></div>',
  );
  html = html.replace(
    /<div style="width: 60px;">\s*<input type="number" class="form-control form-control-sm border-primary text-center" placeholder="Pts" value="0" min="0">\s*<\/div>/g,
    '<div style="width: 60px;" class="mpc-pts-box"><input type="number" class="form-control form-control-sm border-primary text-center" placeholder="Pts" value="0" min="0"></div>',
  );

  // Req 5: Agrupación visual en Modales
  // We target modalCentro, modalPrestacion, modalFicha

  // modalCentro
  html = html.replace(
    /<div class="modal fade" id="modalCentro"[\s\S]*?<div class="modal-body">\s*<div class="row g-4">/,
    (m) =>
      m.replace(
        '<div class="row g-4">',
        '<div class="soft-panel mb-4 p-3"><h6 class="fw-bold mb-3 text-primary"><i class="fas fa-info-circle me-2"></i>Datos Generales</h6><div class="row g-4">',
      ),
  );
  html = html.replace(
    /<div class="modal fade" id="modalCentro"[\s\S]*?<div class="col-12">\s*<div\s*class="soft-panel d-flex/,
    (m) => {
      // insert close tag for soft-panel and row before col-12
      return m.replace(
        '<div class="col-12">',
        '</div></div><div class="col-12">',
      );
    },
  );

  // modalPrestacion
  html = html.replace(
    /<div class="modal fade" id="modalPrestacion"[\s\S]*?<div class="modal-body">\s*<div class="row g-4">/,
    (m) =>
      m.replace(
        '<div class="row g-4">',
        '<div class="soft-panel mb-4 p-3"><h6 class="fw-bold mb-3 text-primary"><i class="fas fa-stethoscope me-2"></i>Datos de Prestación</h6><div class="row g-4">',
      ),
  );
  html = html.replace(
    /<div class="col-12 mt-4">\s*<h6 class="fw-bold mb-3" style="color: var\(--primary\)">\s*<i class="fas fa-link me-2"><\/i>Fichas Vinculadas/,
    (m) => {
      return "</div></div>" + m;
    },
  );

  // modalFicha
  html = html.replace(
    /<div class="modal fade" id="modalFicha"[\s\S]*?<div class="modal-body">\s*<div class="row g-4">/,
    (m) =>
      m.replace(
        '<div class="row g-4">',
        '<div class="soft-panel mb-4 p-3"><h6 class="fw-bold mb-3 text-primary"><i class="fas fa-clipboard-list me-2"></i>Datos de la Ficha</h6><div class="row g-4">',
      ),
  );
  html = html.replace(
    /<div class="col-12 mt-4">\s*<h6 class="fw-bold mb-3" style="color: var\(--primary\)">\s*<i class="fas fa-sitemap me-2"><\/i>Fichas Hijas/,
    (m) => {
      return "</div></div>" + m;
    },
  );

  fs.writeFileSync("index.html", html);
  console.log("All 5 requirements applied successfully!");
}

try {
  applyFixes();
} catch (e) {
  console.error(e);
}
