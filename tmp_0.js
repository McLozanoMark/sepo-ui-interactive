// ── Orden de Prestaciones ─────────────────────────────────
// (Drag & Drop e initDrag definidos más abajo en el bloque dedicado)

/* ── Mover ítem arriba/abajo ── */
function moverOrden(btn, dir) {
  const card = btn.closest(".card-item");
  if (!card) return;
  if (dir === "up" && card.previousElementSibling) {
    card.parentNode.insertBefore(card, card.previousElementSibling);
  } else if (dir === "down" && card.nextElementSibling) {
    card.parentNode.insertBefore(card.nextElementSibling, card);
  }
}

/* ── Añadir Prestación Automática al final ── */
function appendNuevaPrestacion() {
  const cod = document.getElementById("pCod")
    ? document.getElementById("pCod").value || "PR-NUEVO"
    : "PR-NUEVO";
  const desc = document.getElementById("pDesc")
    ? document.getElementById("pDesc").value || "Nueva Prestación"
    : "Nueva Prestación";
  const activo = document.getElementById("pEstado")
    ? document.getElementById("pEstado").value === "activo"
    : true;
  const statusHTML = activo
    ? '<span class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25" style="padding: 3px 6px; font-size: 0.7rem; font-weight: 500;">Activo</span>'
    : '<span class="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25" style="padding: 3px 6px; font-size: 0.7rem; font-weight: 500;">Inactivo</span>';

  const isComplementario =
    document.getElementById("pTipoExamen") &&
    document.getElementById("pTipoExamen").value === "complementario";
  const listaId = isComplementario ? "lista-complementario" : "lista-sepo";
  const lista = document.getElementById(listaId);
  if (!lista) return;

  const totalItems = lista.querySelectorAll(".card-item").length;
  const card = document.createElement("div");
  const bgStyle = isComplementario
    ? "background: #ffedd5; color: #c2410c;"
    : "background: #e0f2fe; color: var(--primary);";
  const iconClass = isComplementario
    ? "fas fa-helmet-safety"
    : "fas fa-heart-pulse";

  card.className = "card-item p-2 d-flex align-items-center shadow-sm mb-2";
  card.style.cssText =
    "gap: 1rem; border-radius: 8px; border: 1px solid var(--border-light); background: #fff;";
  card.innerHTML = `
    <div class="d-flex align-items-center gap-3 w-100 p-2">
      <div class="icon-box" style="background: #e3f2fd; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: 50%; flex-shrink: 0;">
        <i class="fas fa-file-medical text-primary" style="font-size: 1.2rem;"></i>
      </div>
      <div class="flex-grow-1 d-flex flex-column" style="min-width: 0;">
        <span class="fw-semibold text-dark" style="font-size: 1.1rem; line-height: 1.2;">${desc}</span>
        <div class="d-flex align-items-center gap-2 mt-1">
            <span class="text-muted fw-medium" style="font-size: 0.85rem;">${cod}</span>
            ${statusHTML}
        </div>
      </div>
      <div class="d-flex flex-column align-items-center gap-1 flex-shrink-0">
        <label class="fw-bold text-muted mb-0" style="font-size: 0.65rem; letter-spacing: 0.8px;">ORDEN</label>
        <div style="width: 60px; height: 60px; background: #fff; border: 2px solid var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(21, 101, 192, 0.1);">
            <input type="number" class="form-control form-control-sm text-center fw-bold text-primary border-0 bg-transparent p-0" onchange="reordenarPrestacion(this)" value="${totalItems + 1}" min="1" style="width: 60px; font-size: 1.25rem;">
        </div>
      </div>
    </div>`;

  lista.appendChild(card);
  if (typeof initDrag === "function") initDrag(card);
}

/* ── Modal: Añadir Prestación al Orden ── */
let _grupoOrdenActivo = "principal";

