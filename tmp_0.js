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
  "GO-001": {
    "nombre": "Administrativos",
    "clasificaciones": {
      "Exámenes Clínicos": [
        { cod: "MED-CLIN-001", nom: "Evaluación Médica Ocupacional Anual" },
        { cod: "MED-CLIN-002", nom: "Examen Físico Completo" },
        { cod: "MED-OFT-001", nom: "Evaluación Agudeza Visual" },
        { cod: "MED-OFT-002", nom: "Test de Visión de Colores (Ishihara)" },
        { cod: "MED-AUD-001", nom: "Audiometría de Tamizaje" }
      ],
      "Pruebas Psicológicas": [
        { cod: "PSI-ANS-001", nom: "Escala de Ansiedad de Beck" },
        { cod: "PSI-EST-001", nom: "Cuestionario de Estrés Laboral" },
        { cod: "PSI-COG-001", nom: "Test de Atención y Concentración (Toulouse)" },
        { cod: "PSI-INT-001", nom: "Test de Inteligencia Emocional" },
        { cod: "PSI-PER-001", nom: "Inventario de Personalidad (NEO-PI)" },
        { cod: "PSI-BUR-001", nom: "Inventario de Burnout de Maslach" }
      ],
      "Exámenes Complementarios": [
        { cod: "COMP-LAB-001", nom: "Hemograma Completo" },
        { cod: "COMP-LAB-002", nom: "Perfil Lipídico" },
        { cod: "COMP-LAB-003", nom: "Examen Completo de Orina" },
        { cod: "COMP-LAB-004", nom: "Glucosa en Ayunas" },
        { cod: "COMP-CARD-001", nom: "Electrocardiograma en Reposo" }
      ]
    }
  },
  "GO-002": {
    "nombre": "Operarios",
    "clasificaciones": {
      "Exámenes Clínicos, Odontológicos y Especializados": [
        { cod: "MED-CLIN-001", nom: "Evaluación Médica Ocupacional Anual" },
        { cod: "MED-OSTE-001", nom: "Evaluación Músculo Esquelética" },
        { cod: "MED-AUD-002", nom: "Audiometría Clínica" },
        { cod: "MED-OFT-001", nom: "Evaluación Agudeza Visual" },
        { cod: "MED-OFT-002", nom: "Test de Visión de Colores" },
        { cod: "MED-OFT-003", nom: "Test de Profundidad (Estereopsis)" },
        { cod: "MED-ODO-001", nom: "Odontograma Anual" },
        { cod: "MED-NEU-001", nom: "Examen Neurológico Básico" }
      ],
      "Pruebas Psicológicas": [
        { cod: "PSI-ALT-003", nom: "Evaluación Psicológica – Altura" },
        { cod: "PSI-ANS-001", nom: "Escala de Ansiedad de Beck" },
        { cod: "PSI-CHI-004", nom: "Entrevista Psicológica Chinalco" },
        { cod: "PSI-SEG-001", nom: "Test de Actitud hacia la Seguridad" },
        { cod: "PSI-FAT-001", nom: "Test de Fatiga y Somnolencia" },
        { cod: "PSI-COG-002", nom: "Test de Memoria Visual" },
        { cod: "PSI-MOT-001", nom: "Test de Coordinación Visomotriz" }
      ],
      "Laboratorio e Imágenes": [
        { cod: "COMP-LAB-001", nom: "Hemograma Completo" },
        { cod: "COMP-LAB-005", nom: "Grupo Sanguíneo y Factor Rh" },
        { cod: "COMP-LAB-006", nom: "Perfil Hepático" },
        { cod: "COMP-LAB-007", nom: "Plomo en Sangre" },
        { cod: "COMP-RAY-001", nom: "Radiografía de Tórax (OIT)" },
        { cod: "COMP-RAY-002", nom: "Radiografía de Columna Lumbar" },
        { cod: "COMP-CARD-002", nom: "Electrocardiograma en Reposo" },
        { cod: "COMP-RESP-003", nom: "Espirometría Forzada (CVF)" }
      ]
    }
  },
  "GO-003": {
    "nombre": "Operativos",
    "clasificaciones": {
      "Pruebas Psicológicas": [
        { cod: "PSI-CHI-004", nom: "Entrevista Psicológica Chinalco" },
        { cod: "PSI-CMP-002", nom: "Competencias Laborales Volcán" },
        { cod: "PSI-ALT-003", nom: "Evaluación Psicológica – Altura" },
        { cod: "PSI-FAT-002", nom: "Escala de Epworth (Somnolencia)" },
        { cod: "PSI-SEG-002", nom: "Test de Propensión a Accidentes" },
        { cod: "PSI-VIG-001", nom: "Test de Vigilancia Psicomotora" }
      ],
      "Exámenes Médicos Generales": [
        { cod: "MED-CLIN-001", nom: "Evaluación Médica Ocupacional Anual" },
        { cod: "MED-NEU-001", nom: "Examen Neurológico Básico" },
        { cod: "MED-OSTE-001", nom: "Evaluación Músculo Esquelética" },
        { cod: "MED-DERM-001", nom: "Examen Dermatológico" },
        { cod: "MED-CARD-001", nom: "Evaluación Cardiovascular" }
      ],
      "Exámenes Complementarios Especiales": [
        { cod: "COMP-LAB-008", nom: "Examen Toxicológico (Drogas)" },
        { cod: "COMP-LAB-009", nom: "Prueba de Alcohol en Aliento" },
        { cod: "COMP-RESP-003", nom: "Espirometría Forzada (CVF)" },
        { cod: "COMP-AUD-001", nom: "Audiometría Tonal" },
        { cod: "COMP-RAY-001", nom: "Radiografía de Tórax (OIT)" },
        { cod: "COMP-RAY-003", nom: "Ecografía Abdominal" }
      ]
    }
  }
};

