const fs = require("fs");

const htmlFile = "index.html";
let html = fs.readFileSync(htmlFile, "utf8");

// 1. Constante de la alerta
const alertBanner = `<div class="alert alert-info py-2 mt-0 mb-3 bg-opacity-10 d-flex align-items-center small border-0 shadow-sm" style="border-left: 4px solid #0dcaf0 !important;">
  <i class="fas fa-info-circle me-3 fs-5 text-info"></i>
  <div class="text-muted"><strong>[Pendiente de texto por Psicología]</strong> Por favor, detalla aquí las instrucciones guía para el usuario en esta interfaz.</div>
</div>`;

// 2. Modales a intervenir
const modales = ["modalSimple", "modalCentro", "modalPrestacion", "modalFicha"];

// 3. Proceso mediante Regex
modales.forEach((modalId) => {
  // Escapa correctamente para match y agrupamiento.
  // Capturamos todo el patrón inicial hasta el cierre del modal-body
  const regex = new RegExp(
    `(<div class="modal fade" id="${modalId}"[\\s\\S]*?<div class="modal-body">\\s*)`,
    "g",
  );

  // Inyectamos el componente capturado ($1) seguido del banner
  html = html.replace(regex, `$1${alertBanner}\n            `);
});

fs.writeFileSync(htmlFile, html, "utf8");
console.log(
  "¡Inyección de Banners de Alerta finalizada con éxito en los 4 modales!",
);