function abrirAddPrestOrden(grupo) {
  _grupoOrdenActivo = grupo;
  const lbl = document.getElementById("lblGrupoOrden");
  if (lbl)
    lbl.textContent =
      grupo === "principal"
        ? "Añadiendo a: Examen Principal"
        : "Añadiendo a: Exámenes Complementarios";
  const inp = document.getElementById("inputBuscadorPrestOrden");
  if (inp) inp.value = "";
  // Mostrar todos los items del listado
  document
    .querySelectorAll("#listaPrestOrden .item-row")
    .forEach((r) => (r.style.display = ""));
}

function filtrarListaPrestOrden(query) {
  const q = query.toLowerCase();
  document.querySelectorAll("#listaPrestOrden .item-row").forEach((row) => {
    const txt = row.textContent.toLowerCase();
    row.style.display = txt.includes(q) ? "" : "none";
  });
}

function confirmarAddPrestOrden(cod, nombre) {
  const lista = document.getElementById(
    _grupoOrdenActivo === "principal" ? "lista-sepo" : "lista-complementario",
  );
  if (!lista) return;
  const icoBg = _grupoOrdenActivo === "principal" ? "#e0f2fe" : "#ffedd5";
  const icoCol =
    _grupoOrdenActivo === "principal" ? "var(--primary)" : "#c2410c";
  const icoClass =
    _grupoOrdenActivo === "principal" ? "fa-heart-pulse" : "fa-helmet-safety";
  const tarjeta = document.createElement("div");
  tarjeta.className = "card-item";
  initDrag(tarjeta);
  tarjeta.innerHTML = `
    <div class="d-flex align-items-center gap-3 w-100 p-2">
      <div class="icon-box" style="background: #e3f2fd; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: 50%; flex-shrink: 0;">
        <i class="fas fa-file-medical text-primary" style="font-size: 1.2rem;"></i>
      </div>
      <div class="flex-grow-1 d-flex flex-column" style="min-width: 0;">
        <span class="fw-semibold text-dark" style="font-size: 1.1rem; line-height: 1.2;">${nombre}</span>
        <div class="d-flex align-items-center gap-2 mt-1">
            <span class="text-muted fw-medium" style="font-size: 0.85rem;">${cod}</span>
            <span class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-10" style="font-size: 0.7rem;">Activo</span>
        </div>
        <div class="mt-2">
             <button class="btn btn-sm btn-outline-primary" style="font-size:0.75rem; padding: 2px 8px; border-radius: 4px;"
               data-bs-toggle="modal" data-bs-target="#modalOrdenPruebas"
               onclick="abrirOrdenPruebas('${cod}', false)">
               <i class="fas fa-sort me-1"></i>Orden de Pruebas
             </button>
        </div>
      </div>
      <div class="d-flex flex-column align-items-center gap-1 flex-shrink-0">
        <label class="fw-bold text-muted mb-0" style="font-size: 0.65rem; letter-spacing: 0.8px;">ORDEN</label>
        <div style="width: 60px; height: 60px; background: #fff; border: 2px solid var(--primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(21, 101, 192, 0.1);">
            <input type="number" class="form-control form-control-sm text-center fw-bold text-primary border-0 bg-transparent p-0" onchange="reordenarPrestacion(this)" value="${lista.querySelectorAll(".card-item").length + 1}" min="1" style="width: 60px; font-size: 1.25rem;">
        </div>
      </div>
    </div>`;
  lista.appendChild(tarjeta);
  // Cerrar modal
  const modal = bootstrap.Modal.getInstance(
    document.getElementById("modalAddPrestOrden"),
  );
  if (modal) modal.hide();
  showToast("✅ Prestación añadida al orden correctamente.");
}