function abrirOrdenPruebas(codPrest, depGrupo) {
  // Actualizar título del modal
  const titulo = document.getElementById("tOrdenPruebas");
  if (titulo) {
    titulo.innerHTML = codPrest 
        ? '<i class="fas fa-sort me-2 text-primary"></i>Orden de Pruebas — ' + codPrest
        : '<i class="fas fa-sort me-2 text-primary"></i>Orden de Pruebas';
  }

  const contenedor = document.getElementById("contenedorPruebasOrden");
  const sel = document.getElementById("selectGrupoOrden");

  if (sel) sel.value = "";
  if (contenedor) {
    contenedor.innerHTML = '<div class="text-center text-muted p-4"><i class="fas fa-hand-pointer mb-3 fs-3 text-primary opacity-50"></i><br />Seleccione un Grupo Ocupacional para ver y ordenar sus pruebas.</div>';
  }
}

function cargarPruebasOrden() {
  const select = document.getElementById("selectGrupoOrden");
  const grupoValue = select?.value;
  const contenedor = document.getElementById("contenedorPruebasOrden");
  if (!contenedor) return;

  if (!grupoValue || !_pruebasPorGrupo[grupoValue]) {
    contenedor.innerHTML = '<div class="text-center text-muted p-4"><i class="fas fa-hand-pointer mb-3 fs-3 text-primary opacity-50"></i><br />Seleccione un Grupo Ocupacional para ver y ordenar sus pruebas.</div>';
    return;
  }

  const dataGrupo = _pruebasPorGrupo[grupoValue];
  const nombreGrupo = dataGrupo.nombre;
  const clasificaciones = dataGrupo.clasificaciones;
  const clasifNames = Object.keys(clasificaciones);

  if (clasifNames.length === 0) {
    contenedor.innerHTML = '<div class="text-center text-muted p-4">No hay pruebas estructuradas en clasificaciones para este grupo.</div>';
    return;
  }

  // Helper template
  const getCardHTML = (p, index) => `
          <div class="card-item item-row p-3 border rounded shadow-sm bg-white d-flex flex-column" style="margin-bottom: 12px;">
              <div class="d-flex align-items-center gap-3 w-100">
                  <div class="icon-box" style="background: #f8fafc; border: 1px solid var(--border-light); width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: 12px; flex-shrink: 0;">
                      <i class="fas fa-file-medical-alt text-primary opacity-75" style="font-size: 1.25rem;"></i>
                  </div>
                  <div class="flex-grow-1 d-flex flex-column" style="min-width: 0;">
                      <span style="font-size: 1.1rem; font-weight: 700; color: var(--primary, #2563eb); line-height: 1.35; display: block;">${p.nom || p.descripcion || "Prestación sin nombre"}</span>
                      <small class="text-muted fw-medium mt-1" style="font-size: 0.78rem;">${p.cod}</small>
                  </div>
                  <div class="d-flex flex-column align-items-center gap-1 flex-shrink-0">
                      <span style="font-size: 0.65rem; font-weight: 700; color: var(--text-main); letter-spacing: 0.5px;">ORDEN</span>
                      <input type="number" class="form-control text-center fw-bold text-primary border-primary shadow-sm" onchange="reordenarPrestacion(this)" value="${index + 1}" min="1" style="width: 58px; height: 44px; border-radius: 10px; font-size: 1.1rem; background-color: #fff;">
                  </div>
              </div>
          </div>`;

  let html = '<div class="accordion" id="accordionPruebasOrden">';
  const colors = ["primary", "success", "warning", "info", "danger"];

  clasifNames.forEach((clasifName, cIdx) => {
    const color = colors[cIdx % colors.length];
    const pruebas = clasificaciones[clasifName];
    const isFirst = cIdx === 0;
    const collapseId = `collapse-pruebas-${cIdx}`;
    const headingId = `heading-pruebas-${cIdx}`;
    
    html += `
      <div class="accordion-item mb-3 border-0 shadow-sm" style="border-radius: 12px; overflow: hidden;">
        <h2 class="accordion-header" id="${headingId}">
          <button class="accordion-button ${isFirst ? '' : 'collapsed'} bg-light fw-bold py-3 border-start border-${color} border-4" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}" aria-expanded="${isFirst ? 'true' : 'false'}" aria-controls="${collapseId}">
            <i class="fas fa-layer-group me-2 text-${color}"></i>Grupo: ${nombreGrupo} (${clasifName})
            <span class="badge bg-${color} rounded-pill ms-auto me-2">${pruebas.length}</span>
          </button>
        </h2>
        <div id="${collapseId}" class="accordion-collapse collapse ${isFirst ? 'show' : ''}" aria-labelledby="${headingId}">
          <div class="accordion-body p-3 bg-white">
            <div class="lista-ordenable" style="min-height: 60px; border-left: 4px solid var(--bs-${color}, var(--${color}, #2563eb)); padding-left: 8px;">
              ${pruebas.map((p, i) => getCardHTML(p, i)).join("")}
            </div>
          </div>
        </div>
      </div>
    `;
  });
  
  html += '</div>';

  contenedor.innerHTML = html;

  if (typeof initDrag === "function") {
    contenedor.querySelectorAll(".card-item").forEach(initDrag);
  }
}

// Inicializar drag & drop en los card-item dinámicos
document.addEventListener("DOMContentLoaded", function () {
  const contenedor = document.getElementById("contenedorPruebasOrden");
  if (contenedor && typeof initDrag === "function") {
      contenedor.querySelectorAll(".card-item").forEach(initDrag);
  }
});
