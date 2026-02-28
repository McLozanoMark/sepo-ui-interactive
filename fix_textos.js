const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");

const hText = `
            <div class="alert alert-info py-2 mt-3 mb-0 bg-opacity-10 d-flex align-items-center small border-0 shadow-sm" style="border-left: 4px solid #0dcaf0 !important;">
              <i class="fas fa-info-circle me-3 fs-5 text-info"></i>
              <div class="text-muted"><strong>Instructivo de Ayuda:</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Por favor configure los campos según indique el manual de usuario o las guías institucionales.</div>
            </div>`;

const mText = `
          <div class="alert alert-info py-2 mt-0 mb-3 mx-3 bg-opacity-10 d-flex align-items-center small border-0 shadow-sm" style="border-left: 4px solid #0dcaf0 !important;">
              <i class="fas fa-info-circle me-3 fs-5 text-info"></i>
              <div class="text-muted"><strong>Instructivo de Ayuda:</strong> Lorem ipsum dolor sit amet, por favor complete los campos de este mantenimiento.</div>
          </div>`;

// Replace specifically inside page-header left column, right after page-subtitle
html = html.replace(/(<p class="page-subtitle">[\s\S]*?<\/p>)/g, `$1${hText}`);

// For Modals, let's insert the mText at the top of their modal-body
html = html.replace(/(<div class="modal-body[\s\S]*?">)/g, `$1${mText}`);

// For Nueva Prueba Psicologica specifically
html = html.replace(
  /(<p class="text-muted mb-0 small">Configuración de prueba psicológica<\/p>\s*<\/div>)/g,
  `$1${hText}`,
);

fs.writeFileSync("index.html", html);
console.log("Done!");