/* ── Modal: Orden de Pruebas ── */
const _pruebasPorGrupo = {
  "GO-001": [
    { cod: "PSI-ANS-001", nom: "Escala de Ansiedad de Beck" },
    { cod: "PSI-CMP-002", nom: "Competencias Laborales Volcán" },
  ],
  "GO-002": [
    { cod: "PSI-ALT-003", nom: "Evaluación Psicológica – Altura" },
    { cod: "PSI-ANS-001", nom: "Escala de Ansiedad de Beck" },
    { cod: "PSI-CHI-004", nom: "Entrevista Psicológica Chinalco" },
  ],
  "GO-003": [
    { cod: "PSI-CHI-004", nom: "Entrevista Psicológica Chinalco" },
    { cod: "PSI-CMP-002", nom: "Competencias Laborales Volcán" },
    { cod: "PSI-ALT-003", nom: "Evaluación Psicológica – Altura" },
  ],
};

function abrirOrdenPruebas(codPrest, depGrupo) {
  // Actualizar título del modal
  const titulo = document.getElementById("tOrdenPruebas");
  if (titulo)
    titulo.innerHTML =
      '<i class="fas fa-sort me-2 text-primary"></i>Orden de Pruebas — ' +
      codPrest;

  const sg = document.getElementById("selectorGrupoOrden");
  const listaSepo = document.getElementById("lista-sepo");
  const listaComp = document.getElementById("lista-complementario");

  if (depGrupo) {
    // Mostrar selector de grupo, ocultar listas
    if (sg) sg.style.display = "block";
    if (listaSepo) listaSepo.innerHTML = "";
    if (listaComp) listaComp.innerHTML = "";
    const sel = document.getElementById("selectGrupoOrden");
    if (sel) sel.value = "";
  } else {
    // Mostrar listas directamente con pruebas pre-cargadas
    if (sg) {
      sg.style.display = "none";
    }

    // Distribución Demo: SEPO
    if (listaSepo) {
      listaSepo.innerHTML = `
              <div class="card-item item-row p-3 border rounded shadow-sm bg-white d-flex flex-column" style="margin-bottom: 12px;">
                <div class="d-flex align-items-center gap-3 w-100">
                  <div class="icon-box" style="background: #f8fafc; border: 1px solid var(--border-light); width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: 12px; flex-shrink: 0;">
                    <i class="fas fa-file-medical-alt text-primary opacity-75" style="font-size: 1.25rem;"></i>
                  </div>
                  <div class="flex-grow-1 d-flex flex-column" style="min-width: 0;">
                    <span style="font-size: 1.1rem; font-weight: 600; color: var(--text-main); line-height: 1.35; display: block;">Evaluación Psicológica - Entrevista</span>
                    <div class="small text-muted mt-1"><i class="fas fa-tags me-1"></i> Factores: [Atención, Lógica, Estabilidad]</div>
                    <small class="text-muted fw-medium mt-1" style="font-size: 0.78rem;">PR-PSI-001</small>
                  </div>
                  <div class="d-flex flex-column align-items-center gap-1 flex-shrink-0">
                    <span style="font-size: 0.65rem; font-weight: 700; color: var(--text-main); letter-spacing: 0.5px;">ORDEN</span>
                    <input type="number" class="form-control text-center fw-bold text-primary border-primary shadow-sm" style="width: 58px; height: 44px; border-radius: 10px; font-size: 1.1rem; background-color: #fff;" value="1" min="1" onchange="reordenarPrestacion(this)">
                  </div>
                </div>
              </div>`;
      listaSepo.querySelectorAll(".card-item").forEach(initDrag);
    }

    // Distribución Demo: COMPLEMENTARIOS
    if (listaComp) {
      listaComp.innerHTML = `
              <div class="card-item item-row p-3 border rounded shadow-sm bg-white d-flex flex-column" style="margin-bottom: 12px;">
                <div class="d-flex align-items-center gap-3 w-100">
                  <div class="icon-box" style="background: #f8fafc; border: 1px solid var(--border-light); width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: 12px; flex-shrink: 0;">
                    <i class="fas fa-file-medical-alt text-primary opacity-75" style="font-size: 1.25rem;"></i>
                  </div>
                  <div class="flex-grow-1 d-flex flex-column" style="min-width: 0;">
                    <span style="font-size: 1.1rem; font-weight: 600; color: var(--text-main); line-height: 1.35; display: block;">Competencias Laborales Volcán</span>
                    <div class="small text-muted mt-1"><i class="fas fa-tags me-1"></i> Factores: [Atención, Lógica, Estabilidad]</div>
                    <small class="text-muted fw-medium mt-1" style="font-size: 0.78rem;">PSI-CMP-002</small>
                  </div>
                  <div class="d-flex flex-column align-items-center gap-1 flex-shrink-0">
                    <span style="font-size: 0.65rem; font-weight: 700; color: var(--text-main); letter-spacing: 0.5px;">ORDEN</span>
                    <input type="number" class="form-control text-center fw-bold text-primary border-primary shadow-sm" style="width: 58px; height: 44px; border-radius: 10px; font-size: 1.1rem; background-color: #fff;" value="1" min="1" onchange="reordenarPrestacion(this)">
                  </div>
                </div>
              </div>`;
      listaComp.querySelectorAll(".card-item").forEach(initDrag);
    }
  }
}

