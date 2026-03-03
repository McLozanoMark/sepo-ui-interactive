const fs = require("fs");

let html = fs.readFileSync("index.html", "utf8");

const regexAlert =
  /<strong>Instructivo de Ayuda:<\/strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Por favor configure los campos según indique el manual de usuario o las guías institucionales./g;
html = html.replace(
  regexAlert,
  "<strong>[Pendiente de texto por Psicología]</strong> Por favor, detalla aquí las instrucciones guía para el usuario en esta interfaz.",
);

// Replace Soft panel grouping in Modal
const modalCentro =
  /<div class="modal fade" id="modalCentro"[\s\S]*?<div class="modal-body">\s*<div class="row g-4">/;
html = html.replace(modalCentro, (m) =>
  m.replace(
    '<div class="row g-4">',
    '<div class="soft-panel mb-4 p-3"><h6 class="fw-bold mb-3 text-primary"><i class="fas fa-info-circle me-2"></i>Datos Generales</h6><div class="row g-4">',
  ),
);

html = html.replace(
  /<div class="modal fade" id="modalCentro"[\s\S]*?<div class="col-12">\s*<div\s*class="soft-panel d-flex/,
  (m) => {
    return m.replace(
      '<div class="col-12">',
      '</div></div><div class="col-12">',
    );
  },
);

const modalPrest =
  /<div class="modal fade" id="modalPrestacion"[\s\S]*?<div class="modal-body">\s*<div class="row g-4">/;
html = html.replace(modalPrest, (m) =>
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

const modalFich =
  /<div class="modal fade" id="modalFicha"[\s\S]*?<div class="modal-body">\s*<div class="row g-4">/;
html = html.replace(modalFich, (m) =>
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
console.log("Fixed Modals and Alerts!");
