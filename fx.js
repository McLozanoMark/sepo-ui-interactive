const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");

// First, scrub out the existing alert boxes that I incorrectly inserted before
// These are identified by having `alert-info` ... `Instructivo de Ayuda`

const regexScrub =
  /\s*<div class="alert alert-info py-2 mt-3 mb-0 bg-opacity-10 d-flex align-items-center small border-0 shadow-sm" style="border-left: 4px solid #0dcaf0 !important;">\s*<i class="fas fa-info-circle me-3 fs-5 text-info"><\/i>\s*<div class="text-muted"><strong>Instructivo de Ayuda:<\/strong>[\s\S]*?<\/div>\s*<\/div>/g;
html = html.replace(regexScrub, "");

// There is also one that has a different text for modalities "por favor complete los campos..."
const mRegexScrub =
  /\s*<div class="alert alert-info py-2 mt-0 mb-3 mx-3 bg-opacity-10 d-flex align-items-center small border-0 shadow-sm" style="border-left: 4px solid #0dcaf0 !important;">\s*<i class="fas fa-info-circle me-3 fs-5 text-info"><\/i>\s*<div class="text-muted"><strong>Instructivo de Ayuda:<\/strong>[\s\S]*?<\/div>\s*<\/div>/g;
html = html.replace(mRegexScrub, "");

// Also clean up any other leftover from the very first attempt (which had diff classes):
const firstRegexScrub =
  /\s*<div class="alert alert-info py-2 mt-0 mb-3 bg-opacity-10 d-flex align-items-center small border-0 shadow-sm" style="border-left: 4px solid #0dcaf0 !important;">\s*<i class="fas fa-info-circle me-3 fs-5 text-info"><\/i>\s*<div class="text-muted"><strong>Instructivo para nueva configuración:<\/strong>[\s\S]*?<\/div>\s*<\/div>/g;
html = html.replace(firstRegexScrub, "");
const secondRegexScrub =
  /\s*<div class="alert alert-info py-2 mt-0 mb-4 bg-opacity-10 d-flex align-items-center small border-0 shadow-sm" style="border-left: 4px solid #0dcaf0 !important;">\s*<i class="fas fa-info-circle me-3 fs-5 text-info"><\/i>\s*<div class="text-muted"><strong>Instructivo de Configuración de Preguntas:<\/strong>[\s\S]*?<\/div>\s*<\/div>/g;
html = html.replace(secondRegexScrub, "");

const thirdRegexScrub =
  /\s*<div class="alert alert-info mx-4 mt-4 mb-0 py-2 bg-opacity-10 d-flex align-items-center small border-0 shadow-sm" style="border-left: 4px solid #0dcaf0 !important;">\s*<i class="fas fa-info-circle me-3 fs-5 text-info"><\/i>\s*<div class="text-muted"><strong>Instructivo de Ayuda:<\/strong>[\s\S]*?<\/div>\s*<\/div>/g;
html = html.replace(thirdRegexScrub, "");

// Now let's carefully inject the single correct "Instructivo de Ayuda" block in only ONE place (Pruebas Psicológicas)
// and in the exact DOM position needed to be full-width AT THE BOTTOM of the .page-header.

const instructivoHtml = `
          <div class="alert alert-info py-2 mt-2 mb-0 bg-opacity-10 d-flex align-items-center small border-0 shadow-sm w-100" style="border-left: 4px solid #0dcaf0 !important;">
            <i class="fas fa-info-circle me-3 fs-5 text-info"></i>
            <div class="text-muted"><strong>Instructivo de Ayuda:</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Por favor configure los campos según indique el manual de usuario o las guías institucionales.</div>
          </div>`;

// Find the page-header of screen-pruebas and insert it as the third child div
const pruebMatch =
  /(<div class="screen" id="screen-pruebas">\s*<div class="page-header">\s*<div>\s*<h1 class="page-title">[\s\S]*?<\/h1>\s*<p class="page-subtitle">[\s\S]*?<\/p>\s*<\/div>\s*<div class="d-flex gap-3 align-items-center">\s*<div class="search-wrap">[\s\S]*?<\/div>\s*<button[\s\S]*?nuevaPrueba\(\)[\s\S]*?<\/button>\s*<\/div>)/;
html = html.replace(pruebMatch, `$1${instructivoHtml}`);

// And inject it for "Nueva Prueba Psicológica" too (screen-prueba-form)
const nuevaPruebaMatch =
  /(<div class="screen" id="screen-prueba-form">\s*<div class="page-header">\s*<div>\s*<h1 class="page-title" id="tPrueba">[\s\S]*?<\/h1>\s*<p class="page-subtitle">Configuración de prueba psicológica<\/p>\s*<\/div>\s*<div class="d-flex gap-3 align-items-center">\s*<button[\s\S]*?<\/button>\s*<button[\s\S]*?<\/button>\s*<\/div>)/;
html = html.replace(nuevaPruebaMatch, `$1${instructivoHtml}`);

// Restoring the modal alert for Step-2
const step2Insert = `
                <div class="tab-pane-custom" id="step-2">
                  <div class="alert alert-info py-2 mt-0 mb-4 bg-opacity-10 d-flex align-items-center small border-0 shadow-sm" style="border-left: 4px solid #0dcaf0 !important;">
                    <i class="fas fa-info-circle me-3 fs-5 text-info"></i>
                    <div class="text-muted"><strong>Instructivo de Configuración de Preguntas:</strong> Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
                  </div>`;
html = html.replace(/(<div class="tab-pane-custom" id="step-2">)/, step2Insert);

fs.writeFileSync("index.html", html);
console.log("Fixed correctly");