function cargarPruebasOrden() {
  const grupo = document.getElementById("selectGrupoOrden")?.value;
  const listaSepo = document.getElementById("lista-sepo");
  const listaComp = document.getElementById("lista-complementario");
  if (!grupo || !listaSepo || !listaComp) return;

  const pruebas = _pruebasPorGrupo[grupo] || [];
  if (pruebas.length === 0) {
    listaSepo.innerHTML = "";
    listaComp.innerHTML = "";
    return;
  }

  // Helper template
  const getCardHTML = (p, index) => `
          <div class="card-item item-row p-3 border rounded shadow-sm bg-white d-flex flex-column" style="margin-bottom: 12px;">
              <div class="d-flex align-items-center gap-3 w-100">
                  <div class="icon-box" style="background: #f8fafc; border: 1px solid var(--border-light); width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: 12px; flex-shrink: 0;">
                      <i class="fas fa-file-medical-alt text-primary opacity-75" style="font-size: 1.2rem;"></i>
                  </div>
                  <div class="flex-grow-1 d-flex flex-column" style="min-width: 0;">
                      <span style="font-size: 1.1rem; font-weight: 600; color: var(--text-main); line-height: 1.35; display: block;">${p.nom || p.descripcion || "Prestación sin nombre"}</span>
                      <div class="small text-muted mt-1"><i class="fas fa-tags me-1"></i> Factores: [Atención, Lógica, Estabilidad]</div>
                      <small class="text-muted fw-medium mt-1" style="font-size: 0.78rem;">${p.cod}</small>
                  </div>
                  <div class="d-flex flex-column align-items-center gap-1 flex-shrink-0">
                      <span style="font-size: 0.65rem; font-weight: 700; color: var(--text-main); letter-spacing: 0.5px;">ORDEN</span>
                      <input type="number" class="form-control text-center fw-bold text-primary border-primary shadow-sm" onchange="reordenarPrestacion(this)" value="${index + 1}" min="1" style="width: 58px; height: 44px; border-radius: 10px; font-size: 1.1rem; background-color: #fff;">
                  </div>
              </div>
          </div>`;

  // Demo split: Half in SEPO, half in Complementarios
  const half = Math.ceil(pruebas.length / 2);
  const sepoPruebas = pruebas.slice(0, half);
  const compPruebas = pruebas.slice(half);

  listaSepo.innerHTML = sepoPruebas.map((p, i) => getCardHTML(p, i)).join("");
  listaComp.innerHTML = compPruebas
    .map((p, i) => getCardHTML(p, i + half))
    .join("");

  listaSepo.querySelectorAll(".card-item").forEach(initDrag);
  listaComp.querySelectorAll(".card-item").forEach(initDrag);
}

// Inicializar drag & drop en los card-item existentes al cargar la página
document.addEventListener("DOMContentLoaded", function () {
  document
    .querySelectorAll(
      "#lista-sepo .card-item, #lista-complementario .card-item",
    )
    .forEach(initDrag);
});
