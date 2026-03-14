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
        const listaId = isComplementario
          ? "lista-complementario"
          : "lista-sepo";
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

        card.className =
          "card-item p-2 d-flex align-items-center shadow-sm mb-2";
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
        document
          .querySelectorAll("#listaPrestOrden .item-row")
          .forEach((row) => {
            const txt = row.textContent.toLowerCase();
            row.style.display = txt.includes(q) ? "" : "none";
          });
      }

      function confirmarAddPrestOrden(cod, nombre) {
        const lista = document.getElementById(
          _grupoOrdenActivo === "principal"
            ? "lista-sepo"
            : "lista-complementario",
        );
        if (!lista) return;
        const icoBg = _grupoOrdenActivo === "principal" ? "#e0f2fe" : "#ffedd5";
        const icoCol =
          _grupoOrdenActivo === "principal" ? "var(--primary)" : "#c2410c";
        const icoClass =
          _grupoOrdenActivo === "principal"
            ? "fa-heart-pulse"
            : "fa-helmet-safety";
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
          nombre: "Profesionales",
          clasificaciones: {
            "Exámenes Clínicos": [
              { cod: "MED-CLIN-001", nom: "Evaluación Médica Ocupacional Anual" },
              { cod: "MED-CLIN-002", nom: "Examen Físico Completo" },
              { cod: "MED-OFT-001", nom: "Evaluación Agudeza Visual" },
              { cod: "MED-OFT-002", nom: "Test de Visión de Colores (Ishihara)" },
              { cod: "MED-AUD-001", nom: "Audiometría de Tamizaje" },
              { cod: "PR-CLIN-101", nom: "Triaje y Signos Vitales" },
              { cod: "PR-CLIN-102", nom: "Evaluación Médico Ocupacional" },
              { cod: "PR-CLIN-103", nom: "Examen Físico Segmentario" },
              { cod: "PR-ODON-104", nom: "Odontoscopía Básica" }
            ],
            "Pruebas Psicológicas": [
              { cod: "PSI-ANS-001", nom: "Escala de Ansiedad de Beck" },
              { cod: "PSI-EST-001", nom: "Cuestionario de Estrés Laboral" },
              { cod: "PSI-COG-001", nom: "Test de Atención y Concentración (Toulouse)" },
              { cod: "PSI-INT-001", nom: "Test de Inteligencia Emocional" },
              { cod: "PSI-PER-001", nom: "Inventario de Personalidad (NEO-PI)" },
              { cod: "PSI-BUR-001", nom: "Inventario de Burnout de Maslach" },
              { cod: "PR-PSI-108", nom: "Evaluación de Personalidad 16PF" },
              { cod: "PR-PSI-109", nom: "Test de Inteligencia (Raven)" },
              { cod: "PR-PSI-110", nom: "Escala de Depresión (Zung)" }
            ],
            "Exámenes Complementarios": [
              { cod: "COMP-LAB-001", nom: "Hemograma Completo" },
              { cod: "COMP-LAB-002", nom: "Perfil Lipídico" },
              { cod: "COMP-LAB-003", nom: "Examen Completo de Orina" },
              { cod: "COMP-LAB-004", nom: "Glucosa en Ayunas" },
              { cod: "COMP-CARD-001", nom: "Electrocardiograma en Reposo" },
              { cod: "CP-LAB-201", nom: "Hemograma Automatizado" },
              { cod: "CP-LAB-202", nom: "Perfil Bioquímico (12 parámetros)" },
              { cod: "CP-LAB-203", nom: "Prueba de VIH (Elisa)" },
              { cod: "CP-LAB-204", nom: "Marcadores Tumorales" }
            ],
          },
        },
        "GO-002": {
          nombre: "Administrativos",
          clasificaciones: {
            "Exámenes Clínicos, Odontológicos y Especializados": [
              { cod: "MED-CLIN-001", nom: "Evaluación Médica Ocupacional Anual" },
              { cod: "MED-OSTE-001", nom: "Evaluación Músculo Esquelética" },
              { cod: "MED-AUD-002", nom: "Audiometría Clínica" },
              { cod: "MED-OFT-001", nom: "Evaluación Agudeza Visual" },
              { cod: "MED-ODO-001", nom: "Odontograma Anual" },
              { cod: "PR-OFT-105", nom: "Refracción Computarizada" },
              { cod: "PR-OFT-106", nom: "Tonometría Ocular" },
              { cod: "PR-AUD-107", nom: "Audiometría Ocupacional" }
            ],
            "Pruebas Psicológicas": [
              { cod: "PSI-ALT-003", nom: "Evaluación Psicológica – Altura" },
              { cod: "PSI-FAT-001", nom: "Test de Fatiga y Somnolencia" },
              { cod: "PSI-MOT-001", nom: "Test de Coordinación Visomotriz" },
              { cod: "PR-PSI-111", nom: "Test de Wartegg" },
              { cod: "PR-PSI-112", nom: "Test de la Figura Humana" },
              { cod: "PR-PSI-113", nom: "Inventario de Intereses Vocationales" },
              { cod: "PR-PSI-114", nom: "Test de Habilidades Cognitivas" }
            ],
            "Laboratorio e Imágenes": [
              { cod: "COMP-LAB-001", nom: "Hemograma Completo" },
              { cod: "COMP-RAY-001", nom: "Radiografía de Tórax (OIT)" },
              { cod: "COMP-RESP-003", nom: "Espirometría Forzada (CVF)" },
              { cod: "CP-LAB-205", nom: "Perfil Tiroideo (TSH, T4)" },
              { cod: "CP-LAB-206", nom: "Examen de Heces (Coproparasitológico)" },
              { cod: "CP-LAB-207", nom: "Baciloscopía (BK en esputo)" },
              { cod: "CP-IMG-211", nom: "Radiografía de Tórax PA" },
              { cod: "CP-IMG-212", nom: "Radiografía de Columna Cervical" }
            ],
          },
        },
        "GO-003": {
          nombre: "Técnicos",
          clasificaciones: {
            "Pruebas Psicológicas": [
              { cod: "PSI-CHI-004", nom: "Entrevista Psicológica Chinalco" },
              { cod: "PSI-VIG-001", nom: "Test de Vigilancia Psicomotora" },
              { cod: "PR-PSI-115", nom: "Evaluación de Liderazgo" },
              { cod: "PR-PSI-116", nom: "Test de Estilo de Trabajo" },
              { cod: "PR-PSI-109", nom: "Test de Inteligencia (Raven)" }
            ],
            "Exámenes Médicos Generales": [
              { cod: "MED-CLIN-001", nom: "Evaluación Médica Ocupacional Anual" },
              { cod: "MED-DERM-001", nom: "Examen Dermatológico" },
              { cod: "PR-CLIN-117", nom: "Espirometría Basal" },
              { cod: "PR-CLIN-118", nom: "Electrocardiograma de Control" },
              { cod: "PR-CLIN-119", nom: "Evaluación Nutricional" },
              { cod: "PR-CLIN-120", nom: "Consulta Médica Especializada" }
            ],
            "Exámenes Complementarios Especiales": [
              { cod: "COMP-LAB-008", nom: "Examen Toxicológico (Drogas)" },
              { cod: "COMP-LAB-009", nom: "Prueba de Alcohol en Aliento" },
              { cod: "CP-LAB-208", nom: "Prueba de Embarazo (HCG)" },
              { cod: "CP-LAB-209", nom: "Dosaje de Alcohol Étilico" },
              { cod: "CP-LAB-210", nom: "Panel de Drogas (6 sustancias)" },
              { cod: "CP-IMG-213", nom: "Ecografía de Partes Blandas" },
              { cod: "CP-IMG-214", nom: "Ecografía Renal y de Vías Urinarias" },
              { cod: "CP-IMG-215", nom: "Tomografía Axial Computarizada (TAC)" },
              { cod: "CP-CARD-216", nom: "Holter de Arritmia (24h)" },
              { cod: "CP-CARD-217", nom: "Mapa de Presión Arterial" },
              { cod: "CP-RESP-218", nom: "Prueba de Función Pulmonar Completa" },
              { cod: "CP-NEU-219", nom: "Electroencefalograma Digital" },
              { cod: "CP-NEU-220", nom: "Electromiografía de Miembros Inferiores" }
            ],
          },
        },
      };

      function abrirOrdenPruebas(codPrest, depGrupo) {
        // Actualizar título del modal
        const titulo = document.getElementById("tOrdenPruebas");
        if (titulo) {
          titulo.innerHTML = codPrest
            ? '<i class="fas fa-sort me-2 text-primary"></i>Orden de Pruebas — ' +
              codPrest
            : '<i class="fas fa-sort me-2 text-primary"></i>Orden de Pruebas';
        }

        const sel = document.getElementById("selectGrupoOrden");
        if (sel) sel.value = "";
        cargarPruebasOrden();
      }

      function cargarPruebasOrden() {
        const select = document.getElementById("selectGrupoOrden");
        const grupoValue = select?.value;
        const contenedor = document.getElementById("contenedorPruebasOrden");
        if (!contenedor) return;

        let dataGruposToRender = [];
        if (!grupoValue || !_pruebasPorGrupo[grupoValue]) {
          // Si no hay filtro, tomamos todos los grupos disponibles
          dataGruposToRender = Object.keys(_pruebasPorGrupo).map((key) => ({
            id: key,
            ..._pruebasPorGrupo[key],
          }));
        } else {
          // Si hay filtro, solo ese grupo
          dataGruposToRender = [
            {
              id: grupoValue,
              ..._pruebasPorGrupo[grupoValue],
            },
          ];
        }

        if (dataGruposToRender.length === 0) {
          contenedor.innerHTML =
            '<div class="text-center text-muted p-4">No hay grupos ni pruebas disponibles para mostrar.</div>';
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
        let accordionIdx = 0;

        dataGruposToRender.forEach((dataGrupo) => {
          const nombreGrupo = dataGrupo.nombre;
          const clasificaciones = dataGrupo.clasificaciones;
          const clasifNames = Object.keys(clasificaciones);

          clasifNames.forEach((clasifName) => {
            const color = colors[accordionIdx % colors.length];
            const pruebas = clasificaciones[clasifName];
            const collapseId = `collapse-pruebas-${accordionIdx}`;
            const headingId = `heading-pruebas-${accordionIdx}`;

            html += `
              <div class="accordion-item mb-3 border-0 shadow-sm" style="border-radius: 12px; overflow: hidden;">
                <h2 class="accordion-header" id="${headingId}">
                  <button class="accordion-button collapsed bg-light fw-bold py-3 border-start border-${color} border-4" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}" aria-expanded="false" aria-controls="${collapseId}">
                    <i class="fas fa-layer-group me-2 text-${color}"></i>Grupo: ${nombreGrupo} (${clasifName})
                    <span class="badge bg-${color} rounded-pill ms-auto me-2">${pruebas.length}</span>
                  </button>
                </h2>
                <div id="${collapseId}" class="accordion-collapse collapse" aria-labelledby="${headingId}">
                  <div class="accordion-body p-3 bg-white">
                    <div class="lista-ordenable" style="min-height: 60px; border-left: 4px solid var(--bs-${color}, var(--${color}, #2563eb)); padding-left: 8px;">
                      ${pruebas.map((p, i) => getCardHTML(p, i)).join("")}
                    </div>
                  </div>
                </div>
              </div>
            `;
            accordionIdx++;
          });
        });

        html += "</div>";
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

/* ── TOASTS ── */
      function showToast(msg) {
        const toastEl = document.getElementById("statusToast");
        document.getElementById("toastMsg").textContent = msg;
        const toast = new bootstrap.Toast(toastEl, { delay: 2500 });
        toast.show();
      }

      /* ── NAVEGACIÓN ── */
      const SCREENS = [
        "centros",
        "grado",
        "ocupaciones",
        "grupos",
        "prestaciones",
        "fichas",
        "dashboard",
        "pruebas",
        "prueba-form",
        "orden",
      ];
      function go(id) {
        SCREENS.forEach((s) => {
          document.getElementById("screen-" + s)?.classList.remove("active");
          document.getElementById("nav-" + s)?.classList.remove("active");
        });
        document.getElementById("screen-" + id)?.classList.add("active");
        document.getElementById("nav-" + id)?.classList.add("active");
        return false;
      }

      /* ── ELIMINAR (SOLO SIMULACIÓN) ── */
      function eliminarRegistro(btn, cardClass) {
        confirmarEliminar(
          "¿Eliminar registro?",
          "Esta acción no se puede deshacer.",
          () => {
            const card = btn.closest("." + cardClass);
            card.style.transition = "all 0.3s ease";
            card.style.opacity = "0";
            card.style.transform = "translateX(30px)";
            setTimeout(() => card.remove(), 300);
          },
        );
      }

      /* ── AUTOCOMPLETE ── */
      const FICHAS_DB = [
        { codigo: "CPS-001", descripcion: "Escala de Ansiedad" },
        { codigo: "CPS-002", descripcion: "Escala de Depresión" },
        { codigo: "CPS-003", descripcion: "Competencias Laborales - Módulo 1" },
        { codigo: "CPS-004", descripcion: "Escala de Estrés Laboral" },
        { codigo: "CPS-005", descripcion: "Inventario de Personalidad" },
        { codigo: "CPS-010", descripcion: "Entrevista Psicológica - Básica" },
        { codigo: "CPSG-001", descripcion: "Competencias Laborales (Grupo)" },
        { codigo: "CPSG-002", descripcion: "Evaluación de Liderazgo (Grupo)" },
      ];
      function autocompleteFicha(sourceId, targetId, isCodeSource) {
        const sourceInput = document.getElementById(sourceId);
        const targetInput = document.getElementById(targetId);
        const val = sourceInput.value.trim().toLowerCase();

        if (!val) {
          targetInput.value = "";
          targetInput.style.color = "";
          targetInput.style.fontWeight = "normal";
          return;
        }

        const encontrada = FICHAS_DB.find(
          (f) =>
            f.codigo.toLowerCase().includes(val) ||
            f.descripcion.toLowerCase().includes(val),
        );

        if (encontrada) {
          if (isCodeSource) {
            targetInput.value = encontrada.descripcion;
          } else {
            targetInput.value = encontrada.codigo;
          }
          targetInput.style.color = "var(--primary)";
          targetInput.style.fontWeight = "bold";
        } else {
          targetInput.value = "";
          targetInput.style.color = "";
          targetInput.style.fontWeight = "normal";
        }
      }
      document.addEventListener("input", (e) => {
        if (e.target?.id === "sfCod") autocompleteFicha("sfCod", "sfDes", true);
        if (e.target?.id === "sfDes")
          autocompleteFicha("sfDes", "sfCod", false);
      });

      /* ── HELPERS ── */
      function pushItem(boxId, emptyId, html) {
        const box = document.getElementById(boxId);
        if (!box) return;
        document.getElementById(emptyId)?.remove();
        const d = document.createElement("div");
        d.innerHTML = html;
        box.appendChild(d.firstElementChild);
      }
      function resetBox(boxId, emptyId, icon, msg) {
        const box = document.getElementById(boxId);
        if (box)
          box.innerHTML = `<div class="text-center text-muted py-4 small" id="${emptyId}"><i class="${icon} fa-3x mb-3 opacity-25"></i><br>${msg}</div>`;
      }

      /* ── CENTROS ── */
      function nuevoCentro() {
        document.getElementById("tCentro").innerHTML =
          '<i class="fas fa-hospital me-2 text-primary"></i>Nuevo Centro Médico';
        ["cCod", "cDesc", "cDir"].forEach(
          (id) => (document.getElementById(id).value = ""),
        );
        document.getElementById("cCod").disabled = false;
        document.getElementById("cActivo").checked = true;
        document.getElementById("cVirtual").checked = false;
      }
      function editarCentro(cod, activo, virtual) {
        document.getElementById("tCentro").innerHTML =
          '<i class="fas fa-pen me-2 text-primary"></i>Editar: ' + cod;
        document.getElementById("cCod").value = cod;
        document.getElementById("cCod").disabled = true;
        document.getElementById("cActivo").checked = !!activo;
        document.getElementById("cVirtual").checked = !!virtual;
      }

      /* ── SIMPLE ── */
      function nuevoSimple(tipo) {
        const moduloName =
          tipo === "Ocupación"
            ? "Ocupaciones"
            : tipo === "Grupo Ocupacional"
              ? "Grupos"
              : tipo;
        document.getElementById("tSimple").innerHTML =
          '<i class="fas fa-plus me-2 text-primary"></i>Nuevo ' + tipo;
        document.getElementById("sCod").value = "";
        document.getElementById("sCod").disabled = false;
        document.getElementById("sDesc").value = "";
        document.getElementById("sActivo").checked = true;

        const btnSave = document.getElementById("btnSaveSimple");
        if (btnSave) {
          btnSave.onclick = () => {
            confirmarGuardar(moduloName, () => {
              bootstrap.Modal.getInstance(
                document.getElementById("modalSimple"),
              ).hide();
              showToast("Cambios guardados correctamente");
            });
          };
        }
      }
      function editarSimple(cod, desc, tipo = "Registro") {
        const moduloName =
          tipo === "Ocupación"
            ? "Ocupaciones"
            : tipo === "Grupo Ocupacional"
              ? "Grupos"
              : tipo;
        document.getElementById("tSimple").innerHTML =
          '<i class="fas fa-pen me-2 text-primary"></i>Editar ' +
          (tipo || "Registro");
        document.getElementById("sCod").value = cod;
        document.getElementById("sCod").disabled = true;
        document.getElementById("sDesc").value = desc;

        const btnSave = document.getElementById("btnSaveSimple");
        if (btnSave) {
          btnSave.onclick = () => {
            confirmarGuardar(moduloName, () => {
              bootstrap.Modal.getInstance(
                document.getElementById("modalSimple"),
              ).hide();
              showToast("Cambios guardados correctamente");
            });
          };
        }
      }

      /* ── PRESTACIONES ── */
      function nuevaPrestacion() {
        document.getElementById("tPrest").innerHTML =
          '<i class="fas fa-stethoscope me-2 text-primary"></i>Nueva Prestación';
        ["pCod", "pDesc"].forEach((id) => {
          const el = document.getElementById(id);
          if (el) el.value = "";
        });
        const pCod = document.getElementById("pCod");
        const pDesc = document.getElementById("pDesc");
        const pEstado = document.getElementById("pEstado");
        const pTipoExamen = document.getElementById("pTipoExamen");
        if (pCod) pCod.disabled = false;
        if (pDesc) pDesc.disabled = false;
        if (pEstado) {
          pEstado.disabled = false;
          pEstado.value = "activo";
        }
        if (pTipoExamen) {
          pTipoExamen.disabled = false;
          pTipoExamen.value = "emo";
        }
        const listaFichasPrestacion = document.getElementById("listaFichasPrestacion");
        if (listaFichasPrestacion) listaFichasPrestacion.innerHTML = "";

        const btnSave = document.getElementById("btnSavePrest");
        if (btnSave) {
          btnSave.onclick = () => {
            confirmarGuardar("Prestaciones", () => {
              bootstrap.Modal.getInstance(
                document.getElementById("modalPrestacion"),
              ).hide();
              showToast("Cambios guardados correctamente");
            });
          };
        }
      }
      function editarPrestacion(cod) {
        document.getElementById("tPrest").innerHTML =
          '<i class="fas fa-pen me-2 text-primary"></i>Editar: ' + cod;
        const pCod = document.getElementById("pCod");
        const pDesc = document.getElementById("pDesc");
        const pEstado = document.getElementById("pEstado");
        const pTipoExamen = document.getElementById("pTipoExamen");
        if (pCod) {
          pCod.value = cod;
          pCod.disabled = true;
        }
        if (pDesc) pDesc.disabled = true;
        if (pEstado) pEstado.disabled = true;
        if (pTipoExamen) pTipoExamen.disabled = true;

        let desc = "Prestación ocupacional configurada";
        let estado = "activo";
        let tipoExamen = "complementario";

        if (cod === "PR-PSI-001") {
          desc = "Evaluación Psicológica – Entrevista";
          tipoExamen = "emo";
        } else if (cod === "PR-ALT-002") {
          desc = "Psicología Ocupacional – Altura";
          tipoExamen = "complementario";
        } else if (cod === "PR-MED-001") {
          desc = "Evaluación Médica General";
          tipoExamen = "emo";
        } else if (cod === "PR-LAB-001") {
          desc = "Laboratorio Clínico Básico";
          tipoExamen = "complementario";
        } else if (cod === "PR-IMG-001") {
          desc = "Imagenología Diagnóstica";
          tipoExamen = "complementario";
        }

        if (pDesc) pDesc.value = desc;
        if (pEstado) pEstado.value = estado;
        if (pTipoExamen) pTipoExamen.value = tipoExamen;

        renderPrestacionFichas(cod);

        const btnSave = document.getElementById("btnSavePrest");
        if (btnSave) {
          btnSave.onclick = () => {
            confirmarGuardar("Prestaciones", () => {
              bootstrap.Modal.getInstance(
                document.getElementById("modalPrestacion"),
              ).hide();
              showToast("Cambios guardados correctamente");
            });
          };
        }
      }
      function addFichaPrestacion() {
        const val = document.getElementById("pfCod").value.trim();
        if (!val) {
          alert("Ingrese una búsqueda");
          return;
        }

        // Find in DB
        const f =
          typeof FICHAS_DB !== "undefined"
            ? FICHAS_DB.find(
                (x) =>
                  x.codigo.toLowerCase().includes(val.toLowerCase()) ||
                  x.descripcion.toLowerCase().includes(val.toLowerCase()),
              )
            : null;

        let cod = val.toUpperCase();
        let des = "—";
        if (f) {
          cod = f.codigo;
          des = f.descripcion;
        }

        pushItem("boxPF", "emptyPF", rowPF(cod, des));
        document.getElementById("pfCod").value = "";
      }
      function rowPF(cod, des) {
        return `<div class="item-row"><div class="inf"><span class="tag tag-fich fw-bold"><i class="fas fa-file-alt me-1 text-primary"></i>${cod}</span><span class="fw-medium">${des}</span></div><button class="btn btn-light rounded-circle text-danger p-0" style="width:32px;height:32px;" onclick="this.closest('.item-row').remove()"><i class="fas fa-times"></i></button></div>`;
      }

      const PRESTACION_FICHAS_DEMO = {
        "PR-PSI-001": [
          { codigo: "CPS-001", nombre: "Escala de Ansiedad", subtitulo: "Ficha psicológica para screening inicial de síntomas ansiosos.", codigos: [
            { nombre: "Nivel de estrés", meta: "Indicador base del estado emocional actual." },
            { nombre: "Puntaje total", meta: "Resultado consolidado de la escala aplicada." },
            { nombre: "Tiempo de respuesta", meta: "Duración registrada durante la aplicación." },
          ] },
          { codigo: "CPS-010", nombre: "Entrevista Psicológica Básica", subtitulo: "Ficha complementaria para explorar antecedentes y observaciones clínicas.", codigos: [
            { nombre: "Motivo de evaluación", meta: "Descripción resumida del motivo principal." },
            { nombre: "Observación conductual", meta: "Registro breve del comportamiento observado." },
            { nombre: "Nivel de riesgo", meta: "Clasificación inicial del caso evaluado." },
          ] },
          { codigo: "CPS-022", nombre: "Contexto Psicosocial", subtitulo: "Ficha de apoyo para factores del entorno y red de soporte.", codigos: [
            { nombre: "Red de apoyo", meta: "Clasificación del soporte social disponible." },
            { nombre: "Factor desencadenante", meta: "Evento asociado al motivo de consulta." },
            { nombre: "Prioridad de intervención", meta: "Nivel sugerido de acción posterior." },
          ] },
        ],
        "PR-ALT-002": [
          { codigo: "CAT-011", nombre: "Check Altura Operativa", subtitulo: "Ficha de control para evaluación en trabajos en altura.", codigos: [
            { nombre: "Aptitud en altura", meta: "Resultado general para labor operativa." },
            { nombre: "Uso de arnés", meta: "Conformidad con protocolos de seguridad." },
            { nombre: "Nivel de atención", meta: "Capacidad de concentración en entorno de riesgo." },
          ] },
          { codigo: "CAT-017", nombre: "Observación de Riesgo Vertical", subtitulo: "Ficha ficticia para validación de criterios preventivos.", codigos: [
            { nombre: "Tolerancia al vértigo", meta: "Registro ante exposición vertical." },
            { nombre: "Cumplimiento EPP", meta: "Chequeo del equipo de protección personal." },
            { nombre: "Respuesta motora", meta: "Desempeño psicomotor observado." },
          ] },
        ],
        "PR-PSI-004": [
          { codigo: "CPS-031", nombre: "Evaluación de Fatiga Mental", subtitulo: "Ficha para detección de sobrecarga cognitiva.", codigos: [
            { nombre: "Índice de fatiga", meta: "Valor resultante del cuestionario." },
            { nombre: "Atención sostenida", meta: "Desempeño observado en la sesión." },
            { nombre: "Recomendación", meta: "Sugerencia de intervención inicial." },
          ] },
          { codigo: "CPS-038", nombre: "Registro de Adaptación Laboral", subtitulo: "Ficha ficticia sobre ajuste emocional al puesto.", codigos: [
            { nombre: "Nivel de adaptación", meta: "Percepción del evaluado sobre su puesto." },
            { nombre: "Estresor principal", meta: "Factor más incidente reportado." },
            { nombre: "Plan de seguimiento", meta: "Propuesta básica de control." },
          ] },
        ],
        "PR-MED-001": [
          { codigo: "CME-001", nombre: "Examen Clínico General", subtitulo: "Ficha clínica principal para anamnesis y revisión básica.", codigos: [
            { nombre: "Presión arterial", meta: "Dato vital registrado en consulta." },
            { nombre: "Frecuencia cardiaca", meta: "Medición basal del paciente." },
            { nombre: "Observaciones médicas", meta: "Notas generales del profesional." },
          ] },
          { codigo: "CME-009", nombre: "Control de Antecedentes", subtitulo: "Ficha de apoyo para historial médico ocupacional.", codigos: [
            { nombre: "Antecedente relevante", meta: "Condición previa asociada al examen." },
            { nombre: "Restricción médica", meta: "Limitación reportada o detectada." },
            { nombre: "Seguimiento sugerido", meta: "Acción posterior recomendada." },
          ] },
        ],
        "PR-LAB-001": [
          { codigo: "CLB-003", nombre: "Perfil Hematológico", subtitulo: "Ficha de laboratorio para parámetros sanguíneos básicos.", codigos: [
            { nombre: "Hemoglobina", meta: "Resultado cuantitativo del análisis." },
            { nombre: "Hematocrito", meta: "Indicador relativo de volumen globular." },
            { nombre: "Observación de muestra", meta: "Comentario sobre el procesamiento." },
          ] },
          { codigo: "CLB-014", nombre: "Panel Bioquímico", subtitulo: "Ficha complementaria con factores metabólicos de referencia.", codigos: [
            { nombre: "Glucosa", meta: "Valor medido en laboratorio." },
            { nombre: "Colesterol total", meta: "Marcador general del perfil lipídico." },
            { nombre: "Tiempo de proceso", meta: "Duración del análisis de muestra." },
          ] },
        ],
        "PR-IMG-001": [
          { codigo: "CIM-008", nombre: "Ficha Radiológica Básica", subtitulo: "Ficha de imagen para descripción y correlato radiológico.", codigos: [
            { nombre: "Zona evaluada", meta: "Área anatómica consignada." },
            { nombre: "Hallazgo principal", meta: "Resultado relevante del estudio." },
            { nombre: "Calidad de imagen", meta: "Evaluación técnica del examen." },
          ] },
          { codigo: "CIM-015", nombre: "Lectura de Soporte Diagnóstico", subtitulo: "Ficha complementaria para correlación con factores clínicos.", codigos: [
            { nombre: "Conclusión preliminar", meta: "Interpretación inicial del examen." },
            { nombre: "Necesidad de contraste", meta: "Validación para procedimiento complementario." },
            { nombre: "Prioridad de revisión", meta: "Nivel sugerido de atención médica." },
          ] },
        ],
      };

      function buildPrestacionFichasDemo(cod, desc) {
        const categoria = cod.includes("PSI") ? "Psicológica" : cod.includes("MED") ? "Médica" : cod.includes("LAB") ? "Laboratorio" : cod.includes("IMG") ? "Imagen" : cod.includes("CAR") ? "Cardiológica" : cod.includes("ERG") ? "Ergonómica" : "General";
        return [
          { codigo: `${cod.replace("PR-", "CF-")}-A`, nombre: `Ficha ${categoria} Base`, subtitulo: `Ficha ficticia asociada a ${desc || "la prestación"}.`, codigos: [
            { nombre: `${categoria} principal`, meta: "Dato principal de la ficha vinculada." },
            { nombre: `${categoria} secundario`, meta: "Dato complementario configurable." },
            { nombre: "Observación operativa", meta: "Comentario general para validación del proceso." },
          ] },
          { codigo: `${cod.replace("PR-", "CF-")}-B`, nombre: `Ficha ${categoria} Complementaria`, subtitulo: `Apoyo visual para simular múltiples fichas en ${desc || "esta prestación"}.`, codigos: [
            { nombre: "Indicador de control", meta: "Variable usada para seguimiento." },
            { nombre: "Resultado asociado", meta: "Dato resultante de la ficha ficticia." },
            { nombre: "Validación final", meta: "Campo disponible para enlace con factores." },
          ] },
        ];
      }

      function getPrestacionFichas(cod) {
        const desc = document.getElementById("pDesc")?.value || "";
        return PRESTACION_FICHAS_DEMO[cod] || buildPrestacionFichasDemo(cod, desc);
      }

      function renderPrestacionFichas(cod) {
        const cont = document.getElementById("listaFichasPrestacion");
        if (!cont) return;
        const fichas = getPrestacionFichas(cod);
        cont.innerHTML = fichas.map((ficha, index) => `
              <div class="prest-ficha-card is-collapsed">
                <div class="prest-ficha-header" onclick="togglePrestacionFicha(this)">
                  <div class="prest-ficha-title">
                    <span class="prest-ficha-badge"><i class="fas fa-file-medical-alt"></i></span>
                    <div>
                      <div class="d-flex align-items-center gap-2 flex-wrap">
                        <span class="tag tag-fich">${ficha.codigo}</span>
                        <span class="fw-semibold text-dark">${ficha.nombre}</span>
                      </div>
                      <div class="prest-ficha-subtitle">${ficha.subtitulo}</div>
                      <div class="prest-ficha-summary"><i class="fas fa-list-check"></i>${ficha.codigos.length} códigos de dato disponibles</div>
                    </div>
                  </div>
                  <button type="button" class="prest-ficha-toggle" aria-label="Desglosar ficha" onclick="event.stopPropagation(); togglePrestacionFicha(this.closest('.prest-ficha-header'))"><i class="fas fa-chevron-down"></i></button>
                </div>
                <div class="prest-ficha-body">
                  <div class="prest-codigos-head">
                    <div>Código de dato</div>
                    <div>Estado</div>
                    <div>Factor asociado</div>
                  </div>
                  <div class="prest-codigos-list">
                    ${ficha.codigos.map((codigo, codIndex) => `
                          <div class="prest-codigo-row">
                            <div>
                              <div class="prest-codigo-name">${codigo.nombre}</div>
                              <div class="prest-codigo-meta">${codigo.meta}</div>
                            </div>
                            <div class="prest-switch-wrap">
                              <div class="form-check form-switch m-0">
                                <input class="form-check-input" type="checkbox" checked onchange="toggleFactorPrestacion(this)" id="prest-${index}-${codIndex}" />
                              </div>
                              <span class="prest-switch-label">Encendido</span>
                            </div>
                            <select class="form-select prest-factor-select">
                              <option selected>Seleccionar factor...</option>
                              <option>Factor principal</option>
                              <option>Factor secundario</option>
                              <option>Factor de seguimiento</option>
                            </select>
                          </div>
                        `).join("")}
                  </div>
                </div>
              </div>
            `).join("");
      }

      function togglePrestacionFicha(trigger) {
        const card = trigger?.closest(".prest-ficha-card");
        if (!card) return;
        card.classList.toggle("is-collapsed");
      }

      function toggleFactorPrestacion(input) {
        const row = input.closest(".prest-codigo-row");
        if (!row) return;
        const select = row.querySelector(".prest-factor-select");
        const label = row.querySelector(".prest-switch-label");
        const enabled = input.checked;
        if (select) select.disabled = !enabled;
        if (label) label.textContent = enabled ? "Encendido" : "Apagado";
      }

      /* ── FICHAS ── */
      const TIPO_LABEL = {
          puntaje: "Puntaje",
          nivel: "Nivel",
          interpretacion: "Interpretación",
        },
        TIPO_CLASS = {
          puntaje: "tag-punt",
          nivel: "tag-niv",
          interpretacion: "tag-int",
        },
        TIPO_ICON = { puntaje: "📊", nivel: "🔤", interpretacion: "📝" };
      function setEstadoFichaMode(mode) {
        const sel = document.getElementById("fEstado");
        if (mode === "create") {
          sel.querySelector('option[value="cesado"]')?.remove();
          sel.value = "borrador";
        } else {
          if (!sel.querySelector('option[value="cesado"]')) {
            const o = document.createElement("option");
            o.value = "cesado";
            o.textContent = "Cesado";
            sel.appendChild(o);
          }
        }
      }
      function nuevaFicha() {
        document.getElementById("tFicha").innerHTML = '<i class="fas fa-clipboard-list me-2 text-primary"></i>Nueva Ficha';
        document.getElementById("fCod").value = "";
        document.getElementById("fCod").disabled = false;
        document.getElementById("fDesc").disabled = false;
        document.getElementById("fEstado").disabled = false;
        document.getElementById("fDesc").value = "";
        document.getElementById("fTieneGrupo").checked = false;
        document.getElementById("fFinalizada").checked = false;
        document.getElementById("fGrupoBox").style.display = "none";
        document.getElementById("fCodigoDatoBox").style.display = "block";
        document.getElementById("fCdTableBody").innerHTML = `
          <tr>
            <td class="ps-3"><span class="badge bg-light text-dark border shadow-sm"><i class="fas fa-tag me-1 text-primary"></i> PTJ-001</span></td>
            <td>Puntaje Total</td>
            <td><span class="text-muted small"><i class="fas fa-calculator me-1"></i> Puntaje numérico</span></td>
            <td><span class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25" style="font-size: 0.72rem;">Activo</span></td>
            <td class="text-center"><button class="btn btn-link btn-sm text-danger p-0" onclick="this.closest('tr').remove()"><i class="fas fa-trash"></i></button></td>
          </tr>
          <tr>
            <td class="ps-3"><span class="badge bg-light text-dark border shadow-sm"><i class="fas fa-tag me-1 text-primary"></i> NVL-001</span></td>
            <td>Nivel de Riesgo</td>
            <td><span class="text-muted small"><i class="fas fa-font me-1"></i> Nivel texto</span></td>
            <td><span class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25" style="font-size: 0.72rem;">Activo</span></td>
            <td class="text-center"><button class="btn btn-link btn-sm text-danger p-0" onclick="this.closest('tr').remove()"><i class="fas fa-trash"></i></button></td>
          </tr>
          <tr>
            <td class="ps-3"><span class="badge bg-light text-dark border shadow-sm"><i class="fas fa-tag me-1 text-primary"></i> INT-001</span></td>
            <td>Interpretación Clínica</td>
            <td><span class="text-muted small"><i class="fas fa-comment-alt me-1"></i> Interpretación texto</span></td>
            <td><span class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25" style="font-size: 0.72rem;">Activo</span></td>
            <td class="text-center"><button class="btn btn-link btn-sm text-danger p-0" onclick="this.closest('tr').remove()"><i class="fas fa-trash"></i></button></td>
          </tr>
        `;
        setEstadoFichaMode("create");
      }

      function editarFicha(cod, esGrupo) {
        document.getElementById("tFicha").innerHTML = '<i class="fas fa-pen me-2 text-primary"></i>Editar Ficha: ' + cod;
        document.getElementById("fCod").value = cod;
        document.getElementById("fCod").disabled = true;
        document.getElementById("fDesc").disabled = true;
        document.getElementById("fEstado").disabled = true;

        const demoDescs = {
          "CPS-001": "Escala de Ansiedad",
          "CPS-010": "Entrevista Psicológica - Básica",
          "FLB-005": "Examen de Metales Pesados",
          "FMO-004": "Ficha Médica Ocupacional",
        };
        document.getElementById("fDesc").value = demoDescs[cod] || "Ficha de Evaluación";
        document.getElementById("fEstado").value = "activo";
        document.getElementById("fTieneGrupo").checked = !!esGrupo;
        
        document.getElementById("fGrupoBox").style.display = esGrupo ? "block" : "none";
        document.getElementById("fCodigoDatoBox").style.display = esGrupo ? "none" : "block";
        
        setEstadoFichaMode("edit");
        
        if (!esGrupo) {
          document.getElementById("fCdTableBody").innerHTML = `
            <tr>
              <td class="ps-3"><span class="badge bg-light text-dark border shadow-sm"><i class="fas fa-tag me-1 text-primary"></i> PTJ-001</span></td>
              <td>Puntaje Total</td>
              <td><span class="text-muted small"><i class="fas fa-calculator me-1"></i> Puntaje numérico</span></td>
              <td><span class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25" style="font-size: 0.72rem;">Activo</span></td>
              <td class="text-center"><button class="btn btn-link btn-sm text-danger p-0" onclick="this.closest('tr').remove()"><i class="fas fa-trash"></i></button></td>
            </tr>
            <tr>
              <td class="ps-3"><span class="badge bg-light text-dark border shadow-sm"><i class="fas fa-tag me-1 text-primary"></i> NVL-001</span></td>
              <td>Nivel de Riesgo</td>
              <td><span class="text-muted small"><i class="fas fa-font me-1"></i> Nivel texto</span></td>
              <td><span class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25" style="font-size: 0.72rem;">Activo</span></td>
              <td class="text-center"><button class="btn btn-link btn-sm text-danger p-0" onclick="this.closest('tr').remove()"><i class="fas fa-trash"></i></button></td>
            </tr>
            <tr>
              <td class="ps-3"><span class="badge bg-light text-dark border shadow-sm"><i class="fas fa-tag me-1 text-primary"></i> INT-001</span></td>
              <td>Interpretación Sugerida</td>
              <td><span class="text-muted small"><i class="fas fa-comment-alt me-1"></i> Interpretación texto</span></td>
              <td><span class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25" style="font-size: 0.72rem;">Activo</span></td>
              <td class="text-center"><button class="btn btn-link btn-sm text-danger p-0" onclick="this.closest('tr').remove()"><i class="fas fa-trash"></i></button></td>
            </tr>
          `;
        } else {
          document.getElementById("listaSubFichas").innerHTML = `
            <div class="card-item p-2 mb-2 d-flex align-items-center justify-content-between border rounded" style="background:#f8fafc;">
              <span class="small fw-bold text-primary"><i class="fas fa-file-alt me-2"></i>CPS-001</span>
              <span class="small flex-grow-1 ms-3">Escala de Ansiedad</span>
              <button class="btn btn-link btn-sm text-danger p-0" onclick="this.closest('.card-item').remove()"><i class="fas fa-trash"></i></button>
            </div>
          `;
        }
      }

      function addCodigoDato() {
        const cod = document.getElementById("fCdCod").value.trim().toUpperCase();
        const des = document.getElementById("fCdDesc").value.trim();
        const tip = document.getElementById("fCdTipo").value;
        const est = document.getElementById("fCdEstado").value;

        if (!cod || !des) {
          showToast("⚠️ Ingrese código y descripción");
          return;
        }

        const tbody = document.getElementById("fCdTableBody");
        const tr = document.createElement("tr");
        
        const tipIcons = {
          "Puntaje numérico": "fa-calculator",
          "Nivel texto": "fa-font",
          "Interpretación texto": "fa-comment-alt"
        };
        const icon = tipIcons[tip] || "fa-tag";

        tr.innerHTML = `
          <td class="ps-3"><span class="badge bg-light text-dark border shadow-sm"><i class="fas fa-tag me-1 text-primary"></i> ${cod}</span></td>
          <td>${des}</td>
          <td><span class="text-muted small"><i class="fas ${icon} me-1"></i> ${tip}</span></td>
          <td><span class="badge ${est === "Activo" ? "bg-success" : "bg-secondary"} bg-opacity-10 ${est === "Activo" ? "text-success" : "text-secondary"} border ${est === "Activo" ? "border-success" : "border-secondary"} border-opacity-25" style="font-size: 0.72rem;">${est}</span></td>
          <td class="text-center"><button class="btn btn-link btn-sm text-danger p-0" onclick="this.closest('tr').remove()"><i class="fas fa-trash"></i></button></td>
        `;

        // If it was the "Sin Códigos" message, clear it (though here we clear it in nuevaFicha anyway)
        tbody.appendChild(tr);

        document.getElementById("fCdCod").value = "";
        document.getElementById("fCdDesc").value = "";
      }

      function addSF() {
        const input = document.getElementById("inputBuscarSubFicha");
        const cod = input.value.trim().toUpperCase();
        const des = "Sub-ficha de Evaluación";
        if (!cod) return;

        const div = document.createElement("div");
        div.className = "card-item p-2 mb-2 d-flex align-items-center justify-content-between border rounded";
        div.style.background = "#f8fafc";
        div.innerHTML = `
          <span class="small fw-bold text-primary"><i class="fas fa-file-alt me-2"></i>${cod}</span>
          <span class="small flex-grow-1 ms-3">${des}</span>
          <button class="btn btn-link btn-sm text-danger p-0" onclick="this.closest('.card-item').remove()"><i class="fas fa-trash"></i></button>
        `;
        document.getElementById("listaSubFichas").appendChild(div);
        input.value = "";
        showToast("Sub-ficha agregada");
      }

      /* ══════════════════════════════
       PRUEBAS PSICOLÓGICAS
    ══════════════════════════════ */
      let currentStep = 0;
      const TOTAL_STEPS = 7;
      const STEP_PCT = [14, 28, 42, 57, 71, 85, 100];

      function goStep(n) {
        for (let i = 0; i < TOTAL_STEPS; i++) {
          document.getElementById("step-" + i)?.classList.remove("active");
          const snum = document.getElementById("snum-" + i);
          const item = document.querySelectorAll(".stepper-item")[i];
          if (snum && item) {
            item.classList.remove("active");
            if (i < n) {
              snum.className = "stepper-num done";
              snum.innerHTML =
                '<i class="fas fa-check" style="font-size:.7rem"></i>';
            } else if (i === n) {
              snum.className = "stepper-num active";
              snum.innerHTML = i + 1;
              item.classList.add("active");
            } else {
              snum.className = "stepper-num pend";
              snum.innerHTML = i + 1;
            }
          }
        }
        if (n === 3) precargarBolsito();
        document.getElementById("step-" + n)?.classList.add("active");
        currentStep = n;
        const pct = STEP_PCT[n] !== undefined ? STEP_PCT[n] : 0;
        document.getElementById("modalProgressFill").style.width = pct + "%";
        document.getElementById("modalProgressPct").textContent = pct + "%";
        document.getElementById("btnPrev").style.display =
          n === 0 ? "none" : "inline-flex";
        document.getElementById("btnNext").style.display =
          n === TOTAL_STEPS - 1 ? "none" : "inline-flex";
        const btnFin = document.getElementById("btnFinalizarConf");
        if (btnFin)
          btnFin.style.display = n === TOTAL_STEPS - 1 ? "inline-flex" : "none";

        const btnFinal = document.getElementById("btnGuardarFinal");
        if (btnFinal) {
          btnFinal.style.display =
            n === TOTAL_STEPS - 1 ? "inline-flex" : "none";
        }
      }

      function precargarBolsito() {
        const containerC = document.getElementById(
          "plantillaCerradasContainer",
        );
        const containerA = document.getElementById(
          "plantillaAbiertasContainer",
        );
        if (!containerC || !containerA) return;

        // Simular la carga automática de preguntas (req: Adiós a la Sincronización Manual)
        containerC.innerHTML = `
            <div class="border rounded bg-white p-3 shadow-sm mb-2 border-primary">
               <h6 class="fw-bold text-primary mb-2 text-truncate" title="P1 - ¿Con qué frecuencia sientes fatiga?">P1 - ¿Con qué frecuencia sientes fatiga?</h6>
               <div class="d-flex align-items-center justify-content-between py-1 border-bottom border-light">
                   <span class="text-dark fw-medium small">A) Nunca</span>
                   <div class="d-flex align-items-center gap-2">
                       <label class="small text-muted fw-bold mb-0">Pts:</label>
                       <input type="number" class="form-control form-control-sm border-secondary text-success fw-bold text-center" style="width: 70px;" value="0" step="0.1">
                   </div>
               </div>
               <div class="d-flex align-items-center justify-content-between py-1 border-bottom border-light">
                   <span class="text-dark fw-medium small">B) A veces</span>
                   <div class="d-flex align-items-center gap-2">
                       <label class="small text-muted fw-bold mb-0">Pts:</label>
                       <input type="number" class="form-control form-control-sm border-secondary text-success fw-bold text-center" style="width: 70px;" value="1" step="0.1">
                   </div>
               </div>
               <div class="d-flex align-items-center justify-content-between py-1">
                   <span class="text-dark fw-medium small">C) Siempre</span>
                   <div class="d-flex align-items-center gap-2">
                       <label class="small text-muted fw-bold mb-0">Pts:</label>
                       <input type="number" class="form-control form-control-sm border-secondary text-success fw-bold text-center" style="width: 70px;" value="2.5" step="0.1">
                   </div>
               </div>
            </div>
            <div class="border rounded bg-white p-3 shadow-sm mb-2 border-primary">
               <h6 class="fw-bold text-primary mb-2 text-truncate" title="P2 - Rango de dolor">P2 - Rango de dolor</h6>
               <div class="d-flex align-items-center justify-content-between py-1 border-bottom border-light">
                   <span class="text-dark fw-medium small">A) Leve</span>
                   <div class="d-flex align-items-center gap-2">
                       <label class="small text-muted fw-bold mb-0">Pts:</label>
                       <input type="number" class="form-control form-control-sm border-secondary text-success fw-bold text-center" style="width: 70px;" value="1" step="0.1">
                   </div>
               </div>
               <div class="d-flex align-items-center justify-content-between py-1">
                   <span class="text-dark fw-medium small">B) Agudo</span>
                   <div class="d-flex align-items-center gap-2">
                       <label class="small text-muted fw-bold mb-0">Pts:</label>
                       <input type="number" class="form-control form-control-sm border-secondary text-success fw-bold text-center" style="width: 70px;" value="3" step="0.1">
                   </div>
               </div>
            </div>`;

        containerA.innerHTML = `
            <div class="border rounded bg-white p-3 shadow-sm mb-2 border-primary">
               <h6 class="fw-bold text-primary mb-2 text-truncate" title="P3 - Describa su rutina de dolor">P3 - Describa su rutina de dolor (Texto)</h6>
               <div class="d-flex align-items-center justify-content-between py-1">
                   <span class="text-muted fw-medium small fst-italic">Ingresar valor base o puntaje global:</span>
                   <div class="d-flex align-items-center gap-2">
                       <label class="small text-muted fw-bold mb-0">Pts/Valor:</label>
                       <input type="number" class="form-control form-control-sm border-secondary text-success fw-bold text-center" style="width: 70px;" value="0" step="0.1">
                   </div>
               </div>
            </div>
            <div class="border rounded bg-white p-3 shadow-sm mb-2 border-primary">
               <h6 class="fw-bold text-primary mb-2 text-truncate" title="P4 - Edad (Numérica)">P4 - Edad (Numérica)</h6>
               <div class="d-flex align-items-center justify-content-between py-1">
                   <span class="text-muted fw-medium small fst-italic">Referencia global para uso en fórmulas:</span>
                   <div class="d-flex align-items-center gap-2">
                       <label class="small text-muted fw-bold mb-0">Pts/Valor:</label>
                       <input type="number" class="form-control form-control-sm border-secondary text-success fw-bold text-center" style="width: 70px;" value="0" step="0.1">
                   </div>
               </div>
            </div>`;

        const containerM = document.getElementById("plantillaMatrizContainer");
        const containerT = document.getElementById("plantillaTarjetaContainer");

        if (containerM) {
          containerM.innerHTML = `
               <div class="border rounded bg-white p-3 shadow-sm mb-2 border-primary">
                  <h6 class="fw-bold text-primary mb-2 text-truncate" title="P5 - Evalúe su estado anímico (Matriz)">P5 - Evalúe su estado anímico (Matriz)</h6>
                  <div class="table-responsive">
                     <table class="table table-sm table-bordered text-center align-middle mb-0" style="font-size: 0.85rem;">
                        <thead class="table-light">
                           <tr>
                              <th class="text-start text-muted">Aserción / Opción</th>
                              <th>Rara vez</th>
                              <th>A veces</th>
                              <th>Muy frecuente</th>
                           </tr>
                        </thead>
                        <tbody>
                           <tr>
                              <td class="text-start fw-medium text-muted">Me siento agotado</td>
                              <td><input type="number" class="form-control form-control-sm mx-auto text-success fw-bold text-center border-secondary" style="width: 65px;" value="1" step="0.5"></td>
                              <td><input type="number" class="form-control form-control-sm mx-auto text-success fw-bold text-center border-secondary" style="width: 65px;" value="2" step="0.5"></td>
                              <td><input type="number" class="form-control form-control-sm mx-auto text-success fw-bold text-center border-secondary" style="width: 65px;" value="3" step="0.5"></td>
                           </tr>
                           <tr>
                              <td class="text-start fw-medium text-muted">Tengo dolores de cabeza</td>
                              <td><input type="number" class="form-control form-control-sm mx-auto text-success fw-bold text-center border-secondary" style="width: 65px;" value="1" step="0.5"></td>
                              <td><input type="number" class="form-control form-control-sm mx-auto text-success fw-bold text-center border-secondary" style="width: 65px;" value="2" step="0.5"></td>
                              <td><input type="number" class="form-control form-control-sm mx-auto text-success fw-bold text-center border-secondary" style="width: 65px;" value="3" step="0.5"></td>
                           </tr>
                        </tbody>
                     </table>
                  </div>
               </div>`;
        }

        if (containerT) {
          containerT.innerHTML = `
               <div class="border rounded bg-white p-3 shadow-sm mb-2 border-primary">
                  <h6 class="fw-bold text-primary mb-2 text-truncate" title="P6 - Asocie la tarjeta con la emoción (Tarjeta)">P6 - Asocie la tarjeta con la emoción (Tarjeta)</h6>
                  <div class="d-flex flex-wrap gap-2">
                     <div class="border rounded p-2 text-center bg-light" style="width: 140px;">
                        <i class="fas fa-image fa-2x text-muted mb-2"></i><br>
                        <span class="small fw-bold text-dark d-block text-truncate" title="Opción 1">Ficha A</span>
                        <div class="mt-2 input-group input-group-sm">
                           <span class="input-group-text bg-white p-1 px-2 border-secondary fw-bold text-muted">Pts</span>
                           <input type="number" class="form-control text-center text-success fw-bold border-secondary" value="2.5" step="0.5">
                        </div>
                     </div>
                     <div class="border rounded p-2 text-center bg-light" style="width: 140px;">
                        <i class="fas fa-image fa-2x text-muted mb-2"></i><br>
                        <span class="small fw-bold text-dark d-block text-truncate" title="Opción 2">Ficha B</span>
                        <div class="mt-2 input-group input-group-sm">
                           <span class="input-group-text bg-white p-1 px-2 border-secondary fw-bold text-muted">Pts</span>
                           <input type="number" class="form-control text-center text-success fw-bold border-secondary" value="5.0" step="0.5">
                        </div>
                     </div>
                  </div>
               </div>`;
        }
      }

      function nextStep() {
        if (currentStep === 0) {
          const cod = document.getElementById("prCod").value.trim();
          const nom = document.getElementById("prNom").value.trim();
          if (!cod || !nom) {
            alert("⚠️ Debes completar Código y Nombre para continuar.");
            return;
          }
        }
        if (currentStep < TOTAL_STEPS - 1) goStep(currentStep + 1);
      }
      function prevStep() {
        if (currentStep > 0) goStep(currentStep - 1);
      }

      function nuevaPrueba() {
        document.getElementById("tPrueba").innerHTML =
          '<i class="fas fa-file-medical-alt me-2 text-primary"></i>Nueva Prueba Psicológica';
        ["prCod", "prNom", "prIcon"].forEach(
          (id) => (document.getElementById(id).value = ""),
        );
        document.getElementById("prCod").disabled = false;
        document.getElementById("prIconoSelect").value = "fa-brain";
        document.getElementById("prEmojiPreview").innerHTML =
          '<i class="fas fa-brain"></i>';
        resetBox("boxPreg", "emptyPreg", "fas fa-question", "Sin preguntas.");
        resetBox("boxFac", "emptyFac", "fas fa-layer-group", "Sin factores.");

        document.getElementById("portadaTitulo").value = "";
        document.getElementById("portadaInstrucciones").value = "";
        document.getElementById("selectPlantillaPortada").value = "estandar";
        renderPreviewPortada();

        go("prueba-form");
        goStep(0);
      }

      function editarPrueba(cod) {
        document.getElementById("tPrueba").innerHTML =
          '<i class="fas fa-pen me-2 text-primary"></i>Editar Prueba: ' + cod;
        const demos = {
          "PSI-ANS-001": { nom: "Escala de Ansiedad de Beck", tipo: "ingreso", est: "activo", icon: "fa-brain", step: 3 },
          "PSI-CMP-002": { nom: "Competencias Laborales Volcán", tipo: "periodico", est: "borrador", icon: "fa-puzzle-piece", step: 3 },
          "PSI-ALT-003": { nom: "Evaluación Psicológica – Altura", tipo: "altura", est: "borrador", icon: "fa-helmet-safety", step: 3 },
          "PSI-CHI-004": { nom: "Entrevista Psicológica Chinalco", tipo: "retiro", est: "cesado", icon: "fa-clipboard-check", step: 3 },
          "EST-STRESS-010": { nom: "Escala de Estrés Percibido", tipo: "periodico", est: "activo", icon: "fa-face-smile", step: 3 },
          "PSI-VOC-005": { nom: "Test Orientación Vocacional", tipo: "ingreso", est: "activo", icon: "fa-graduation-cap", step: 3 },
        };
        const d = demos[cod];
        if (d) {
          document.getElementById("prCod").value = cod;
          document.getElementById("prCod").disabled = true;
          document.getElementById("prNom").value = d.nom;
          document.getElementById("prIcon").value = d.icon;
          document.getElementById("prIconoSelect").value = d.icon;
          document.getElementById("prEmojiPreview").innerHTML =
            '<i class="fas ' + d.icon + '"></i>';
          resetBox("boxPreg", "emptyPreg", "fas fa-question", "Sin preguntas.");
          
          const btnPrev = document.querySelector("#screen-prueba-form button[onclick*='previsualizarPrueba']");
          if (btnPrev) btnPrev.setAttribute("onclick", `previsualizarPrueba('${cod}')`);

          resetBox("boxFac", "emptyFac", "fas fa-layer-group", "Sin factores.");
          if (d.step >= 1) {
            document.getElementById("selectPlantillaPortada").value =
              "detallada";
            document.getElementById("portadaTitulo").value =
              d.nom + " - Bienvenida";
            document.getElementById("portadaInstrucciones").value =
              "1. Lea atentamente antes de contestar.\n2. No hay respuestas correctas o incorrectas.\n3. Tiene un tiempo límite según aplique.";
            renderPreviewPortada();
          }
          if (d.step >= 2 && PRUEBAS_DEMO[cod]) {
            PRUEBAS_DEMO[cod].preguntas.forEach((q, i) => {
              pushItem("boxPreg", "emptyPreg", rowPregunta(i + 1, q.texto, q.tipo));
            });
          }
          if (d.step >= 3 && PRUEBAS_DEMO[cod] && PRUEBAS_DEMO[cod].factores) {
            PRUEBAS_DEMO[cod].factores.forEach(f => {
              pushItem("boxFac", "emptyFac", rowFactor(f.cod, f.nom));
            });
          }
          if (d.step >= 5) {
            // Ya no existe step 4 Claves de Respuesta original, pero simulamos Factores que es paso 6
          }
          go("prueba-form");
          goStep(d.step > 6 ? 6 : d.step);
        }
      }

      function guardarPrueba() {
        showToast("✅ Prueba guardada como Borrador.");
        setTimeout(() => go("pruebas"), 300);
      }

      function renderPreviewPortada() {
        const plantilla = document.getElementById(
          "selectPlantillaPortada",
        ).value;
        const titulo =
          document.getElementById("portadaTitulo").value ||
          "TÍTULO DE LA PORTADA";
        const instrucciones =
          document.getElementById("portadaInstrucciones").value ||
          "Instrucciones de la prueba irán aquí...";
        const container = document.getElementById("previewPortada");
        const fileInput = document.getElementById("portadaImagen");

        let imagesHtml = "";

        if (fileInput && fileInput.files && fileInput.files.length > 0) {
          for (let i = 0; i < fileInput.files.length; i++) {
            const fileUrl = URL.createObjectURL(fileInput.files[i]);
            imagesHtml += `<img src="${fileUrl}" style="height: 140px; width: auto; max-width: 100%; object-fit: contain; border-radius: 2px;" />`;
          }
        } else {
          const fallbackImageSvg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'><rect width='400' height='300' fill='#e2e8f0'/><circle cx='200' cy='120' r='45' fill='#cbd5e1'/><path d='M100,300 C100,200 300,200 300,300 Z' fill='#94a3b8'/><text x='200' y='280' text-anchor='middle' font-family='sans-serif' font-size='14' fill='#64748b'>Sin imagen</text></svg>`;
          const imgSrc = `data:image/svg+xml,${encodeURIComponent(fallbackImageSvg)}`;
          imagesHtml = `<img src="${imgSrc}" style="width: 100%; height: auto; max-height: 200px; object-fit: contain; border-radius: 2px;" />`;
        }

        let htmlPreview = "";

        // Asegurar que los saltos de línea se respeten en HTML si no usamos pre-wrap, pero pre-wrap es mejor
        const estiloTexto =
          "font-size: 0.95rem; line-height: 1.5; white-space: pre-wrap;";

        if (plantilla === "estandar") {
          // Diseño lado a lado limpio (Clínico)
          htmlPreview = `
            <div style="background-color: #ffffff; width: 100%; min-height: 240px; padding: 25px; text-align: left; box-sizing: border-box; border-radius: 6px;">
                <h2 style="color: #0d2a75; font-weight: 800; margin-bottom: 5px; font-size: 1.3rem; line-height: 1.2; text-transform: uppercase;">${titulo}</h2>
                <h4 style="color: #0b347a; font-weight: 700; margin-bottom: 20px; font-size: 0.9rem; text-transform: uppercase;"></h4>
                
                <div style="display: flex; gap: 20px; align-items: flex-start; flex-wrap: wrap;">
                  <div style="flex: 1.2; min-width: 280px; display: flex; flex-direction: row; flex-wrap: wrap; justify-content: center; align-items: center; gap: 10px; background: #fff; padding: 10px; border: 1px solid #e2e8f0; box-shadow: 2px 2px 10px rgba(0,0,0,0.08); border-radius: 4px;">
                     ${imagesHtml}
                  </div>
              
                  <div style="flex: 2; min-width: 300px; color: #0d2a75;">
                     <h5 style="font-weight: 800; font-size: 1rem; margin-bottom: 8px;">INSTRUCCIONES:</h5>
                     <div style="${estiloTexto}">${instrucciones}</div>
                  </div>
                </div>
            </div>
          `;
        } else if (plantilla === "detallada") {
          // Diseño vertical limpio con recuadro
          htmlPreview = `
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-top: 5px solid #0d2a75; width: 100%; min-height: 240px; padding: 25px; text-align: center; box-sizing: border-box; border-radius: 6px;">
                <h2 style="color: #0d2a75; font-weight: 800; margin-bottom: 5px; font-size: 1.4rem; line-height: 1.2; text-transform: uppercase;">${titulo}</h2>
                <h4 style="color: #1e3a8a; font-weight: 700; margin-bottom: 20px; font-size: 0.9rem; text-transform: uppercase;">EVALUACIÓN PSICOLÓGICA DETALLADA</h4>
                
                <div style="display: flex; flex-direction: column; align-items: center; gap: 20px;">
                  <div style="width: 100%; max-width: 600px; display: flex; flex-direction: row; flex-wrap: wrap; justify-content: center; gap: 10px; background: #fff; padding: 5px; border: 1px solid #e2e8f0; box-shadow: 2px 2px 10px rgba(0,0,0,0.08); border-radius: 4px;">
                     ${imagesHtml}
                  </div>
              
                  <div style="width: 100%; color: #0d2a75; text-align: left; background: #ffffff; padding: 20px; border-radius: 6px; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
                     <h5 style="font-weight: 800; font-size: 1rem; margin-bottom: 8px;">INSTRUCCIONES:</h5>
                     <div style="${estiloTexto}">${instrucciones}</div>
                  </div>
                </div>
            </div>
          `;
        }

        container.innerHTML = htmlPreview;
      }

      function filtrarPruebas() {
        const q = document
          .getElementById("buscarPrueba")
          .value.trim()
          .toLowerCase();
        document
          .querySelectorAll("#listaPruebas .card-prueba")
          .forEach((card) => {
            const txt = (
              (card.dataset.nombre || "") +
              " " +
              (card.dataset.tipo || "") +
              " " +
              (card.dataset.codigo || "")
            ).toLowerCase();
            card.style.display = txt.includes(q) ? "" : "none";
          });
      }

      function filtrarPantalla(id, value) {
        const q = value.trim().toLowerCase();
        document.querySelectorAll("#" + id + " .card-item").forEach((card) => {
          const txt = card.textContent.toLowerCase();
          card.style.display = txt.includes(q) ? "" : "none";
        });
      }

      function filtrarCool(id, value) {
        const q = value.trim().toLowerCase();
        const cards = document.querySelectorAll("#" + id + " .card-item");

        cards.forEach((card, index) => {
          const txt = card.textContent.toLowerCase();
          const match = txt.includes(q);

          if (match) {
            card.style.display = "flex";
            // Retraso escalonado sutil para dar efecto "cascada"
            setTimeout(() => {
              card.style.opacity = "1";
              card.style.transform = "translateY(0) scale(1)";
            }, index * 15);
          } else {
            card.style.opacity = "0";
            card.style.transform = "translateY(5px) scale(0.98)";
            setTimeout(() => {
              if (card.style.opacity === "0") {
                card.style.display = "none";
              }
            }, 250);
          }
        });
      }

      function filtrarPillContainer(id, value) {
        const q = value.trim().toLowerCase();
        document.querySelectorAll("#" + id + " .item-row").forEach((card) => {
          const txt = card.textContent.toLowerCase();
          card.style.display = txt.includes(q) ? "" : "none";
        });
      }
      function filtrarPreguntas() {
        const q = document
          .getElementById("buscarPregunta")
          .value.trim()
          .toLowerCase();
        const tipoSel = document.getElementById("filtroTipoPregunta").value;
        document.querySelectorAll("#boxPreg .item-row").forEach((row) => {
          const txt = row.querySelector(".desc")
            ? row.querySelector(".desc").textContent.toLowerCase()
            : "";
          const rowTipo = row.getAttribute("data-tipo") || "";
          const matchText = txt.includes(q);
          const matchTipo = tipoSel === "todos" || rowTipo === tipoSel;
          row.style.display = matchText && matchTipo ? "" : "none";
        });
      }

      /* ACTUALIZACIÓN - RESTAURAR TIPO DE VIÑETA Y EVITAR REGRESIONES NO SOLICITADAS */
      function numeroARomano(num) {
        const mapa = [
          [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
          [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
          [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]
        ];
        let resultado = "";
        let n = Math.max(1, parseInt(num, 10) || 1);
        for (const [valor, simbolo] of mapa) {
          while (n >= valor) {
            resultado += simbolo;
            n -= valor;
          }
        }
        return resultado;
      }

      function obtenerVinetaAutomatica(index, totalItems = 0, tipo = "letras") {
        const pos = index + 1;
        if (tipo === "num") return pos + ")";
        if (tipo === "rom") return numeroARomano(pos) + ")";
        if (tipo === "otros") return "";
        if (totalItems > 26) return pos + ")";
        return String.fromCharCode(65 + index) + ")";
      }

      function getTipoVinetaContenedor(container) {
        if (!container) return "letras";
        const prefijo = container.id && container.id.startsWith("mp_A_") ? "mp_A" : "mp_C";
        const select = document.getElementById(prefijo + "_vineta");
        return select ? select.value : "letras";
      }

      function actualizarModoVineta(selectEl, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        const manual = selectEl && selectEl.value === "otros";
        container.querySelectorAll(".manual-bullet-input").forEach((input) => {
          input.style.display = manual ? "" : "none";
        });
        renumerarContenedor("#" + containerId);
      }

      function renumerarContenedor(containerSelector) {
        const container = document.querySelector(containerSelector);
        if (!container) return;
        const isAlt = containerSelector.includes("alternativas");
        const items = container.querySelectorAll(
          isAlt ? ".item-alt" : ".item-row",
        );
        const tipoVineta = isAlt ? getTipoVinetaContenedor(container) : "letras";
        items.forEach((item, index) => {
          const inp = item.querySelector(".pos-input");
          if (inp) inp.value = index + 1;
          
          if (isAlt) {
            const badgeVineta = item.querySelector(".badge-bullet");
            const manualInput = item.querySelector(".manual-bullet-input");
            if (manualInput) {
              manualInput.style.display = tipoVineta === "otros" ? "" : "none";
            }
            if (badgeVineta) {
              badgeVineta.textContent = tipoVineta === "otros"
                ? ((manualInput && manualInput.value.trim()) ? manualInput.value.trim() : "•")
                : obtenerVinetaAutomatica(index, items.length, tipoVineta);
            }
          } else {
            const badge = item.querySelector(".badge.bg-primary");
            if (badge) badge.textContent = `P${index + 1}`;
          }
        });
      }

      let draggedPregItem = null;
      function dragPregRow(e) {
        draggedPregItem = e.target.closest(".item-row");
        e.dataTransfer.effectAllowed = "move";
        setTimeout(() => {
          if (draggedPregItem) draggedPregItem.style.opacity = "0.5";
        }, 0);
      }
      function dragOverPregRow(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        const overItem = e.target.closest(".item-row");
        if (overItem && overItem !== draggedPregItem) {
          const list = overItem.parentNode;
          const items = [...list.querySelectorAll(".item-row")];
          if (items.indexOf(draggedPregItem) < items.indexOf(overItem))
            overItem.after(draggedPregItem);
          else overItem.before(draggedPregItem);
        }
      }
      function dropPregRow(e) {
        e.stopPropagation();
        return false;
      }
      function dragEndPregRow(e) {
        if (draggedPregItem) draggedPregItem.style.opacity = "1";
        const pId = draggedPregItem ? draggedPregItem.parentNode.id : "boxPreg";
        draggedPregItem = null;
        renumerarContenedor("#" + pId);
      }

      function duplicarPregunta(btn) {
        const row = btn.closest(".item-row");
        let txt = "Pregunta Copiada";
        const descEl = row.querySelector(".desc-text");
        if (descEl) txt = descEl.textContent;

        let tipoBadge = row.querySelector(".badge.bg-dark");
        let tipo = "abierta";
        if (tipoBadge) {
          const lbl = tipoBadge.textContent.toLowerCase();
          if (lbl.includes("cerrada")) tipo = "cerrada";
          else if (lbl.includes("matriz")) tipo = "matriz";
          else if (lbl.includes("tarjeta")) tipo = "tarjeta";
        }

        const sel = document.getElementById("mpTipoPreg_Master");
        if (sel) {
          sel.value = tipo;
          renderizarControlesPregunta();
          setTimeout(() => {
            const mapIdA = "mp_A_text";
            const mapIdC = "mp_C_text";
            if (tipo === "abierta" && document.getElementById(mapIdA)) {
              document.getElementById(mapIdA).value = txt + " (Copia)";
            } else if (tipo === "cerrada" && document.getElementById(mapIdC)) {
              document.getElementById(mapIdC).value = txt + " (Copia)";
            }
            const m = new bootstrap.Modal(
              document.getElementById("modalNuevaPregunta"),
            );
            m.show();
          }, 50);
        }
      }

      function reordenarPorInput(input, containerSelector) {
        let val = parseInt(input.value);
        if (isNaN(val) || val < 1) val = 1;

        const row = input.closest(".item-row") || input.closest(".item-alt");
        const container = document.querySelector(containerSelector);
        if (!row || !container) return;

        const children = Array.from(container.children);
        const max = children.length;
        if (val > max) val = max;

        const newPos = val - 1;
        if (children[newPos] !== row) {
          if (newPos === max - 1) {
            container.appendChild(row);
          } else {
            const target = children[newPos];
            if (children.indexOf(row) < newPos) {
              target.after(row);
            } else {
              target.before(row);
            }
          }
        } else {
          input.value = children.indexOf(row) + 1;
        }
        renumerarContenedor(containerSelector);
      }

      function renderizarControlesPregunta() {
        const tipo = document.getElementById("mpTipoPreg_Master").value;
        const c = document.getElementById("mpContenedorPregunta");

        if (!tipo) {
          c.style.display = "none";
          return;
        }
        c.style.display = "block";

        let html = "";
        if (tipo === "abierta") {
          html = `
            <div class="p-3 mb-0 border rounded shadow-sm bg-white border-top border-4" style="border-top-color: #f59e0b !important;">
              <h6 class="fw-bold mb-3"><i class="fas fa-align-left me-2 text-warning"></i>Configuración - Plantilla de Resultados</h6>
              
              <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label text-muted small fw-bold mb-1">Tipo de Vista</label>
                    <select class="form-select" id="mp_A_tipoVista" onchange="document.getElementById('mp_A_boxNumCol').style.display = this.value === '3' ? 'block' : 'none';">
                      <option value="1">Básica</option>
                      <option value="2">Ventana emergente (solo modal)</option>
                      <option value="3">Tabla</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label text-muted small fw-bold mb-1">Tipo de Dato de la Pregunta</label>
                    <select class="form-select" id="mp_A_tipoDato" onchange="ctrlAbierta()">
                      <option value="texto">Texto</option>
                      <option value="imagen">Imagen</option>
                      <option value="texto_imagen">Texto/Imagen</option>
                    </select>
                  </div>
                  
                  <div class="col-md-12" id="mp_A_boxText">
                    <label class="form-label fw-bold small text-primary mb-1">Descripción de Pregunta</label>
                    <input type="text" class="form-control" id="mp_A_text" placeholder="Escribe tu pregunta abierta aquí...">
                  </div>
                  
                  <div class="col-md-12" id="mp_A_boxImage" style="display:none;">
                    <label class="form-label fw-bold small text-primary mb-1"><i class="fas fa-image me-1"></i> Subir Imagen</label>
                    <input type="file" class="form-control" accept="image/*" style="display:inline-block; width:calc(100% - 110px);"><select class="form-select form-select-sm mt-1 float-end w-auto d-inline-block ps-2 pe-4" title="Tamaño de vista"><option value="small">Pequeño</option><option value="medium" selected>Mediano</option><option value="large">Grande</option></select>
                  </div>
                  
                  <div class="col-md-4">
                    <label class="form-label text-muted small fw-bold mb-1">Tipo de Respuesta</label>
                    <select class="form-select" id="mp_A_tipoResp" onchange="ctrlAbierta()">
                      <option value="unica">Única</option>
                      <option value="multiple">Múltiple</option>
                    </select>
                  </div>
                  
                  <div class="col-md-4" id="mp_A_boxNumResp" style="display:none;">
                    <label class="form-label text-muted small fw-bold mb-1">Cant. de Resp.</label>
                    <input type="number" class="form-control" id="mp_A_numResp" value="2" min="2" oninput="ctrlAbierta()">
                  </div>

                  <div class="col-md-4" id="mp_A_boxNumRespValidas" style="display:none;">
                    <label class="form-label text-muted small fw-bold mb-1">Resp. Válidas</label>
                    <input type="number" class="form-control" id="mp_A_numRespVal" value="1" min="1">
                  </div>

                  <div class="col-md-4" id="mp_A_boxNumCol" style="display:none;">
                    <label class="form-label text-muted small fw-bold mb-1">Nº Columnas</label>
                    <input type="number" class="form-control" id="mp_A_numCol" value="1" min="1" max="10">
                  </div>
                  
                  <div class="col-md-4">
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
                  </div>

                  <div class="col-md-12 mt-2">
                    <div class="d-flex align-items-center gap-3">
                      <label class="form-label m-0 text-muted small fw-bold">¿Tiene precarga? (Valores por defecto)</label>
                      <div class="form-check form-check-inline m-0">
                        <input class="form-check-input" type="radio" name="mp_A_precargaRd" id="mp_A_precargaNo" value="no" checked onchange="ctrlAbierta()">
                        <label class="form-check-label" for="mp_A_precargaNo">No</label>
                      </div>
                      <div class="form-check form-check-inline m-0">
                        <input class="form-check-input" type="radio" name="mp_A_precargaRd" id="mp_A_precargaSi" value="si" onchange="ctrlAbierta()">
                        <label class="form-check-label" for="mp_A_precargaSi">Sí</label>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-12 mt-2">
                    <div class="form-check form-switch m-0">
                      <input class="form-check-input" type="checkbox" id="mp_A_editable" checked>
                      <label class="form-check-label small fw-bold text-muted" for="mp_A_editable">¿Es editable por el usuario?</label>
                    </div>
                  </div>
                  
                  <div class="col-md-12" id="mp_A_boxPrecarga" style="display:none;">
                     <div class="p-3 bg-light rounded border border-secondary border-opacity-25" id="mp_A_precargaFields"></div>
                  </div>

<div class="col-12 mt-4" style="display: none;">
                     <div class="d-flex justify-content-between align-items-center mb-2">
                       <h6 class="fw-bold text-muted m-0"><i class="fas fa-list mt-1 me-1"></i> Creador de Alternativas / Claves</h6>
                     </div>
                     <div id="mp_A_alternativas_box" class="d-flex flex-column gap-2 mb-3"></div>
                     <button class="btn btn-outline-warning text-dark btn-sm w-100 border-dashed fw-bold py-2" onclick="addMpaAlternativa()">
                       <i class="fas fa-plus me-1"></i> Añadir Nueva Alternativa
                     </button>
                  </div>
              </div>
            </div>
          `;
        } else if (tipo === "cerrada") {
          html = `
            <div class="p-3 mb-0 border rounded shadow-sm bg-white border-top border-4" style="border-top-color: #3b82f6 !important;">
              <h6 class="fw-bold mb-3"><i class="fas fa-check-circle me-2 text-primary"></i>Configuración - Pregunta Cerrada</h6>
              <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label text-muted small fw-bold mb-1">Tipo de Vista</label>
                    <select class="form-select" id="mp_C_tipoVista" onchange="document.getElementById('mp_C_boxNumCol').style.display = this.value === '3' ? 'block' : 'none';">
                      <option value="1">Básica</option>
                      <option value="2">Ventana emergente (solo modal)</option>
                      <option value="3">Tabla</option>
                    </select>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label text-muted small fw-bold mb-1">Tipo de Dato de la Pregunta</label>
                    <select class="form-select" id="mp_C_tipoDato" onchange="ctrlCerrada()">
                      <option value="texto">Texto</option>
                      <option value="imagen">Imagen</option>
                      <option value="texto_imagen">Texto/Imagen</option>
                    </select>
                  </div>
                  
                  <div class="col-md-12" id="mp_C_boxText">
                    <label class="form-label fw-bold small text-primary mb-1">Descripción de Pregunta</label>
                    <input type="text" class="form-control" id="mp_C_text" placeholder="Escribe tu pregunta cerrada aquí...">
                  </div>
                  
                  <div class="col-md-12" id="mp_C_boxImage" style="display:none;">
                    <label class="form-label fw-bold small text-primary mb-1"><i class="fas fa-image me-1"></i> Subir Imagen</label>
                    <div class="d-flex gap-2 mt-1"><input type="file" class="form-control" accept="image/*"><select class="form-select px-2 w-auto border-secondary"><option value="small">IMG: Pequeño</option><option value="medium" selected>IMG: Mediano</option><option value="large">IMG: Grande</option></select></div>
                  </div>
                  
                  <div class="col-md-4">
                    <label class="form-label text-muted small fw-bold mb-1">Tipo de Respuesta</label>
                    <select class="form-select" id="mp_C_tipoResp" onchange="ctrlCerrada()">
                      <option value="unica">Única</option>
                      <option value="multiple">Múltiple</option>
                    </select>
                  </div>
                  
                  <div class="col-md-4" id="mp_C_boxNumResp" style="display:none;">
                    <label class="form-label text-muted small fw-bold mb-1">Límite Múltiple</label>
                    <input type="number" class="form-control" id="mp_C_numResp" value="2" min="2">
                  </div>

                  <div class="col-md-4" id="mp_C_boxNumCol" style="display:none;">
                    <label class="form-label text-muted small fw-bold mb-1">Nº Columnas</label>
                    <input type="number" class="form-control" id="mp_C_numCol" value="1" min="1" max="6">
                  </div>

                  <div class="col-md-4">
                    <label class="form-label text-muted small fw-bold mb-1">Tipo de Viñeta</label>
                    <select class="form-select" id="mp_C_vineta" onchange="actualizarModoVineta(this, 'mp_C_alternativas_box')">
                      <option value="letras" selected>Letras</option>
                      <option value="num">Números</option>
                      <option value="rom">Números romanos</option>
                      <option value="otros">Otros</option>
                    </select>
                  </div>

                  <div class="col-md-8 mt-2 d-flex flex-column gap-1 justify-content-center">
                    <div class="form-check form-switch mt-1">
                      <input class="form-check-input" type="checkbox" id="mp_C_precarga" onchange="document.getElementById('mp_C_precarga_opciones').style.display = this.checked ? 'block' : 'none'; ">
                      <label class="form-check-label small fw-bold text-muted fw-bold">Activar Precarga</label>
                    </div>
                    <div id="mp_C_precarga_opciones" style="display:none;" class="mt-2 ps-4 border-start border-3 border-primary bg-light p-2 rounded">
                      <label class="form-label small fw-bold text-primary mb-1">Alternativa(s) por defecto:</label>
                      <input type="text" class="form-control form-control-sm" id="mp_C_precarga_defecto" placeholder="Ej: A, B o texto de alternativa">
                    </div>
                    <div class="form-check form-switch mt-1">
                      <input class="form-check-input" type="checkbox" id="mp_C_editable">
                      <label class="form-check-label small fw-bold text-muted fw-bold">¿Es editable por el usuario?</label>
                    </div>
                  </div>

<div class="col-12 mt-4">
                     <div class="d-flex justify-content-between align-items-center mb-2">
                       <h6 class="fw-bold text-muted m-0"><i class="fas fa-list mt-1 me-1"></i> Creador de Alternativas</h6>
                     </div>
                     <div id="mp_C_alternativas_box" class="d-flex flex-column gap-2 mb-3"></div>
                     <button class="btn btn-outline-primary btn-sm w-100 border-dashed fw-bold py-2" onclick="addMpcAlternativa()">
                       <i class="fas fa-plus me-1"></i> Añadir Nueva Alternativa
                     </button>
                  </div>
              </div>
            </div>
          `;
        } else if (tipo === "numerica") {
          html = `
            <div class="p-3 mb-0 border rounded shadow-sm bg-white border-top border-4" style="border-top-color: #10b981 !important;">
              <h6 class="fw-bold mb-3"><i class="fas fa-hashtag me-2 text-success"></i>Configuración - Pregunta Numérica</h6>
              <div class="row g-3">
                  <div class="col-md-12">
                    <label class="form-label fw-bold small text-primary mb-1">Descripción de Pregunta</label>
                    <input type="text" id="mp_N_text" class="form-control" placeholder="Escribe tu pregunta numérica aquí...">
                  </div>
                  <div class="col-md-6">
                    <label class="form-label text-muted small fw-bold mb-1">Valor Mínimo</label>
                    <input type="number" class="form-control" id="mp_N_min" placeholder="Ej: 0.0" step="0.5">
                  </div>
                  <div class="col-md-6">
                    <label class="form-label text-muted small fw-bold mb-1">Valor Máximo</label>
                    <input type="number" class="form-control" id="mp_N_max" placeholder="Ej: 10.0" step="0.5">
                  </div>
                  <div class="col-md-6">
                    <label class="form-label text-muted small fw-bold mb-1">Puntaje por Defecto</label>
                    <input type="number" class="form-control" id="mp_N_def" placeholder="Ej: 5.0" step="0.1">
                  </div>
              </div>
            </div>
          `;
        } else if (tipo === "matriz") {
          html = `
            <div class="p-3 mb-0 border rounded shadow-sm bg-white border-top border-4" style="border-top-color: #8b5cf6 !important;">
              <h6 class="fw-bold mb-3"><i class="fas fa-th me-2 text-purple" style="color:#8b5cf6"></i>Configuración - Pregunta Matriz</h6>
              <div class="row g-3">
                 <div class="col-md-9">
                   <label class="form-label fw-bold small text-primary mb-1">Descripción de la Matriz</label>
                   <input type="text" class="form-control" id="mp_M_text" placeholder="Escribe la pregunta matriz...">
                 </div>
                 <div class="col-md-3">
                   <label class="form-label text-muted small fw-bold mb-1">Nº Columnas Visibles</label>
                   <input type="number" class="form-control" id="mp_M_numCol" value="3" min="1" max="10">
                 </div>
                 <div class="col-md-6">
                   <label class="form-label text-muted small fw-bold mb-1">Filas (Sub-preguntas)</label>
                   <textarea class="form-control" id="mp_M_rows" rows="3" placeholder="Fila 1\\nFila 2\\n..."></textarea>
                 </div>
                 <div class="col-md-6">
                   <label class="form-label text-muted small fw-bold mb-1">Columnas (Opciones)</label>
                   <textarea class="form-control" id="mp_M_cols" rows="3" placeholder="Opción 1\\nOpción 2\\n..."></textarea>
                 </div>
              </div>
            </div>`;
        } else if (tipo === "tarjeta") {
          html = `
            <div class="p-3 mb-0 border rounded shadow-sm bg-white border-top border-4" style="border-top-color: #ec4899 !important;">
              <h6 class="fw-bold mb-3"><i class="fas fa-id-card me-2 text-pink" style="color:#ec4899"></i>Configuración - Pregunta Tarjeta</h6>
              <div class="row g-3">
                 <div class="col-md-12">
                   <label class="form-label fw-bold small text-primary mb-1">Descripción de la Tarjeta</label>
                   <input type="text" class="form-control" placeholder="Escribe la descripción de identificación...">
                 </div>
                 <div class="col-md-12">
                   <label class="form-label fw-bold small text-primary mb-1">Contenido HTML / Rich Text</label>
                   <textarea class="form-control" rows="4" placeholder="Contenido descriptivo de la tarjeta de presentación..."></textarea>
                 </div>
              </div>
            </div>`;
        } else {
          html = `<div class="alert alert-secondary mb-0"><i class="fas fa-info-circle me-2"></i>Funcionalidad no implementada para '${tipo}' actualmente. Elige Abierta, Cerrada, Numérica, Matriz o Tarjeta.</div>`;
        }

        c.innerHTML = html;

        if (tipo === "abierta") {
          ctrlAbierta();
        }
        if (tipo === "cerrada") {
          ctrlCerrada();
          const bC = document.getElementById("mp_C_alternativas_box");
          bC.innerHTML = "";
          if (!bC.dataset.sortInit) {
            Sortable.create(bC, { handle: ".handle", animation: 150 });
            bC.dataset.sortInit = "1";
          }
          addMpcAlternativa();
        }
      }

      function ctrlAbierta() {
        const td = document.getElementById("mp_A_tipoDato").value;
        document.getElementById("mp_A_boxText").style.display =
          td === "texto" || td === "texto_imagen" ? "block" : "none";
        document.getElementById("mp_A_boxImage").style.display =
          td === "imagen" || td === "texto_imagen" ? "block" : "none";

        const tr = document.getElementById("mp_A_tipoResp").value;
        const isMulti = tr === "multiple";
        document.getElementById("mp_A_boxNumResp").style.display = isMulti
          ? "block"
          : "none";
        document.getElementById("mp_A_boxNumRespValidas").style.display =
          isMulti ? "block" : "none";

        const boxNumCol = document.getElementById("mp_A_boxNumCol");
        const tipoVista = document.getElementById("mp_A_tipoVista");
        if (boxNumCol && tipoVista) {
          boxNumCol.style.display = tipoVista.value === "3" ? "block" : "none";
        }

        const rdSi = document.getElementById("mp_A_precargaSi");
        const boxPrecarga = document.getElementById("mp_A_boxPrecarga");
        const countFields = isMulti
          ? parseInt(document.getElementById("mp_A_numResp").value) || 1
          : 1;

        if (rdSi && rdSi.checked) {
          boxPrecarga.style.display = "block";
          let inputsHtml =
            '<label class="form-label small text-primary fw-bold mb-2">Configure los valores por defecto a inyectar:</label>';
          for (let i = 1; i <= countFields; i++) {
            inputsHtml += `<input type="text" class="form-control form-control-sm mb-2" placeholder="Valor por defecto para el cajón ${i}...">`;
          }
          document.getElementById("mp_A_precargaFields").innerHTML = inputsHtml;
        } else {
          boxPrecarga.style.display = "none";
        }

      }

      function ctrlCerrada() {
        const td = document.getElementById("mp_C_tipoDato").value;
        document.getElementById("mp_C_boxText").style.display =
          td === "texto" || td === "texto_imagen" ? "block" : "none";
        document.getElementById("mp_C_boxImage").style.display =
          td === "imagen" || td === "texto_imagen" ? "block" : "none";
        const tr = document.getElementById("mp_C_tipoResp").value;
        document.getElementById("mp_C_boxNumResp").style.display =
          tr === "multiple" ? "block" : "none";
      }

      function addMpcAlternativa() {
        const box = document.getElementById("mp_C_alternativas_box");
        const n = box.querySelectorAll(".item-alt").length + 1;
        const div = document.createElement("div");
        div.className =
          "d-flex gap-2 align-items-center p-2 border rounded bg-white shadow-sm item-alt";
        div.innerHTML = `
            <i class="fas fa-grip-vertical text-black-50 handle" style="cursor: grab;"></i>
            <input type="number" class="pos-input d-none" value="${n}">
            <div style="width: 40px;" class="text-center fw-bold text-primary badge-bullet">A)</div>
            <input type="text" class="form-control form-control-sm manual-bullet-input" placeholder="Viñeta" style="width: 90px; display:none;" oninput="const p = this.closest('[id]'); if (p) renumerarContenedor('#' + p.id);">
            <div style="width: 100px;">
              <select class="form-select form-select-sm mpc-tipoalt bg-light text-muted" onchange="swMpcAlt(this)">
                 <option value="texto">Texto</option>
                 <option value="imagen">Imagen</option>
              </select>
            </div>
            <div class="flex-grow-1 mpc-dynamic-box d-flex align-items-center gap-2">
               <input type="text" class="form-control form-control-sm border-primary" placeholder="Descripción de la alternativa...">
               <div class="img-preview-circle d-none"></div>
            </div>
            <button class="btn btn-sm btn-outline-primary border-0" title="Duplicar" onclick="duplicarAlternativa(this)"><i class="fas fa-copy"></i></button>
            <button class="btn btn-sm btn-outline-danger border-0" title="Eliminar" onclick="const p = this.closest('[id]'); this.closest('.item-alt').remove(); renumerarContenedor('#' + p.id);"><i class="fas fa-times"></i></button>
         `;
        box.appendChild(div);
        const selectorVineta = document.getElementById("mp_C_vineta");
        if (selectorVineta) {
          actualizarModoVineta(selectorVineta, "mp_C_alternativas_box");
        } else {
          renumerarContenedor("#mp_C_alternativas_box");
        }
      }

      function addMpaAlternativa() {
        const box = document.getElementById("mp_A_alternativas_box");
        const n = box.querySelectorAll(".item-alt").length + 1;
        const div = document.createElement("div");
        div.className =
          "d-flex gap-2 align-items-center p-2 border rounded bg-white shadow-sm item-alt";
        div.innerHTML = `
            <i class="fas fa-grip-vertical text-black-50 handle" style="cursor: grab;"></i>
            <input type="number" class="pos-input d-none" value="${n}">
            <div style="width: 40px;" class="text-center fw-bold text-warning badge-bullet">A)</div>
            <input type="text" class="form-control form-control-sm manual-bullet-input" placeholder="Viñeta" style="width: 90px; display:none;" oninput="const p = this.closest('[id]'); if (p) renumerarContenedor('#' + p.id);">
            <div style="width: 100px;">
              <select class="form-select form-select-sm mpc-tipoalt bg-light text-muted" onchange="swMpcAlt(this)">
                 <option value="texto">Texto</option>
                 <option value="imagen">Imagen</option>
              </select>
            </div>
            <div class="flex-grow-1 mpc-dynamic-box d-flex align-items-center gap-2">
               <input type="text" class="form-control form-control-sm border-warning" placeholder="Descripción de la alternativa...">
               <div class="img-preview-circle d-none"></div>
            </div>
            <button class="btn btn-sm btn-outline-primary border-0" title="Duplicar" onclick="duplicarAlternativa(this)"><i class="fas fa-copy"></i></button>
            <button class="btn btn-sm btn-outline-danger border-0" title="Eliminar" onclick="const p = this.closest('[id]'); this.closest('.item-alt').remove(); renumerarContenedor('#' + p.id);"><i class="fas fa-times"></i></button>
         `;
        box.appendChild(div);
        const selectorVineta = document.getElementById("mp_A_vineta");
        if (selectorVineta) {
          actualizarModoVineta(selectorVineta, "mp_A_alternativas_box");
        } else {
          renumerarContenedor("#mp_A_alternativas_box");
        }
      }

      function duplicarAlternativa(btn) {
        const row = btn.closest(".item-alt");
        const p = row.parentNode;
        const clone = row.cloneNode(true);
        // Transfer select states
        const selOriginal = row.querySelector("select");
        const selClone = clone.querySelector("select");
        if (selOriginal && selClone) {
          selClone.value = selOriginal.value;
        }
        row.after(clone);
        renumerarContenedor("#" + p.id);
      }

      function swMpcAlt(sel) {
        const c = sel.parentElement.nextElementSibling;
        if (sel.value === "texto") {
          c.innerHTML =
            '<input type="text" class="form-control form-control-sm border-primary" placeholder="Descripción de la alternativa..."><div class="img-preview-circle d-none"></div>';
        } else {
          c.innerHTML = `
              <div class="d-flex align-items-center gap-2 w-100">
                <input type="file" class="form-control form-control-sm border-secondary p-0" accept="image/*" onchange="previewImgAlt(this)">
                <div class="img-preview-circle">
                  <i class="fas fa-image text-muted opacity-25"></i>
                </div>
                <select class="form-select form-select-sm px-1 border-secondary text-muted" style="width:70px;">
                  <option value="small">Pqñ</option>
                  <option value="medium" selected>Med</option>
                  <option value="large">Grd</option>
                </select>
              </div>`;
        }
      }

      function previewImgAlt(input) {
        const preview = input.parentElement.querySelector(
          ".img-preview-circle",
        );
        if (input.files && input.files[0]) {
          const reader = new FileReader();
          reader.onload = function (e) {
            preview.innerHTML = `<img src="${e.target.result}" style="width:100%; height:100%; object-fit:cover;">`;
          };
          reader.readAsDataURL(input.files[0]);
        }
      }

      function previsualizarPregunta() {
        const tipo = document.getElementById("mpTipoPreg_Master").value;
        if (!tipo) {
          showToast("Seleccione un tipo primero.");
          return;
        }

        let txt = "Pregunta de prueba";
        let opciones = ["Opción A", "Opción B", "Opción C", "Opción D"];

        if (tipo === "abierta" && document.getElementById("mp_A_text"))
          txt = document.getElementById("mp_A_text").value || txt;
        if (tipo === "cerrada" && document.getElementById("mp_C_text"))
          txt = document.getElementById("mp_C_text").value || txt;
        if (tipo === "matriz" && document.getElementById("mp_M_text"))
          txt = document.getElementById("mp_M_text").value || txt;
        if (tipo === "tarjeta" && document.getElementById("mp_T_text"))
          txt = document.getElementById("mp_T_text").value || txt;
        if (tipo === "numerica" && document.getElementById("mp_N_text"))
          txt = document.getElementById("mp_N_text").value || txt;

        const badgeMap = {
          cerrada: "Respuesta Cerrada",
          abierta: "Respuesta Abierta",
          matriz: "Tipo Matriz",
          tarjeta: "Tipo Tarjeta",
          numerica: "Numérica",
        };

        let qData = {
          tipo: tipo,
          texto: txt,
          badge: badgeMap[tipo] || "General",
          opciones: opciones,
        };

        // Extracción de datos específicos según el tipo
        if (tipo === "matriz") {
          const rowsVal = document.getElementById("mp_M_rows")?.value || "";
          const colsVal = document.getElementById("mp_M_cols")?.value || "";
          qData.filas = rowsVal
            .split("\n")
            .map((s) => s.trim())
            .filter((s) => s);
          qData.columnas = colsVal
            .split("\n")
            .map((s) => s.trim())
            .filter((s) => s);

          if (qData.filas.length === 0) qData.filas = ["Fila A", "Fila B"];
          if (qData.columnas.length === 0)
            qData.columnas = ["Col 1", "Col 2", "Col 3"];
        } else if (tipo === "tarjeta") {
          const contentVal = document.getElementById("mp_T_content")?.value || "";
          const lines = contentVal
            .split("\n")
            .map((s) => s.trim())
            .filter((s) => s);
          const emojis = ["⭐", "🔵", "🟢", "🔴", "🟡", "🟣", "⚪"];
          qData.tarjetas = lines.map((line, idx) => ({
            emoji: emojis[idx % emojis.length],
            label: line,
          }));
          if (qData.tarjetas.length === 0) {
            qData.tarjetas = [
              { emoji: "🌟", label: "Opción Premium A" },
              { emoji: "✨", label: "Opción Premium B" },
            ];
          }
        }

        let altBoxId = null;
        if (tipo === "abierta") altBoxId = "mp_A_alternativas_box";
        if (tipo === "cerrada") altBoxId = "mp_C_alternativas_box";
        if (tipo === "tarjeta") altBoxId = "mp_T_alternativas_box";

        if (altBoxId) {
          const altBox = document.getElementById(altBoxId);
          if (altBox) {
            const rowInputs = altBox.querySelectorAll(
              ".mpc-dynamic-box input[type='text']",
            );
            if (rowInputs.length > 0) {
              opciones = Array.from(rowInputs).map(
                (i) => i.value.trim() || "Alternativa sin texto",
              );
            }
          }
        }

        pvData = {
          titulo: "Previsualización de Pregunta",
          icono: "👁️",
          tipo: "Prueba de Diseño",
          desc: "Vista previa generada al vuelo.",
          tiempo: "--:--",
          preguntas: [qData],
        };

        pvIdx = 0;
        pvSeconds = 0;
        pvRespuestas = {};

        document.getElementById("pvTitle").textContent = pvData.titulo;
        document.getElementById("pvSubtitle").textContent = pvData.tipo;
        document.getElementById("pvIcon").textContent = pvData.icono;
        document.getElementById("pvCoverIcon").textContent = pvData.icono;
        document.getElementById("pvCoverTitle").textContent = pvData.titulo;
        document.getElementById("pvCoverDesc").textContent = pvData.desc;
        document.getElementById("pvTotalQ").textContent = 1;
        document.getElementById("pvEstTime").textContent = pvData.tiempo;

        // Force skip cover directly to questions for quick preview
        pvShow("pvPortada", false);
        pvShow("pvPreguntas", true, "block");
        pvShow("pvFinal", false);
        document.getElementById("pvTimer").style.display = "flex";

        if (pvTimerInterval) clearInterval(pvTimerInterval);
        pvTimerInterval = setInterval(() => {
          pvSeconds++;
          const m = String(Math.floor(pvSeconds / 60)).padStart(2, "0");
          const s = String(pvSeconds % 60).padStart(2, "0");
          document.getElementById("pvTimerText").textContent = m + ":" + s;
        }, 1000);

        renderPregunta();

        // Ocultar modal de edición momentaneamente
        const m = bootstrap.Modal.getInstance(
          document.getElementById("modalNuevaPregunta"),
        );
        if (m) m.hide();

        new bootstrap.Modal(document.getElementById("modalPreview")).show();

        // Al cerrar el modalPreview, podemos opcionalmente re-abrir el editor
        const previewEl = document.getElementById("modalPreview");

        const cleanupPreview = () => {
          if (
            preguntaActualEditando ||
            document.getElementById("mpTipoPreg_Master").value
          ) {
            new bootstrap.Modal(
              document.getElementById("modalNuevaPregunta"),
            ).show();
          }
          previewEl.removeEventListener("hidden.bs.modal", cleanupPreview);
        };
        previewEl.addEventListener("hidden.bs.modal", cleanupPreview);
      }

      let preguntaActualEditando = null;

      function editarPreguntaRow(btn) {
        preguntaActualEditando = btn.closest(".item-row");
        const tipo = preguntaActualEditando.getAttribute("data-tipo");
        const txt =
          preguntaActualEditando.querySelector(".desc-text").textContent;

        const sel = document.getElementById("mpTipoPreg_Master");
        if (sel) {
          sel.value = tipo;
          renderizarControlesPregunta();
          setTimeout(() => {
            const mapIdA = "mp_A_text";
            const mapIdC = "mp_C_text";
            if (tipo === "abierta" && document.getElementById(mapIdA)) {
              document.getElementById(mapIdA).value = txt;
            } else if (tipo === "cerrada" && document.getElementById(mapIdC)) {
              document.getElementById(mapIdC).value = txt;
            }
            new bootstrap.Modal(
              document.getElementById("modalNuevaPregunta"),
            ).show();
          }, 50);
        }
      }

      function guardarNuevaPregunta() {
        const tipo = document.getElementById("mpTipoPreg_Master").value;
        if (!tipo) {
          alert("Selecciona el tipo de pregunta");
          return;
        }

        let txt =
          "Nueva Pregunta " +
          (document.querySelectorAll("#boxPreg .item-row").length + 1);
        if (tipo === "abierta" && document.getElementById("mp_A_text"))
          txt = document.getElementById("mp_A_text").value || txt;
        if (tipo === "cerrada" && document.getElementById("mp_C_text"))
          txt = document.getElementById("mp_C_text").value || txt;

        const div = document.createElement("div");

        if (preguntaActualEditando) {
          // Edit mode
          let n = 1;
          const posInput = preguntaActualEditando.querySelector(".pos-input");
          if (posInput) n = parseInt(posInput.value) || 1;

          div.innerHTML = rowPregunta(n, txt, tipo);
          preguntaActualEditando.outerHTML = div.innerHTML;
          preguntaActualEditando = null;
          showToast("✅ Pregunta actualizada.");
        } else {
          // Create mode
          const n = document.querySelectorAll("#boxPreg .item-row").length + 1;
          div.innerHTML = rowPregunta(n, txt, tipo);
          const empty = document.getElementById("emptyPreg");
          if (empty) empty.remove();
          document.getElementById("boxPreg").appendChild(div.firstElementChild);
          showToast("✅ Pregunta generada y guardada.");
        }

        bootstrap.Modal.getInstance(
          document.getElementById("modalNuevaPregunta"),
        ).hide();
      }

      function addAlternativa() {
        const clave = document
            .getElementById("altClave")
            .value.trim()
            .toUpperCase(),
          desc = document.getElementById("altDesc").value.trim(),
          pts = document.getElementById("altPts").value.trim();
        if (!clave || !desc) {
          alert("Completa clave y descripción.");
          return;
        }
        pushItem("boxAlt", "emptyAlt", rowAlternativa(clave, desc, pts));
        ["altClave", "altDesc", "altPts"].forEach(
          (id) => (document.getElementById(id).value = ""),
        );
      }
      function rowAlternativa(clave, desc, pts) {
        return `<div class="item-row"><div class="inf"><span class="tag" style="background:#F3E8FF;color:#6B21A8;font-weight:700">${clave}</span><span class="fw-medium">${desc}</span>${pts !== "" ? `<span class="tag" style="background:#E0F2FE;color:#0369A1">${pts} pts</span>` : ""}</div><button class="btn btn-light rounded-circle text-danger p-0" style="width:32px;height:32px;" onclick="this.closest('.item-row').remove()"><i class="fas fa-times"></i></button></div>`;
      }

      function insertarFormula(txt) {
        const t = document.getElementById("facFormula");
        const start = t.selectionStart;
        const end = t.selectionEnd;
        t.value = t.value.substring(0, start) + txt + t.value.substring(end);

        // Sync UI
        syncFormula(t.value);

        t.focus();
        t.selectionStart = t.selectionEnd = start + txt.length;
      }

      function syncFormula(val) {
        document.getElementById("excelFormulaInput").value = val;
        document.getElementById("facFormula").value = val;

        const preview = document.getElementById("formulaTextPreview");
        const panel = document.getElementById("formulaPreviewFinal");

        // Validation: Check parentheses
        const openP = (val.match(/\(/g) || []).length;
        const closeP = (val.match(/\)/g) || []).length;

        if (openP !== closeP) {
          preview.textContent = val + " (⚠️ Paréntesis no cerrados)";
          preview.className =
            "monospace fw-bold text-danger fs-5 animate__animated animate__pulse";
          panel.className =
            "bg-danger bg-opacity-10 p-3 rounded border border-danger border-opacity-25";
        } else {
          preview.textContent = val || "...";
          preview.className = "monospace fw-bold text-success fs-5";
          panel.className =
            "bg-success bg-opacity-10 p-3 rounded border border-success border-opacity-25";
        }
      }

      function generarRangoSuma() {
        const input = document.getElementById("rangeSumInput").value.trim();
        if (!input.includes("-")) {
          alert("Use el formato inicio-fin (Ej: 1-10)");
          return;
        }
        const parts = input.split("-");
        const inicio = parseInt(parts[0]);
        const fin = parseInt(parts[1]);

        if (isNaN(inicio) || isNaN(fin) || inicio >= fin) {
          alert("Rango inválido.");
          return;
        }

        let formula = "";
        for (let i = inicio; i <= fin; i++) {
          formula += `{P${i}_PTJ}`;
          if (i < fin) formula += " + ";
        }

        insertarFormula(formula);
        document.getElementById("rangeSumInput").value = "";
        showToast("✅ Rango de suma generado.");
      }

      function insertarEnExcel(fn) {
        insertarFormula(fn);
      }

      function filterFormulaTemplates(query) {
        const box = document.getElementById("smartTemplatesBox");
        const items = box.querySelectorAll(".p-2");
        const q = query.toLowerCase();
        items.forEach((it) => {
          const text = it.textContent.toLowerCase();
          it.style.display = text.includes(q) ? "block" : "none";
        });
      }

      let factorActualEditando = null;

      function addFactor() {
        const cod = document
          .getElementById("facCod")
          .value.trim()
          .toUpperCase();
        const desc = document.getElementById("facDesc").value.trim();
        const formula = document.getElementById("facFormula")
          ? document.getElementById("facFormula").value.trim()
          : "";

        if (!cod || !desc) {
          alert("Completa código y descripción.");
          return;
        }

        if (factorActualEditando) {
          // Update mode
          factorActualEditando.innerHTML = rowFactorHTML(cod, desc, formula);
          factorActualEditando = null;
          showToast("✅ Factor actualizado.");

          // Reset button text
          const btn = document.querySelector('button[onclick="addFactor()"]');
          if (btn)
            btn.innerHTML =
              '<i class="fas fa-save me-2"></i> Guardar Nuevo Factor';
        } else {
          // Create mode
          pushItem("boxFac", "emptyFac", rowFactor(cod, desc, formula));
          showToast("✅ Factor guardado.");
        }

        // Reset fields
        document.getElementById("facCod").value = "";
        document.getElementById("facDesc").value = "";
        if (document.getElementById("facFormula")) {
          document.getElementById("facFormula").value = "";
          syncFormula("");
        }
      }
      function rowPregunta(n, txt, tipo) {
        let lbl = tipo.charAt(0).toUpperCase() + tipo.slice(1);
        let badgeColor = "bg-primary";
        if (tipo === "abierta") badgeColor = "bg-warning text-dark";
        else if (tipo === "cerrada") badgeColor = "bg-primary";
        else if (tipo === "matriz") badgeColor = "bg-info text-dark";
        else if (tipo === "tarjeta") badgeColor = "bg-danger";
        else if (tipo === "numerica") badgeColor = "bg-success";
        else if (tipo === "imagen") badgeColor = "bg-dark text-white";


        return `<div class="item-row d-flex align-items-center mb-2 p-2 border rounded bg-light" draggable="true" ondragstart="dragPregRow(event)" ondragover="dragOverPregRow(event)" ondrop="dropPregRow(event)" ondragend="dragEndPregRow(event)" data-tipo="${tipo}">
          <i class="fas fa-grip-vertical handle me-3 text-muted" style="cursor: grab;"></i>
          <input type="number" class="form-control form-control-sm text-center pos-input me-3" style="width: 65px;" value="${n}" onchange="reordenarPorInput(this, '#boxPreg')">
          <span class="badge bg-primary me-3">P${n}</span>
          <span class="desc-text desc fw-medium flex-grow-1 px-2 py-1 editable-text rounded" contenteditable="true" onblur="this.scrollLeft = 0" onkeydown="if(event.key==='Enter'){event.preventDefault(); this.blur();}" title="Haga clic para editar nombre de pregunta">${txt}</span>
          <span class="badge ${badgeColor} me-3">${lbl}</span>
          <button class="btn btn-sm btn-outline-primary ms-1" data-bs-toggle="tooltip" title="Editar pregunta actual" onclick="editarPreguntaRow(this)"><i class="fas fa-pen"></i></button>
          <button class="btn btn-sm btn-outline-secondary ms-1" data-bs-toggle="tooltip" title="Clonar pregunta con todos sus atributos" onclick="duplicarPregunta(this)"><i class="fas fa-copy"></i></button>
          <button class="btn btn-sm btn-outline-danger ms-1" data-bs-toggle="tooltip" title="Eliminar pregunta" onclick="this.closest('.item-row').remove(); renumerarContenedor('#boxPreg');"><i class="fas fa-trash"></i></button>
        </div>`;
      }

      function rowFactor(cod, desc, formula = "") {
        return `<div class="item-row d-flex align-items-center mb-2 p-2 border rounded bg-light" data-cod="${cod}" data-desc="${desc}" data-formula="${formula}">
          ${rowFactorHTML(cod, desc, formula)}
        </div>`;
      }

      function rowFactorHTML(cod, desc, formula) {
        const fBadge = formula
          ? `<span class="badge bg-light text-primary border ms-2 d-inline-block mt-1 text-truncate" style="max-width:200px;" title="${formula}"><i class="fas fa-square-root-alt me-1"></i>${formula}</span>`
          : "";
        return `
          <div class="inf flex-grow-1">
            <span class="tag tag-punt fw-bold">${cod}</span>
            <span class="fw-medium">${desc}</span>
            ${fBadge}
          </div>
          <div class="d-flex gap-1">
            <button class="btn btn-sm btn-outline-primary" title="Editar Factor" onclick="editarFactorRow(this)"><i class="fas fa-pen"></i></button>
            <button class="btn btn-sm btn-outline-secondary" title="Duplicar Factor" onclick="duplicarFactor(this)"><i class="fas fa-copy"></i></button>
            <button class="btn btn-sm btn-outline-danger" title="Eliminar" onclick="this.closest('.item-row').remove()"><i class="fas fa-times"></i></button>
          </div>
        `;
      }

      function editarFactorRow(btn) {
        const row = btn.closest(".item-row");
        const cod = row.getAttribute("data-cod");
        const desc = row.getAttribute("data-desc");
        const formula = row.getAttribute("data-formula");

        document.getElementById("facCod").value = cod;
        document.getElementById("facDesc").value = desc;
        if (document.getElementById("facFormula")) {
          document.getElementById("facFormula").value = formula;
          syncFormula(formula);
        }

        factorActualEditando = row;

        // Update button text to indicate edit mode
        const saveBtn = document.querySelector('button[onclick="addFactor()"]');
        if (saveBtn)
          saveBtn.innerHTML =
            '<i class="fas fa-sync me-2"></i> Actualizar Factor';

        // Scroll to form
        document
          .getElementById("facCod")
          .scrollIntoView({ behavior: "smooth", block: "center" });
      }

      function duplicarFactor(btn) {
        const row = btn.closest(".item-row");
        const cod = row.getAttribute("data-cod") + "_COPY";
        const desc = row.getAttribute("data-desc") + " (Copia)";
        const formula = row.getAttribute("data-formula");

        pushItem("boxFac", "emptyFac", rowFactor(cod, desc, formula));
        showToast("✅ Factor duplicado.");
      }

      function addRespuesta() {
        const prg = document.getElementById("respPrg").value.trim(),
          clave = document
            .getElementById("respClave")
            .value.trim()
            .toUpperCase(),
          fac = document.getElementById("respFac").value.trim().toUpperCase();
        if (!prg || !clave) {
          alert("Completa pregunta y clave.");
          return;
        }
        pushItem("boxResp", "emptyResp", rowRespuesta(prg, clave, fac));
        ["respPrg", "respClave", "respFac"].forEach(
          (id) => (document.getElementById(id).value = ""),
        );
      }
      function rowRespuesta(prg, clave, fac) {
        return `<div class="item-row"><div class="inf"><span class="tag" style="background:#EFF6FF;color:#1D4ED8;font-weight:700">P${prg}</span><span class="tag" style="background:#F3E8FF;color:#6B21A8;font-weight:700">→ ${clave}</span>${fac ? `<span class="tag tag-niv fw-bold">${fac}</span>` : ""}</div><button class="btn btn-light rounded-circle text-danger p-0" style="width:32px;height:32px;" onclick="this.closest('.item-row').remove()"><i class="fas fa-times"></i></button></div>`;
      }

      function aplicarPlantillaRespuesta() {
        const tpl = document.getElementById("tplRespSelect").value;
        if (!tpl) return;

        const pregs = document.querySelectorAll("#boxPreg .item-row").length;
        if (pregs === 0) {
          showToast("⚠️ No hay preguntas para asignar plantillas.");
          return;
        }

        const templates = {
          likert5: [
            "A: Siempre",
            "B: Frecuentemente",
            "C: A veces",
            "D: Raramente",
            "E: Nunca",
          ],
          likert4: [
            "A: Totalmente de acuerdo",
            "B: De acuerdo",
            "C: En desacuerdo",
            "D: Totalmente en desacuerdo",
          ],
          si_no: ["A: Sí", "B: No"],
          frecuencia: ["A: Mucho", "B: Regular", "C: Poco", "D: Nada"],
        };

        const selected = templates[tpl];
        if (selected) {
          confirmarGeneral(
            "Cargar Plantilla",
            `Se generarán claves para ${pregs} preguntas basadas en la plantilla. ¿Continuar?`,
            () => {
              const box = document.getElementById("boxResp");
              const empty = document.getElementById("emptyResp");
              if (empty) empty.remove();

              const pregBadges = Array.from(
                document.querySelectorAll(
                  "#boxPreg .item-row .badge.bg-primary",
                ),
              ).map((b) => b.textContent.replace("P", ""));
              pregBadges.forEach((qNum) => {
                selected.forEach((opt) => {
                  const clave = opt.split(":")[0].trim();
                  const div = document.createElement("div");
                  div.innerHTML = rowRespuesta(qNum, clave, "");
                  box.appendChild(div.firstElementChild);
                });
              });
              showToast("✅ Plantilla aplicada con éxito.");
              document.getElementById("tplRespSelect").value = "";
            },
          );
        }
      }

/* ── DRAG & DROP para listas de orden de prestaciones ── */
      let _dragSrc = null;

      function initDrag(el) {
        el.setAttribute("draggable", "true");
        el.addEventListener("dragstart", function (e) {
          _dragSrc = this;
          this.classList.add("dragging");
          e.dataTransfer.effectAllowed = "move";
        });
        el.addEventListener("dragend", function () {
          this.classList.remove("dragging");
          document
            .querySelectorAll(".drag-over")
            .forEach((n) => n.classList.remove("drag-over"));

          // Feedback visual de confirmación
          this.classList.add("drop-flash");
          setTimeout(() => {
            this.classList.remove("drop-flash");
          }, 500);
        });
        el.addEventListener("dragover", function (e) {
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
          if (this !== _dragSrc) this.classList.add("drag-over");
        });
        el.addEventListener("dragleave", function () {
          this.classList.remove("drag-over");
        });
        el.addEventListener("drop", function (e) {
          e.stopPropagation();
          e.preventDefault();
          this.classList.remove("drag-over");
          if (
            _dragSrc &&
            _dragSrc !== this &&
            this.parentElement === _dragSrc.parentElement
          ) {
            const lista = this.parentElement;
            const items = Array.from(lista.querySelectorAll(".card-item"));
            const srcIdx = items.indexOf(_dragSrc);
            const tgtIdx = items.indexOf(this);
            if (srcIdx < tgtIdx) {
              lista.insertBefore(_dragSrc, this.nextSibling);
            } else {
              lista.insertBefore(_dragSrc, this);
            }

            // Actualizar índices visuales
            lista.querySelectorAll(".card-item").forEach((item, idx) => {
              const inputNum = item.querySelector("input[type='number']");
              if (inputNum) inputNum.value = idx + 1;
            });
          }
          _dragSrc = null;
        });
      }

      function initDragList(listId) {
        const lista = document.getElementById(listId);
        if (!lista) return;
        lista.querySelectorAll(".card-item").forEach(initDrag);
      }

      document.addEventListener("DOMContentLoaded", function () {
        initDragList("lista-sepo");
        initDragList("lista-complementario");
      });

      function updatePrestIconos() {
        document
          .querySelectorAll("#screen-prestaciones .card-item")
          .forEach((card) => {
            const icono = card.dataset.icono || "stethoscope"; // default
            const iconEl = card.querySelector(".icon-box i");
            if (iconEl) {
              iconEl.className = `fas fa-${icono}`;
            }
          });
      }

      // Ejecutar al cargar
      document.addEventListener("DOMContentLoaded", updatePrestIconos);

let _accionOnConfirm = null;
      function confirmarGeneral(
        titulo,
        mensaje,
        accionOnConfirm,
        tipo = "guardar",
        icono = "fa-save",
      ) {
        document.getElementById("mConfirmTitle").textContent = titulo;
        document.getElementById("mConfirmMsg").textContent = mensaje;
        const iconDiv = document.getElementById("mConfirmIcon");
        iconDiv.innerHTML = '<i class="fas ' + icono + '"></i>';
        const btn = document.getElementById("mConfirmBtn");
        if (tipo === "eliminar") {
          iconDiv.style.background = "#fee2e2";
          iconDiv.style.color = "#dc2626";
          btn.className = "btn btn-danger rounded-pill px-4 fw-bold shadow-sm";
          btn.innerHTML = "Eliminar";
        } else {
          iconDiv.style.background = "#e0f2fe";
          iconDiv.style.color = "var(--primary)";
          btn.className = "btn-prim px-4";
          btn.innerHTML = '<i class="fas fa-save me-2"></i>Guardar';
        }
        _accionOnConfirm = () => {
          const mEl = document.getElementById("modalConfirm");
          const modalInstance = bootstrap.Modal.getInstance(mEl);
          if (modalInstance) modalInstance.hide();
          if (accionOnConfirm) accionOnConfirm();
        };
        new bootstrap.Modal(document.getElementById("modalConfirm")).show();
      }
      document.getElementById("mConfirmBtn")?.addEventListener("click", () => {
        if (_accionOnConfirm) _accionOnConfirm();
      });
      function confirmarGuardar(modulo, accionOnConfirm) {
        confirmarGeneral(
          "¿Guardar cambios?",
          "Desea guardar los cambios en " + modulo + "?",
          () => {
            // Simular registro en historial
            agregarAlHistorialDemo(modulo, "Guardar / Actualizar");
            if (accionOnConfirm) accionOnConfirm();
          },
          "guardar",
          "fa-save",
        );
      }

      // --- LOGICA DE HISTORIAL (DEMO) ---
      let _historialDemo = [
        {
          fecha: "2023-10-25 10:30",
          usuario: "Admin",
          accion: "Editar",
          registro: "SED-001",
          detalles: "Cambio de dirección",
          modulo: "Centros Médicos",
        },
        {
          fecha: "2023-10-24 15:45",
          usuario: "mlozano",
          accion: "Nuevo",
          registro: "GI-015",
          detalles: "Postgrado",
          modulo: "Grado de Instrucción",
        },
        {
          fecha: "2023-10-23 09:12",
          usuario: "Admin",
          accion: "Activar",
          registro: "OC-005",
          detalles: "Re-apertura de vacante",
          modulo: "Ocupaciones",
        },
        {
          fecha: "2023-10-23 11:45",
          usuario: "mlozano",
          accion: "Nuevo",
          registro: "GO-004",
          detalles: "Creación de grupo salud",
          modulo: "Grupos Ocupacionales",
        },
        {
          fecha: "2023-10-22 11:20",
          usuario: "jclark",
          accion: "Reordenar",
          registro: "PR-PSI-001",
          detalles: "Se movió al primer lugar de prioridad",
          modulo: "Orden de Prestaciones",
        },
        {
          fecha: "2023-10-22 14:05",
          usuario: "Admin",
          accion: "Editar",
          registro: "PR-ALT-002",
          detalles: "Actualización de factores asociados",
          modulo: "Orden de Prestaciones",
        },
        {
          fecha: "2023-10-21 16:30",
          usuario: "mlozano",
          accion: "Guardar",
          registro: "Protocolo 2024",
          detalles: "Ajuste masivo de posiciones",
          modulo: "Orden de Prestaciones",
        },
        {
          fecha: "2023-10-20 09:45",
          usuario: "Admin",
          accion: "Nuevo",
          registro: "PR-LAB-050",
          detalles: "Nuevo examen de sangre",
          modulo: "Prestaciones",
        },
        {
          fecha: "2023-10-19 14:12",
          usuario: "jclark",
          accion: "Editar",
          registro: "CPS-005",
          detalles: "Corrección de ortografía en etiqueta",
          modulo: "Fichas",
        },
        {
          fecha: "2023-10-18 11:05",
          usuario: "mlozano",
          accion: "Activar",
          registro: "GI-008",
          detalles: "Habilitación de grado técnico",
          modulo: "Grado de Instrucción",
        },
      ];

      function verHistorial(modulo) {
        document.getElementById("historialModuloTitle").textContent = modulo;
        const tbody = document.getElementById("historialTableBody");
        tbody.innerHTML = "";

        const filtrados = _historialDemo.filter((h) => h.modulo === modulo);

        if (filtrados.length === 0) {
          tbody.innerHTML =
            '<tr><td colspan="5" class="text-center py-4 text-muted">No hay cambios registrados recientemente.</td></tr>';
        } else {
          filtrados.reverse().forEach((h) => {
            tbody.innerHTML += `
              <tr>
                <td class="ps-4 fw-medium text-muted">${h.fecha}</td>
                <td><span class="badge bg-light text-dark border-0 shadow-none" style="font-weight: 600;">@${h.usuario}</span></td>
                <td><span class="tag ${h.accion === "Nuevo" ? "tag-tipo" : "tag-niv"}">${h.accion}</span></td>
                <td><strong class="text-primary">${h.registro}</strong></td>
                <td class="pe-4 text-muted fst-italic">${h.detalles}</td>
              </tr>
            `;
          });
        }

        new bootstrap.Modal(document.getElementById("modalHistorial")).show();
      }

      function agregarAlHistorialDemo(modulo, accion) {
        const ahora = new Date();
        const fechaStr =
          ahora.getFullYear() +
          "-" +
          (ahora.getMonth() + 1).toString().padStart(2, "0") +
          "-" +
          ahora.getDate().toString().padStart(2, "0") +
          " " +
          ahora.getHours().toString().padStart(2, "0") +
          ":" +
          ahora.getMinutes().toString().padStart(2, "0");

        _historialDemo.push({
          fecha: fechaStr,
          usuario: "Usuario Logueado",
          accion: accion,
          registro: "ID-" + Math.floor(Math.random() * 900 + 100),
          detalles: "Cambios guardados desde el módulo",
          modulo: modulo,
        });
      }
      function confirmarEliminar(titulo, mensaje, accionOnConfirm) {
        confirmarGeneral(
          titulo,
          mensaje,
          accionOnConfirm,
          "eliminar",
          "fa-trash",
        );
      }

      function toggleSidebar() {
        const sidebar = document.getElementById("sidebar");
        sidebar.classList.toggle("collapsed");
        document.getElementById("main-content").classList.toggle("expanded");

        const isCollapsed = sidebar.classList.contains("collapsed");
        sidebar.querySelectorAll(".nav-link").forEach((link) => {
          const tooltip = bootstrap.Tooltip.getInstance(link);
          if (tooltip) {
            if (isCollapsed) tooltip.enable();
            else tooltip.disable();
          }
        });
      }

// ---- LOGICA DE DEMOSTRACION UX ----
      document.addEventListener("DOMContentLoaded", () => {
        // --- Funcionalidad DEMO de Búsqueda y Filtros ---
        const screens = document.querySelectorAll(".screen");
        screens.forEach((screen) => {
          // Todos los inputs tipo buscador y combos
          const textInputs = screen.querySelectorAll(
            'input[type="text"], input[type="search"]',
          );
          const selects = screen.querySelectorAll("select");

          // Buscar el contenedor padre que agrupa la lista
          const firstCard = screen.querySelector(".card-item");
          if (!firstCard) return;

          const listContainer = firstCard.parentElement;

          // Identificamos al "Buscador Principal" que solemos usar en la cabecera
          const searchInput = Array.from(textInputs).find(
            (i) =>
              (i.placeholder || "").toLowerCase().includes("buscar") ||
              (i.title || "").toLowerCase().includes("buscar"),
          );

          const filterSelects = Array.from(selects);

          const aplicarFiltros = () => {
            const query = searchInput
              ? searchInput.value.toLowerCase().trim()
              : "";
            const cards = listContainer.querySelectorAll(".card-item");

            cards.forEach((card) => {
              let matchSearch = true;
              let matchSelects = true;
              const cardContent = card.innerText.toLowerCase();

              if (query) {
                matchSearch = cardContent.includes(query);
              }

              filterSelects.forEach((sel) => {
                const val = sel.value.toLowerCase().trim();
                // Ignoramos selecciones vacías o default
                if (
                  val &&
                  val !== "todos" &&
                  val !== "0" &&
                  val !== "" &&
                  !val.includes("seleccionar")
                ) {
                  const dataStatus = (card.dataset.estado || "").toLowerCase();
                  const dataType = (card.dataset.tipo || "").toLowerCase();
                  const optText =
                    sel.options[sel.selectedIndex].text.toLowerCase();

                  // Verificamos si el valor o el texto del filtro está en la info del card, en estado o en su tipo.
                  if (
                    !cardContent.includes(optText) &&
                    !cardContent.includes(val) &&
                    !dataStatus.includes(val) &&
                    !dataType.includes(val)
                  ) {
                    matchSelects = false;
                  }
                }
              });

              card.style.display = matchSearch && matchSelects ? "" : "none";
            });
          };

          if (searchInput) {
            searchInput.addEventListener("input", aplicarFiltros);
            // Quitamos event handlers viejos como oninput en html si chocan (aunque JS manda y convive en este caso de DEMO)
          }
          filterSelects.forEach((sel) =>
            sel.addEventListener("change", aplicarFiltros),
          );
        });

        // --- Paginación Fake Dinámica ---
        const paginations = document.querySelectorAll(".pagination");
        paginations.forEach((ul) => {
          const links = ul.querySelectorAll(".page-link");
          links.forEach((link) => {
            link.addEventListener("click", (e) => {
              e.preventDefault();
              const li = link.parentElement;
              if (
                li.classList.contains("active") ||
                li.classList.contains("disabled")
              )
                return;

              // Interfaz (pintamos el cuadrito azul)
              ul.querySelectorAll(".page-item").forEach((i) =>
                i.classList.remove("active"),
              );
              li.classList.add("active");

              // Lógica visual simulando cambio de página
              const screen = ul.closest(".screen");
              if (screen) {
                // Localizamos contenedor global de cards
                const firstC = screen.querySelector(".card-item");
                if (firstC) {
                  const container = firstC.parentElement;
                  const cards = Array.from(
                    container.querySelectorAll(".card-item"),
                  );

                  // Animamos opacidad simulando carga SPA
                  container.style.opacity = "0";
                  container.style.transition = "opacity 0.2s ease-in-out";

                  setTimeout(() => {
                    // Hacemos el popular "Shuffle Array" (cambiar el orden de las cartas para que parezca data nueva)
                    for (let i = cards.length - 1; i > 0; i--) {
                      const j = Math.floor(Math.random() * (i + 1));
                      [cards[i], cards[j]] = [cards[j], cards[i]];
                    }
                    cards.forEach((c) => container.appendChild(c)); // Mueve en el DOM

                    // Encontramos inputs de esta pantalla y les aplicamos blur/limpieza si aplica, para una demo queda igual
                    container.style.opacity = "1";
                  }, 200);
                }
              }
            });
          });
        });
      });
      // ------------------------------------

function reordenarPrestacion(input) {
        const card = input.closest(".card-item");
        const container = card.parentNode;
        const cards = [...container.querySelectorAll(".card-item")];
        const newPos = parseInt(input.value) - 1;
        if (newPos >= 0 && newPos < cards.length) {
          if (newPos === 0) container.prepend(card);
          else if (newPos >= cards.length - 1) container.appendChild(card);
          else {
            const target = cards[newPos];
            if (cards.indexOf(card) < newPos) target.after(card);
            else target.before(card);
          }
          card.classList.add("highlight");
          setTimeout(() => card.classList.remove("highlight"), 1000);
        }
        container
          .querySelectorAll(
            '.card-item .pos-input, .card-item input[type="number"]',
          )
          .forEach((inp, idx) => {
            inp.value = idx + 1;
          });
      }

      function editarTextoEnLinea(btn) {
        const row = btn.closest(".item-row");
        const h6 = row.querySelector("h6.desc");
        const currentText = h6.textContent;
        const input = document.createElement("input");
        input.type = "text";
        input.className = "form-control form-control-sm fw-bold";
        input.value = currentText;
        input.style.marginTop = "4px";
        h6.style.display = "none";
        h6.after(input);
        input.focus();
        btn.onclick = () => guardarTextoEnLinea(btn);
        btn.className = "btn btn-sm btn-success border";
        btn.innerHTML = '<i class="fas fa-save"></i>';
        input.onkeydown = (e) => {
          if (e.key === "Enter") guardarTextoEnLinea(btn);
        };
      }

      function guardarTextoEnLinea(btn) {
        const row = btn.closest(".item-row");
        const h6 = row.querySelector("h6.desc");
        const input = row.querySelector('input[type="text"].fw-bold');
        if (!input) return;
        h6.textContent = input.value;
        h6.style.display = "block";
        input.remove();
        btn.onclick = () => editarTextoEnLinea(btn);
        btn.className = "btn btn-sm btn-light border btn-edit-desc";
        btn.innerHTML = '<i class="fas fa-edit text-muted"></i>';
        showToast("✅ Descripción actualizada.");
      }

// Sync footer with sidebar collapse
      document.addEventListener("DOMContentLoaded", function () {
        const sidebar = document.getElementById("sidebar");
        const footer = document.getElementById("appFooter");
        const obs = new MutationObserver(() => {
          if (footer && sidebar)
            footer.style.left = sidebar.classList.contains("collapsed")
              ? "80px"
              : "260px";
        });
        if (sidebar)
          obs.observe(sidebar, {
            attributes: true,
            attributeFilter: ["class"],
          });
      });

const PRUEBAS_DEMO = {
        "PSI-ANS-001": {
          titulo: "Escala de Ansiedad de Beck (BAI)",
          icono: "🧠",
          tipo: "Clínico",
          desc: "Inventario de autoinforme para medir la severidad de la ansiedad.",
          tiempo: "~10 min",
          preguntas: [
            { tipo: "cerrada", texto: "En la última semana, ¿con qué frecuencia ha sentido miedo a que suceda lo peor?", vineta: "may", opciones: ["Nada", "Levemente", "Moderadamente", "Gravemente"] },
            { tipo: "cerrada", texto: "Seleccione los síntomas físicos que ha experimentado con mayor intensidad (Selección Múltiple):", multiple: true, vineta: "num", opciones: ["Adormecimiento", "Bochornos", "Inestabilidad", "Palpitaciones"] },
            { tipo: "matriz", texto: "Valore el nivel de dificultad para realizar las siguientes actividades debido a la ansiedad:", filas: ["Trabajar", "Socializar", "Dormir"], columnas: ["Sin dificultad", "Dificultad leve", "Dificultad alta"] },
            { tipo: "tarjeta", texto: "¿Cuál es su estado de ánimo predominante en este momento?", tarjetas: [{ emoji: "🧘", label: "Relajado" }, { emoji: "😟", label: "Inquieto" }, { emoji: "😰", label: "Muy ansioso" }] },
            { tipo: "abierta", texto: "Mencione tres situaciones específicas que le disparen episodios de ansiedad:", numResp: 3, placeholders: ["Situación 1", "Situación 2", "Situación 3"] },
            { tipo: "cerrada", texto: "Observe la siguiente ilustración sobre técnicas de respiración. ¿Le resulta familiar este método?", image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=400&auto=format&fit=crop", opciones: ["Sí, lo practico", "Lo conozco pero no lo uso", "No lo conozco"] },
            { tipo: "abierta", texto: "Dada la imagen anterior, describa brevemente cómo se siente al practicar ejercicios de relajación:", placeholder: "Escriba su experiencia..." }
          ],
          factores: [
            { cod: "FAC-ANS-S", nom: "Ansiedad Somática" },
            { cod: "FAC-ANS-C", nom: "Ansiedad Cognitiva" }
          ]
        },
        "PSI-CMP-002": {
          titulo: "Evaluación de Competencias Volcán",
          icono: "🌋",
          tipo: "Laboral",
          desc: "Perfil de competencias para el sector minero, enfocado en seguridad y eficiencia operativa.",
          tiempo: "~20 min",
          preguntas: [
            { tipo: "tarjeta", texto: "Seleccione su área de especialidad principal:", tarjetas: [{ emoji: "🚜", label: "Maquinaria Pesada" }, { emoji: "⛏️", label: "Extracción Socavón" }, { emoji: "🛡️", label: "Seguridad Industrial" }, { emoji: "⚙️", label: "Mantenimiento" }] },
            { tipo: "cerrada", texto: "¿Conoce los protocolos de emergencia del tajo abierto?", opciones: ["Sí, perfectamente", "Parcialmente", "No los conozco"] },
            { tipo: "cerrada", texto: "Observe la siguiente señal ética. ¿Qué indica el uso obligatorio de este elemento?", image: "https://images.unsplash.com/photo-1590483734720-394f923b4992?q=80&w=400&auto=format&fit=crop", opciones: ["Protección auditiva", "Protección visual", "Protección respiratoria"] },
            { tipo: "cerrada", texto: "Marque las herramientas de seguridad que domina (Múltiple):", multiple: true, vineta: "min", opciones: ["IPERC Continuo", "ATS", "Checklist Pre-uso", "PETAR"] },
            { tipo: "matriz", texto: "Dominio en las siguientes operaciones:", filas: ["Operación de equipos", "Reporte de incidentes", "Primeros auxilios"], columnas: ["Ninguno", "Básico", "Avanzado"] },
            { tipo: "abierta", texto: "Explique brevemente cómo actuaría ante un amago de incendio por cortocircuito:", placeholder: "Describa el protocolo..." },
            { tipo: "numerica", texto: "En una escala del 1 al 10, ¿qué tan seguro se siente en su entorno actual?", min: 1, max: 10 },
            { tipo: "abierta", texto: "Mencione dos mejoras que implementaría en su puesto:", numResp: 2, placeholders: ["Mejora 1", "Mejora 2"] }
          ],
          factores: [
            { cod: "FAC-CMP-T", nom: "Competencias Técnicas" },
            { cod: "FAC-CMP-S", nom: "Seguridad y Salud" }
          ]
        },
        "PSI-ALT-003": {
          titulo: "Evaluación Psicológica – Altura",
          icono: "⛰️",
          tipo: "Altura",
          desc: "Evaluación de aptitud psicológica para trabajos en altura geográfica.",
          tiempo: "~12 min",
          preguntas: [
            { tipo: "cerrada", texto: "¿Ha sufrido desmayos o vértigo anteriormente?", vineta: "rom", opciones: ["Nunca", "Hace más de un año", "Recientemente"] },
            { tipo: "cerrada", texto: "Indique si presenta alguno de estos síntomas (Múltiple):", multiple: true, opciones: ["Dolor de cabeza", "Náuseas", "Dificultad para respirar", "Visión borrosa"] },
            { tipo: "cerrada", texto: "Observe la imagen. ¿Representa una condición segura?", image: "https://images.unsplash.com/photo-1522071823910-fe3ece41159b?q=80&w=400&auto=format&fit=crop", opciones: ["Segura", "Insegura", "Faltan datos"] },
            { tipo: "matriz", texto: "Frecuencia de monitoreo de signos:", filas: ["Presión", "Oxigenación"], columnas: ["Diario", "Semanal", "Mensual"] },
            { tipo: "tarjeta", texto: "¿Qué equipo de protección considera más crítico?", tarjetas: [{ emoji: "🪖", label: "Casco" }, { emoji: "🦺", label: "Arnés" }, { emoji: "🧗", label: "Línea de vida" }] },
            { tipo: "numerica", texto: "Indique la altura máxima (en metros) a la que ha trabajado:", min: 0, max: 6000 }
          ],
          factores: [
            { cod: "FAC-ALT-F", nom: "Aptitud Física" },
            { cod: "FAC-ALT-P", nom: "Aptitud Psicológica" }
          ]
        },
        "PSI-CHI-004": {
          titulo: "Entrevista Psicológica Chinalco",
          icono: "📋",
          tipo: "Retiro",
          desc: "Evaluación de salida y satisfacción laboral.",
          tiempo: "~15 min",
          preguntas: [
            { tipo: "cerrada", texto: "¿Cuál es el motivo principal de su retiro?", opciones: ["Mejor oferta laboral", "Temas personales", "Estudios", "Otros"] },
            { tipo: "matriz", texto: "Califique su experiencia en Chinalco:", filas: ["Clima", "Sueldo", "Beneficios"], columnas: ["Malo", "Regular", "Bueno", "Excelente"] },
            { tipo: "tarjeta", texto: "¿Cómo califica su relación con su supervisor?", tarjetas: [{ emoji: "🤝", label: "Excelente" }, { emoji: "😐", label: "Normal" }, { emoji: "📉", label: "Conflictiva" }] },
            { tipo: "cerrada", texto: "¿Qué beneficios sociales utilizó? (Múltiple):", multiple: true, vineta: "may", opciones: ["Seguro médico", "Bonos", "Capacitación", "Transporte"] },
            { tipo: "numerica", texto: "Del 1 al 10, ¿cuánto recomendaría la empresa?", min: 1, max: 10 },
            { tipo: "abierta", texto: "Comentarios finales:", placeholder: "Escriba aquí..." }
          ],
          factores: [
            { cod: "FAC-ENT-A", nom: "Competencias Blandas" },
            { cod: "FAC-ENT-B", nom: "Estabilidad Emocional" }
          ]
        },
        "EST-STRESS-010": {
          titulo: "Escala de Estrés Percibido",
          icono: "📉",
          tipo: "Bienestar",
          desc: "Medición de los niveles de estrés en la vida cotidiana.",
          tiempo: "~5 min",
          preguntas: [
            { tipo: "cerrada", texto: "¿Se siente sobrepasado por sus responsabilidades?", vineta: "min", opciones: ["Nunca", "A veces", "Frecuentemente", "Siempre"] },
            { tipo: "matriz", texto: "Nivel de estrés por ámbito:", filas: ["Familiar", "Económico", "Social"], columnas: ["Bajo", "Medio", "Alto"] },
            { tipo: "tarjeta", texto: "¿Cómo maneja el estrés normalmente?", tarjetas: [{ emoji: "🧘", label: "Meditación" }, { emoji: "🏃", label: "Deporte" }, { emoji: "🍿", label: "Distracción" }] },
            { tipo: "cerrada", texto: "Marque síntomas físicos presentes (Múltiple):", multiple: true, opciones: ["Insomnio", "Cansancio", "Jaquecas", "Tensión muscular"] },
            { tipo: "numerica", texto: "En una escala del 1 al 10, ¿nivel de paz mental?", min: 1, max: 10 },
            { tipo: "abierta", texto: "¿Desea agregar algo más?", placeholder: "..." }
          ],
          factores: [
            { cod: "FAC-EST-F", nom: "Estrés Físico" },
            { cod: "FAC-EST-M", nom: "Estrés Mental" }
          ]
        },
        "PSI-VOC-005": {
          titulo: "Test de Orientación Vocacional",
          icono: "🎓",
          tipo: "Educativo",
          desc: "Exploración de intereses y aptitudes profesionales.",
          tiempo: "~20 min",
          preguntas: [
            { tipo: "tarjeta", texto: "¿Qué entorno de trabajo prefiere?", tarjetas: [{ emoji: "🏢", label: "Oficina" }, { emoji: "🧪", label: "Laboratorio" }, { emoji: "🎨", label: "Estudio Creativo" }, { emoji: "🌍", label: "Campo / Exterior" }] },
            { tipo: "cerrada", texto: "Elija su área de interés predominante:", opciones: ["Ingenierías", "Salud", "Letras", "Artes"] },
            { tipo: "matriz", texto: "Interés por las siguientes actividades:", filas: ["Investigar", "Diseñar", "Liderar"], columnas: ["Nada", "Poco", "Mucho"] },
            { tipo: "cerrada", texto: "Seleccione habilidades que posee (Múltiple):", multiple: true, vineta: "num", opciones: ["Lógica", "Creatividad", "Empatía", "Organización"] },
            { tipo: "abierta", texto: "Mencione sus 3 carreras favoritas:", numResp: 3, placeholders: ["Opción 1", "Opción 2", "Opción 3"] },
            { tipo: "numerica", texto: "¿Cuántas horas al día dedica al estudio autónomo?", min: 0, max: 24 }
          ],
          factores: [
            { cod: "FAC-VOC-I", nom: "Intereses" },
            { cod: "FAC-VOC-A", nom: "Aptitudes" }
          ]
        }
      };

      /* ── Estado de previsualización ── */
      let pvData = null;
      let pvIdx = 0;
      let pvTimerInterval = null;
      let pvSeconds = 0;
      let pvRespuestas = {};

      /* ── Helper: Obtener viñeta ── */
      function getBulletValue(type, index) {
        if (type === "num") return index + 1 + ".";
        if (type === "may") return String.fromCharCode(65 + index) + ")";
        if (type === "min") return String.fromCharCode(97 + index) + ")";
        if (type === "rom") {
          const roms = ["I", "II", "III", "IV", "V", "VI"];
          return (roms[index] || index + 1) + ".";
        }
        return "•";
      }

      function previsualizarPrueba(codigo) {
        pvData = PRUEBAS_DEMO[codigo];
        if (!pvData) {
          showToast("Datos de previsualización no disponibles para " + codigo);
          return;
        }
        pvIdx = 0;
        pvSeconds = 0;
        pvRespuestas = {};

        // Portada
        document.getElementById("pvTitle").textContent = pvData.titulo;
        document.getElementById("pvSubtitle").textContent =
          pvData.tipo + " · Previsualización";
        document.getElementById("pvIcon").textContent = pvData.icono;
        document.getElementById("pvCoverIcon").textContent = pvData.icono;
        document.getElementById("pvCoverTitle").textContent = pvData.titulo;
        document.getElementById("pvCoverDesc").textContent = pvData.desc;
        document.getElementById("pvTotalQ").textContent =
          pvData.preguntas.length;
        document.getElementById("pvEstTime").textContent = pvData.tiempo;

        // Reset vistas
        pvShow("pvPortada", true);
        pvShow("pvPreguntas", false);
        pvShow("pvFinal", false);
        document.getElementById("pvTimer").style.display = "none";

        new bootstrap.Modal(document.getElementById("modalPreview")).show();
      }

      /* Helper: show/hide sections avoiding Bootstrap !important conflict */
      function pvShow(id, show, mode) {
        const el = document.getElementById(id);
        const cls = mode === "block" ? "d-block" : "d-flex";
        if (show) {
          el.classList.remove("d-none");
          el.classList.add(cls);
        } else {
          el.classList.remove("d-flex", "d-block");
          el.classList.add("d-none");
        }
      }

      function iniciarPreview() {
        pvShow("pvPortada", false);
        pvShow("pvPreguntas", true, "block");
        document.getElementById("pvTimer").style.display = "flex";
        pvSeconds = 0;
        pvTimerInterval = setInterval(() => {
          pvSeconds++;
          const m = String(Math.floor(pvSeconds / 60)).padStart(2, "0");
          const s = String(pvSeconds % 60).padStart(2, "0");
          document.getElementById("pvTimerText").textContent = m + ":" + s;
        }, 1000);
        renderPregunta();
      }

      function renderPregunta() {
        if (!pvData) return;
        const q = pvData.preguntas[pvIdx];
        const total = pvData.preguntas.length;
        const pct = Math.round((pvIdx / total) * 100);

        document.getElementById("pvCurrentQ").textContent = pvIdx + 1;
        document.getElementById("pvTotalQ2").textContent = total;
        document.getElementById("pvPctText").textContent = pct + "%";
        document.getElementById("pvProgressBar").style.width = pct + "%";
        document.getElementById("pvQNum").textContent = pvIdx + 1;
        
        let headerHtml = `<h5 class="fw-bold text-white mb-2" id="pvQText">${q.texto}</h5>`;
        if (q.image) {
          headerHtml += `<div class="mb-3 rounded overflow-hidden shadow-sm" style="border:1px solid rgba(255,255,255,0.1);max-width:100%;">
            <img src="${q.image}" class="img-fluid w-100" style="max-height:300px;object-fit:cover;" alt="Imagen de pregunta">
          </div>`;
        }
        document.getElementById("pvQText").parentElement.innerHTML = `
          <span id="pvQBadge" class="badge rounded-pill mb-2"></span>
          ${headerHtml}
        `;
        
        document.getElementById("pvBtnPrev").style.visibility =
          pvIdx === 0 ? "hidden" : "visible";

        // Badge
        const badgeMap = {
          cerrada: "Respuesta Cerrada",
          abierta: "Respuesta Abierta",
          matriz: "Tipo Matriz",
          tarjeta: "Tipo Tarjeta",
          numerica: "Valor Numérico",
        };
        const badgeColor = {
          cerrada: "rgba(56,189,248,0.15)",
          abierta: "rgba(168,85,247,0.15)",
          matriz: "rgba(251,146,60,0.15)",
          tarjeta: "rgba(34,197,94,0.15)",
          numerica: "rgba(34,197,94,0.15)",
        };
        const badgeText = {
          cerrada: "#38bdf8",
          abierta: "#a855f7",
          matriz: "#fb923c",
          tarjeta: "#22c55e",
          numerica: "#22c55e",
        };
        document.getElementById("pvQBadge").textContent =
          badgeMap[q.tipo] || q.tipo;
        document.getElementById("pvQBadge").style.background =
          badgeColor[q.tipo] || badgeColor.cerrada;
        document.getElementById("pvQBadge").style.color =
          badgeText[q.tipo] || badgeText.cerrada;

        // Botón siguiente / finalizar
        const btnNext = document.getElementById("pvBtnNext");
        if (pvIdx === total - 1) {
          btnNext.innerHTML =
            'Finalizar <i class="fas fa-flag-checkered ms-2"></i>';
          btnNext.style.background =
            "linear-gradient(135deg, #22c55e, #16a34a)";
        } else {
          btnNext.innerHTML =
            'Siguiente <i class="fas fa-arrow-right ms-2"></i>';
          btnNext.style.background =
            "linear-gradient(135deg, #0ea5e9, #2563eb)";
        }

        // Opciones
        const optC = document.getElementById("pvQOptions");
        const savedResp = pvRespuestas[pvIdx];
        optC.innerHTML = "";

        if (q.tipo === "cerrada") {
          const isMulti = q.multiple === true;
          q.opciones.forEach((op, i) => {
            let sel = false;
            if (isMulti) {
              sel = (pvRespuestas[pvIdx] || []).includes(i);
            } else {
              sel = savedResp === i;
            }
            
            const bullet = getBulletValue(q.vineta || "may", i);
            const d = document.createElement("div");
            d.className = "pv-option d-flex align-items-center gap-3 p-3 rounded-3 mb-2";
            d.style.cssText = `cursor:pointer;border:1px solid ${sel ? "#0ea5e9" : "rgba(255,255,255,0.1)"};background:${sel ? "rgba(14,165,233,0.12)" : "rgba(255,255,255,0.03)"};transition:all 0.2s ease;`;
            d.innerHTML = `<div class="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0" style="width:32px;height:32px;background:${sel ? "#0ea5e9" : "rgba(255,255,255,0.08)"};color:${sel ? "white" : "#94a3b8"};font-weight:700;font-size:0.8rem;">${bullet}</div><span class="flex-grow-1" style="color:${sel ? "#e2e8f0" : "#cbd5e1"}">${op}</span>${sel ? '<i class="fas fa-check-circle text-info"></i>' : ""}`;
            
            d.onclick = () => {
              if (isMulti) {
                if (!pvRespuestas[pvIdx]) pvRespuestas[pvIdx] = [];
                const idx = pvRespuestas[pvIdx].indexOf(i);
                if (idx > -1) pvRespuestas[pvIdx].splice(idx, 1);
                else pvRespuestas[pvIdx].push(i);
              } else {
                pvRespuestas[pvIdx] = i;
              }
              renderPregunta();
            };
            optC.appendChild(d);
          });
        } else if (q.tipo === "abierta") {
          const count = q.numResp || 1;
          const resps = Array.isArray(savedResp) ? savedResp : [savedResp];
          for (let i = 0; i < count; i++) {
            const ta = document.createElement("textarea");
            ta.className = "form-control mb-2";
            ta.rows = count > 1 ? 2 : 4;
            ta.placeholder = (q.placeholders && q.placeholders[i]) || q.placeholder || `Respuesta ${i + 1}...`;
            ta.value = resps[i] || "";
            ta.style.cssText = "background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.15);color:#e2e8f0;border-radius:12px;resize:vertical;";
            ta.oninput = () => {
              if (count > 1) {
                if (!Array.isArray(pvRespuestas[pvIdx])) pvRespuestas[pvIdx] = [];
                pvRespuestas[pvIdx][i] = ta.value;
              } else {
                pvRespuestas[pvIdx] = ta.value;
              }
            };
            optC.appendChild(ta);
          }
        } else if (q.tipo === "numerica") {
          const divN = document.createElement("div");
          divN.className = "text-center py-3";
          const inp = document.createElement("input");
          inp.type = "number";
          inp.className = "form-control w-50 mx-auto text-center fs-3 fw-bold";
          inp.style.cssText =
            "background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.2);color:#38bdf8;border-radius:15px;";
          inp.value = savedResp || "";
          inp.oninput = () => {
            pvRespuestas[pvIdx] = inp.value;
          };
          divN.appendChild(inp);
          optC.appendChild(divN);
        } else if (q.tipo === "matriz") {
          const tbl = document.createElement("div");
          tbl.className = "table-responsive";
          let html =
            '<table class="table table-sm mb-0" style="color:#e2e8f0;"><thead><tr><th style="background:transparent;border-color:rgba(255,255,255,0.1);color:#94a3b8;"></th>';
          q.columnas.forEach((c) => {
            html += `<th class="text-center" style="background:transparent;border-color:rgba(255,255,255,0.1);color:#94a3b8;font-size:0.8rem;">${c}</th>`;
          });
          html += "</tr></thead><tbody>";
          q.filas.forEach((f, fi) => {
            html += `<tr><td style="border-color:rgba(255,255,255,0.1);font-weight:600;font-size:0.9rem;">${f}</td>`;
            q.columnas.forEach((c, ci) => {
              const key = fi + "-" + ci;
              const checked = (pvRespuestas[pvIdx] || {})[fi] === ci;
              html += `<td class="text-center" style="border-color:rgba(255,255,255,0.1);"><div class="form-check d-flex justify-content-center"><input class="form-check-input" type="radio" name="pvMat${pvIdx}_${fi}" ${checked ? "checked" : ""} onchange="pvRespuestas[${pvIdx}]=pvRespuestas[${pvIdx}]||{};pvRespuestas[${pvIdx}][${fi}]=${ci};"></div></td>`;
            });
            html += "</tr>";
          });
          html += "</tbody></table>";
          tbl.innerHTML = html;
          optC.appendChild(tbl);
        } else if (q.tipo === "tarjeta") {
          const wrap = document.createElement("div");
          wrap.className = "d-flex gap-3 flex-wrap justify-content-center mt-2";
          q.tarjetas.forEach((t, i) => {
            const sel = savedResp === i;
            const card = document.createElement("div");
            card.className = "text-center p-4 rounded-4";
            card.style.cssText = `cursor:pointer;min-width:140px;border:2px solid ${sel ? "#0ea5e9" : "rgba(255,255,255,0.1)"};background:${sel ? "rgba(14,165,233,0.12)" : "rgba(255,255,255,0.03)"};transition:all 0.2s ease;`;
            card.innerHTML = `<div style="font-size:3rem;margin-bottom:8px;">${t.emoji}</div><div class="fw-bold" style="color:${sel ? "#38bdf8" : "#cbd5e1"};font-size:0.9rem;">${t.label}</div>${sel ? '<i class="fas fa-check-circle text-info mt-2" style="font-size:1.2rem;"></i>' : ""}`;
            card.onmouseenter = () => {
              if (!sel) card.style.border = "2px solid rgba(56,189,248,0.4)";
            };
            card.onmouseleave = () => {
              if (!sel) card.style.border = "2px solid rgba(255,255,255,0.1)";
            };
            card.onclick = () => {
              pvRespuestas[pvIdx] = i;
              renderPregunta();
            };
            wrap.appendChild(card);
          });
          optC.appendChild(wrap);
        }

        // Dots
        const dotsC = document.getElementById("pvDots");
        dotsC.innerHTML = "";
        const maxDots = Math.min(total, 15);
        const start = Math.max(0, pvIdx - 7);
        const end = Math.min(total, start + maxDots);
        for (let i = start; i < end; i++) {
          const dot = document.createElement("div");
          const answered = pvRespuestas[i] !== undefined;
          dot.style.cssText = `width:8px;height:8px;border-radius:50%;cursor:pointer;transition:all 0.2s ease;background:${i === pvIdx ? "#0ea5e9" : answered ? "rgba(34,197,94,0.6)" : "rgba(255,255,255,0.2)"};${i === pvIdx ? "transform:scale(1.4);" : ""}`;
          dot.title = "Pregunta " + (i + 1);
          dot.onclick = () => {
            pvIdx = i;
            renderPregunta();
          };
          dotsC.appendChild(dot);
        }

        // Scroll to top
        document
          .getElementById("pvPreguntas")
          .scrollIntoView({ behavior: "smooth", block: "start" });
      }

      function pvNavegar(dir) {
        if (!pvData) return;
        pvIdx += dir;
        if (pvIdx >= pvData.preguntas.length) {
          // Finalizar
          pvShow("pvPreguntas", false);
          pvShow("pvFinal", true);
          document.getElementById("pvFinalTotal").textContent =
            pvData.preguntas.length;
          const m = String(Math.floor(pvSeconds / 60)).padStart(2, "0");
          const s = String(pvSeconds % 60).padStart(2, "0");
          document.getElementById("pvFinalTime").textContent = m + ":" + s;
          document.getElementById("pvFinalResp").textContent =
            Object.keys(pvRespuestas).length;
          detenerTimerPreview();
          return;
        }
        if (pvIdx < 0) pvIdx = 0;
        renderPregunta();
      }

      function detenerTimerPreview() {
        if (pvTimerInterval) {
          clearInterval(pvTimerInterval);
          pvTimerInterval = null;
        }
      }

      // Cleanup on modal hide
      document.addEventListener("DOMContentLoaded", () => {
        const pvModal = document.getElementById("modalPreview");
        if (pvModal)
          pvModal.addEventListener("hidden.bs.modal", detenerTimerPreview);

        // Initialize tooltips for elements with title
        const tooltipTriggerList = [].slice.call(
          document.querySelectorAll("[title]"),
        );
        tooltipTriggerList.map(function (tooltipTriggerEl) {
          if (!tooltipTriggerEl.getAttribute("data-bs-toggle")) {
            tooltipTriggerEl.setAttribute("data-bs-toggle", "tooltip");
            if (!tooltipTriggerEl.getAttribute("data-bs-placement")) {
              tooltipTriggerEl.setAttribute("data-bs-placement", "top");
            }
          }
          const tooltip = new bootstrap.Tooltip(tooltipTriggerEl);
          // Only enable sidebar tooltips if it's collapsed
          if (
            tooltipTriggerEl.classList.contains("nav-link") &&
            tooltipTriggerEl.closest("#sidebar")
          ) {
            if (
              !document
                .getElementById("sidebar")
                .classList.contains("collapsed")
            ) {
              tooltip.disable();
            }
          }
          return tooltip;
        });
      });


/* ========================================== */
/* ACTUALIZACION: PREGUNTAS Y PLANTILLAS REAL */
/* ========================================== */
(function (window, document) {
  "use strict";

  function q(sel, root) { return (root || document).querySelector(sel); }
  function qa(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }
  function safeJsonParse(value, fallback) {
    try { return JSON.parse(value); } catch (e) { return fallback; }
  }

  const _renderizarControlesPregunta = window.renderizarControlesPregunta;
  const _ctrlAbierta = window.ctrlAbierta;
  const _ctrlCerrada = window.ctrlCerrada;
  const _swMpcAlt = window.swMpcAlt;
  const _guardarNuevaPregunta = window.guardarNuevaPregunta;
  const _editarPreguntaRow = window.editarPreguntaRow;
  const _precargarBolsito = window.precargarBolsito;
  const _addMpcAlternativa = window.addMpcAlternativa;
  const _duplicarAlternativa = window.duplicarAlternativa;

  function sepoInjectOpenExtras() {
    const root = q("#mpContenedorPregunta");
    if (!root || q("#sepoOpenExpectedBox", root)) return;
    const target = q("#mp_A_boxPrecarga", root);
    if (!target) return;

    const extra = document.createElement("div");
    extra.id = "sepoOpenExpectedBox";
    extra.className = "col-md-12 mt-3";
    extra.innerHTML = `
      <div class="soft-panel">
        <div class="row g-3">
          <div class="col-md-8">
            <label class="form-label text-muted small fw-bold mb-1">Respuesta esperada</label>
            <input type="text" class="form-control" id="mp_A_respuestaEsperada" placeholder="Escribe la respuesta esperada...">
          </div>
          <div class="col-md-4">
            <label class="form-label text-muted small fw-bold mb-1">Valor / Puntaje</label>
            <input type="number" class="form-control" id="mp_A_valorEsperado" min="0" step="0.1" placeholder="Ej: 5">
          </div>
        </div>
      </div>
    `;
    target.insertAdjacentElement("afterend", extra);
  }

  function sepoInjectClosedPrecargaSelect() {
    const root = q("#mpContenedorPregunta");
    const box = q("#mp_C_precarga_opciones", root);
    if (!box || q("#mp_C_precarga_defecto_select", box)) return;
    box.innerHTML = `
      <label class="form-label small fw-bold text-primary mb-1">Alternativa(s) por defecto:</label>
      <select class="form-select form-select-sm" id="mp_C_precarga_defecto_select">
        <option value="">Seleccionar alternativa...</option>
      </select>
    `;
  }

  function sepoFillClosedPrecargaOptions() {
    const select = q("#mp_C_precarga_defecto_select");
    const box = q("#mp_C_alternativas_box");
    if (!select || !box) return;
    const prev = select.value;
    const rows = qa(".item-alt", box);
    select.innerHTML = '<option value="">Seleccionar alternativa...</option>';
    rows.forEach(function (row, idx) {
      const bullet = q(".manual-bullet-input", row) && q(".manual-bullet-input", row).style.display !== "none"
        ? (q(".manual-bullet-input", row).value || "").trim()
        : (q(".badge-bullet", row) ? q(".badge-bullet", row).textContent.trim() : "");
      const txtInput = q(".mpc-dynamic-box input[type='text']", row);
      const label = txtInput ? (txtInput.value || "").trim() : "Alternativa " + (idx + 1);
      const opt = document.createElement("option");
      opt.value = "alt_" + (idx + 1);
      opt.textContent = (bullet ? bullet + " " : "") + label;
      select.appendChild(opt);
    });
    if (prev && qa("option", select).some(function (o) { return o.value === prev; })) select.value = prev;
  }

  function sepoBindClosedAltObservers() {
    const box = q("#mp_C_alternativas_box");
    if (!box || box.dataset.sepoBoundFeature === "1") return;
    box.dataset.sepoBoundFeature = "1";
    box.addEventListener("input", function () { sepoFillClosedPrecargaOptions(); });
    box.addEventListener("change", function () { sepoFillClosedPrecargaOptions(); sepoSyncImageOtherInputs(box); });
    box.addEventListener("click", function () {
      setTimeout(function () {
        sepoFillClosedPrecargaOptions();
        sepoSyncImageOtherInputs(box);
      }, 0);
    });
  }

  function sepoSyncImageOtherInputs(root) {
    qa(".sepo-img-size", root || document).forEach(function (sel) {
      const wrap = sel.closest(".sepo-img-size-wrap");
      if (!wrap) return;
      const custom = q(".sepo-img-custom", wrap);
      if (custom) custom.style.display = sel.value === "otros" ? "flex" : "none";
    });
  }

  function sepoInjectImageOthers(root) {
    qa(".sepo-img-size, .mpc-dynamic-box select.form-select", root || document).forEach(function (sel) {
      if (!sel || sel.dataset.sepoOtherReady === "1") return;
      // only on small size image selectors
      if (![...sel.options].some(function (o) { return o.value === "small" || o.value === "medium" || o.value === "large"; })) return;
      const opt = document.createElement("option");
      opt.value = "otros";
      opt.textContent = "Otros";
      sel.appendChild(opt);
      sel.classList.add("sepo-img-size");
      sel.dataset.sepoOtherReady = "1";
      const wrap = document.createElement("div");
      wrap.className = "sepo-img-size-wrap d-flex align-items-center gap-2";
      sel.parentNode.insertBefore(wrap, sel);
      wrap.appendChild(sel);
      const custom = document.createElement("div");
      custom.className = "sepo-img-custom d-none align-items-center gap-2";
      custom.style.display = "none";
      custom.innerHTML = `
        <input type="number" class="form-control form-control-sm sepo-img-w" placeholder="Ancho" style="width:85px;" min="1">
        <input type="number" class="form-control form-control-sm sepo-img-h" placeholder="Alto" style="width:85px;" min="1">
      `;
      wrap.appendChild(custom);
      sel.addEventListener("change", function () { sepoSyncImageOtherInputs(root || document); });
    });
    sepoSyncImageOtherInputs(root || document);
  }

  window.renderizarControlesPregunta = function () {
    _renderizarControlesPregunta.apply(this, arguments);
    const tipo = q("#mpTipoPreg_Master") ? q("#mpTipoPreg_Master").value : "";
    if (tipo === "abierta") {
      sepoInjectOpenExtras();
    }
    if (tipo === "cerrada") {
      sepoInjectClosedPrecargaSelect();
      sepoFillClosedPrecargaOptions();
      sepoBindClosedAltObservers();
    }
    sepoInjectImageOthers(q("#mpContenedorPregunta"));
  };

  window.ctrlAbierta = function () {
    _ctrlAbierta.apply(this, arguments);
    sepoInjectOpenExtras();
    const fields = q("#mp_A_precargaFields");
    const box = q("#mp_A_boxPrecarga");
    const yes = q("#mp_A_precargaSi");
    if (!fields || !box || !yes) return;
    if (yes.checked) {
      fields.innerHTML = `
        <label class="form-label small text-primary fw-bold mb-2">Respuesta por defecto:</label>
        <select id="mp_A_precargaSelect" class="form-select form-select-sm">
          <option value="">Seleccionar alternativa...</option>
          <option value="resp_1">Respuesta 1</option>
          <option value="resp_2">Respuesta 2</option>
          <option value="resp_3">Respuesta 3</option>
        </select>
      `;
      box.style.display = "block";
    }
  };

  window.ctrlCerrada = function () {
    _ctrlCerrada.apply(this, arguments);
    sepoInjectClosedPrecargaSelect();
    sepoFillClosedPrecargaOptions();
    sepoBindClosedAltObservers();
    sepoInjectImageOthers(q("#mpContenedorPregunta"));
  };

  window.swMpcAlt = function (sel) {
    _swMpcAlt.apply(this, arguments);
    sepoInjectImageOthers(sel.closest(".item-alt"));
    sepoFillClosedPrecargaOptions();
  };

  window.addMpcAlternativa = function () {
    _addMpcAlternativa.apply(this, arguments);
    sepoInjectImageOthers(q("#mp_C_alternativas_box"));
    sepoFillClosedPrecargaOptions();
    sepoBindClosedAltObservers();
  };

  window.duplicarAlternativa = function (btn) {
    _duplicarAlternativa.apply(this, arguments);
    setTimeout(function () {
      sepoInjectImageOthers(q("#mp_C_alternativas_box"));
      sepoFillClosedPrecargaOptions();
    }, 0);
  };

  function sepoReadCurrentQuestionConfig(tipo) {
    const cfg = { tipo: tipo || "", abierta: {}, cerrada: {} };
    if (tipo === "abierta") {
      cfg.abierta = {
        tipoVista: q("#mp_A_tipoVista") ? q("#mp_A_tipoVista").value : "",
        tipoDato: q("#mp_A_tipoDato") ? q("#mp_A_tipoDato").value : "",
        texto: q("#mp_A_text") ? q("#mp_A_text").value : "",
        tipoResp: q("#mp_A_tipoResp") ? q("#mp_A_tipoResp").value : "",
        tienePrecarga: q("#mp_A_precargaSi") ? q("#mp_A_precargaSi").checked : false,
        precarga: q("#mp_A_precargaSelect") ? q("#mp_A_precargaSelect").value : "",
        respuestaEsperada: q("#mp_A_respuestaEsperada") ? q("#mp_A_respuestaEsperada").value : "",
        valorEsperado: q("#mp_A_valorEsperado") ? q("#mp_A_valorEsperado").value : ""
      };
    } else if (tipo === "cerrada") {
      cfg.cerrada = {
        tipoVista: q("#mp_C_tipoVista") ? q("#mp_C_tipoVista").value : "",
        tipoDato: q("#mp_C_tipoDato") ? q("#mp_C_tipoDato").value : "",
        texto: q("#mp_C_text") ? q("#mp_C_text").value : "",
        tipoResp: q("#mp_C_tipoResp") ? q("#mp_C_tipoResp").value : "",
        tienePrecarga: q("#mp_C_precarga") ? q("#mp_C_precarga").checked : false,
        precarga: q("#mp_C_precarga_defecto_select") ? q("#mp_C_precarga_defecto_select").value : "",
        alternativas: qa("#mp_C_alternativas_box .item-alt").map(function (row, idx) {
          const tSel = q(".mpc-tipoalt", row);
          const isText = !tSel || tSel.value === "texto";
          const textInput = q(".mpc-dynamic-box input[type='text']", row);
          const sizeSel = q(".sepo-img-size", row);
          return {
            texto: isText ? ((textInput && textInput.value) || "") : ("Imagen " + (idx + 1)),
            tipo: isText ? "texto" : "imagen",
            size: sizeSel ? sizeSel.value : "",
            w: q(".sepo-img-w", row) ? q(".sepo-img-w", row).value : "",
            h: q(".sepo-img-h", row) ? q(".sepo-img-h", row).value : "",
            valor: 0
          };
        })
      };
    }
    return cfg;
  }

  function sepoApplyQuestionConfigToRow(row, cfg) {
    if (!row) return;
    row.dataset.sepoConfig = JSON.stringify(cfg || {});
  }

  function sepoGetStoredQuestions() {
    return qa("#boxPreg .item-row").map(function (row, idx) {
      const cfg = safeJsonParse(row.dataset.sepoConfig || "{}", {});
      const titulo = q(".desc-text", row) ? q(".desc-text", row).textContent.trim() : ("Pregunta " + (idx + 1));
      const tipo = row.getAttribute("data-tipo") || (cfg.tipo || "");
      const id = row.dataset.sepoId || ("preg_" + (idx + 1));
      row.dataset.sepoId = id;
      let alternativas = [];
      if (tipo === "cerrada" && cfg.cerrada && Array.isArray(cfg.cerrada.alternativas)) {
        alternativas = cfg.cerrada.alternativas;
      }
      return { id: id, titulo: titulo, tipo: tipo, cfg: cfg, alternativas: alternativas };
    });
  }

  function sepoRenderPlantillaReal() {
    const c = q("#plantillaCerradasContainer");
    const a = q("#plantillaAbiertasContainer");
    if (!c || !a) return;
    const preguntas = sepoGetStoredQuestions();
    const cerradas = preguntas.filter(function (p) { return p.tipo === "cerrada"; });
    const abiertas = preguntas.filter(function (p) { return p.tipo === "abierta"; });

    c.innerHTML = cerradas.length ? cerradas.map(function (p) {
      return `
        <div class="border rounded bg-white p-3 shadow-sm mb-2 border-primary" data-question-id="${p.id}">
          <h6 class="fw-bold text-primary mb-2 text-truncate">${p.titulo}</h6>
          ${(p.alternativas || []).map(function (alt, idx) {
            const label = alt.tipo === "imagen" ? ("Imagen " + (idx + 1)) : (alt.texto || ("Alternativa " + (idx + 1)));
            return `
              <div class="d-flex align-items-center justify-content-between py-1 ${idx < p.alternativas.length - 1 ? "border-bottom border-light" : ""}">
                <span class="text-dark fw-medium small">${label}</span>
                <div class="d-flex align-items-center gap-2">
                  <label class="small text-muted fw-bold mb-0">Pts:</label>
                  <input type="number" class="form-control form-control-sm border-secondary text-success fw-bold text-center"
                    style="width:70px;" step="0.1"
                    data-score-question="${p.id}" data-score-index="${idx}" value="${alt.valor || 0}">
                </div>
              </div>`;
          }).join("")}
        </div>`;
    }).join("") : `<div class="alert alert-light text-muted small shadow-sm"><i class="fas fa-info-circle me-2"></i>Las preguntas cerradas se cargarán automáticamente al ingresar a esta pestaña.</div>`;

    a.innerHTML = abiertas.length ? abiertas.map(function (p) {
      const abierta = (p.cfg && p.cfg.abierta) || {};
      return `
        <div class="border rounded bg-white p-3 shadow-sm mb-2 border-warning">
          <h6 class="fw-bold text-warning mb-2 text-truncate">${p.titulo}</h6>
          <div class="row g-2">
            <div class="col-md-8">
              <label class="small text-muted fw-bold mb-1">Respuesta esperada</label>
              <input type="text" class="form-control form-control-sm" value="${abierta.respuestaEsperada || ""}">
            </div>
            <div class="col-md-4">
              <label class="small text-muted fw-bold mb-1">Puntaje</label>
              <input type="number" class="form-control form-control-sm" value="${abierta.valorEsperado || ""}" step="0.1">
            </div>
          </div>
        </div>`;
    }).join("") : `<div class="alert alert-light text-muted small shadow-sm"><i class="fas fa-info-circle me-2"></i>Las preguntas abiertas se cargarán automáticamente al ingresar a esta pestaña.</div>`;
  }

  window.guardarNuevaPregunta = function () {
    const tipo = q("#mpTipoPreg_Master") ? q("#mpTipoPreg_Master").value : "";
    const box = q("#boxPreg");
    const editRow = window.preguntaActualEditando || null;
    const editIndex = editRow && box ? qa(":scope > .item-row", box).indexOf(editRow) : -1;
    const cfg = sepoReadCurrentQuestionConfig(tipo);

    const result = _guardarNuevaPregunta.apply(this, arguments);

    const rows = box ? qa(":scope > .item-row", box) : [];
    const row = editIndex >= 0 ? rows[editIndex] : (rows.length ? rows[rows.length - 1] : null);
    sepoApplyQuestionConfigToRow(row, cfg);
    sepoRenderPlantillaReal();
    return result;
  };

  window.editarPreguntaRow = function (btn) {
    const row = btn.closest(".item-row");
    const cfg = safeJsonParse((row && row.dataset.sepoConfig) || "{}", {});
    _editarPreguntaRow.apply(this, arguments);
    setTimeout(function () {
      if (cfg.abierta) {
        if (q("#mp_A_precargaSi")) q("#mp_A_precargaSi").checked = !!cfg.abierta.tienePrecarga;
        if (q("#mp_A_precargaNo")) q("#mp_A_precargaNo").checked = !cfg.abierta.tienePrecarga;
        if (typeof window.ctrlAbierta === "function") window.ctrlAbierta();
        if (q("#mp_A_precargaSelect")) q("#mp_A_precargaSelect").value = cfg.abierta.precarga || "";
        if (q("#mp_A_respuestaEsperada")) q("#mp_A_respuestaEsperada").value = cfg.abierta.respuestaEsperada || "";
        if (q("#mp_A_valorEsperado")) q("#mp_A_valorEsperado").value = cfg.abierta.valorEsperado || "";
      }
      if (cfg.cerrada) {
        if (q("#mp_C_precarga")) q("#mp_C_precarga").checked = !!cfg.cerrada.tienePrecarga;
        if (q("#mp_C_precarga_opciones")) q("#mp_C_precarga_opciones").style.display = cfg.cerrada.tienePrecarga ? "block" : "none";
        if (q("#mp_C_precarga_defecto_select")) q("#mp_C_precarga_defecto_select").value = cfg.cerrada.precarga || "";
      }
    }, 80);
  };

  function sepoFillReplicaOrigen() {
    const sel = q("#replicaPreguntaOrigen");
    if (!sel) return;
    const preguntas = sepoGetStoredQuestions().filter(function (p) { return p.tipo === "cerrada"; });
    sel.innerHTML = '<option value="">Seleccionar pregunta origen...</option>';
    preguntas.forEach(function (p) {
      const opt = document.createElement("option");
      opt.value = p.id;
      opt.textContent = p.titulo;
      sel.appendChild(opt);
    });
  }

  function sepoIsCompatible(origen, destino) {
    if (!origen || !destino || origen.id === destino.id) return false;
    if (origen.tipo !== destino.tipo) return false;
    if ((origen.alternativas || []).length !== (destino.alternativas || []).length) return false;
    const ot = (origen.alternativas || []).map(function (a) { return a.tipo || "texto"; }).join("|");
    const dt = (destino.alternativas || []).map(function (a) { return a.tipo || "texto"; }).join("|");
    return ot === dt;
  }

  function sepoRenderReplicaDestinos() {
    const box = q("#replicaPreguntasDestino");
    const origenSel = q("#replicaPreguntaOrigen");
    if (!box || !origenSel) return;
    const preguntas = sepoGetStoredQuestions().filter(function (p) { return p.tipo === "cerrada"; });
    const origen = preguntas.find(function (p) { return p.id === origenSel.value; });
    if (!origen) {
      box.innerHTML = '<div class="text-muted">Selecciona una pregunta origen.</div>';
      return;
    }
    box.innerHTML = preguntas.map(function (p) {
      const ok = sepoIsCompatible(origen, p);
      return `<label class="item-row" style="opacity:${ok ? "1" : ".5"};cursor:${ok ? "pointer" : "not-allowed"};">
        <div class="inf">
          <input type="checkbox" class="form-check-input me-2" value="${p.id}" ${ok ? "" : "disabled"}>
          <div><div class="fw-semibold">${p.titulo}</div><small class="text-muted">Alternativas: ${(p.alternativas || []).length}</small></div>
        </div>
      </label>`;
    }).join("");
  }

  function sepoOpenReplicaModal() {
    sepoFillReplicaOrigen();
    sepoRenderReplicaDestinos();
    const el = q("#modalReplicarValores");
    if (el && window.bootstrap) new window.bootstrap.Modal(el).show();
  }

  function sepoApplyReplica() {
    const origenSel = q("#replicaPreguntaOrigen");
    const box = q("#replicaPreguntasDestino");
    if (!origenSel || !box) return;
    const preguntas = sepoGetStoredQuestions().filter(function (p) { return p.tipo === "cerrada"; });
    const origen = preguntas.find(function (p) { return p.id === origenSel.value; });
    const destinos = qa('input[type="checkbox"]:checked', box).map(function (c) { return c.value; });
    if (!origen || !destinos.length) {
      alert("Selecciona una pregunta origen y al menos una pregunta destino.");
      return;
    }
    const origenVals = qa('[data-score-question="' + origen.id + '"]').map(function (input) { return Number(input.value || 0); });
    destinos.forEach(function (destId) {
      qa('[data-score-question="' + destId + '"]').forEach(function (input, idx) {
        input.value = origenVals[idx] != null ? origenVals[idx] : 0;
      });
    });
    const el = q("#modalReplicarValores");
    const modal = el && window.bootstrap ? window.bootstrap.Modal.getInstance(el) : null;
    if (modal) modal.hide();
  }

  function sepoBindFeatureEvents() {
    if (q("#btnReplicarValores") && !q("#btnReplicarValores").dataset.sepoBound) {
      q("#btnReplicarValores").dataset.sepoBound = "1";
      q("#btnReplicarValores").addEventListener("click", sepoOpenReplicaModal);
    }
    if (q("#replicaPreguntaOrigen") && !q("#replicaPreguntaOrigen").dataset.sepoBound) {
      q("#replicaPreguntaOrigen").dataset.sepoBound = "1";
      q("#replicaPreguntaOrigen").addEventListener("change", sepoRenderReplicaDestinos);
    }
    if (q("#btnConfirmarReplicaValores") && !q("#btnConfirmarReplicaValores").dataset.sepoBound) {
      q("#btnConfirmarReplicaValores").dataset.sepoBound = "1";
      q("#btnConfirmarReplicaValores").addEventListener("click", sepoApplyReplica);
    }
  }

  window.precargarBolsito = function () {
    _precargarBolsito.apply(this, arguments);
    sepoRenderPlantillaReal();
    sepoBindFeatureEvents();
  };

  document.addEventListener("DOMContentLoaded", function () {
    sepoBindFeatureEvents();
  });
})(window, document);



/* ========================================== */
/* ACTUALIZACION: CORRECCIONES PUNTUALES UI   */
/* ========================================== */
(function (window, document) {
  "use strict";

  function q(sel, root) { return (root || document).querySelector(sel); }
  function qa(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }

  function sepoHardCloseModal(modalId) {
    const modalEl = document.getElementById(modalId);
    if (!modalEl) return;

    try {
      if (window.bootstrap) {
        const instance = window.bootstrap.Modal.getInstance(modalEl) || new window.bootstrap.Modal(modalEl);
        instance.hide();
      }
    } catch (e) {}

    modalEl.classList.remove("show");
    modalEl.setAttribute("aria-hidden", "true");
    modalEl.style.display = "none";
    document.body.classList.remove("modal-open");
    document.body.style.removeProperty("padding-right");
    document.body.style.overflow = "";
    qa(".modal-backdrop").forEach(function (bd) { bd.remove(); });
  }

  function sepoEnsureModalCleanup() {
    const modalEl = document.getElementById("modalNuevaPregunta");
    if (!modalEl || modalEl.dataset.sepoCleanupBound === "1") return;
    modalEl.dataset.sepoCleanupBound = "1";
    modalEl.addEventListener("hidden.bs.modal", function () {
      document.body.classList.remove("modal-open");
      document.body.style.removeProperty("padding-right");
      document.body.style.overflow = "";
      qa(".modal-backdrop").forEach(function (bd) { bd.remove(); });
    });
  }

  const _guardarNuevaPregunta_fixBase = window.guardarNuevaPregunta;
  window.guardarNuevaPregunta = function () {
    const result = _guardarNuevaPregunta_fixBase.apply(this, arguments);
    setTimeout(function () { sepoHardCloseModal("modalNuevaPregunta"); }, 10);
    return result;
  };

  window.duplicarPregunta = function (btn) {
    const row = btn.closest(".item-row");
    const box = document.getElementById("boxPreg");
    if (!row || !box) return;

    if (btn.dataset.sepoDupBusy === "1") return;
    btn.dataset.sepoDupBusy = "1";

    const clone = row.cloneNode(true);
    const desc = clone.querySelector(".desc-text");
    if (desc) {
      desc.textContent = (desc.textContent || "Pregunta") + " (Copia)";
    }

    clone.dataset.sepoId = "preg_" + Date.now();

    if (row.dataset.sepoConfig) {
      clone.dataset.sepoConfig = row.dataset.sepoConfig;
    }

    row.after(clone);

    if (typeof window.renumerarContenedor === "function") {
      window.renumerarContenedor("#boxPreg");
    }

    if (typeof window.precargarBolsito === "function") {
      window.precargarBolsito();
    }

    if (typeof window.showToast === "function") {
      window.showToast("✅ Pregunta duplicada.");
    }

    setTimeout(function () {
      btn.dataset.sepoDupBusy = "0";
    }, 250);
  };

  function sepoFindOrderBlock(card) {
    const candidates = qa("div", card);
    return candidates.find(function (el) {
      const label = q("label", el);
      const input = q('input[type="number"][onchange*="reordenarPrestacion"]', el);
      return !!label && !!input && /orden/i.test(label.textContent || "");
    }) || null;
  }

  function sepoMoveOrderFieldsLeft() {
    qa("#lista-sepo .card-item, #lista-complementario .card-item, #listaPrestOrden .card-item").forEach(function (card) {
      const orderInput = q('input[type="number"][onchange*="reordenarPrestacion"]', card);
      if (!orderInput) return;
      const orderBlock = orderInput.closest("div");
      const icon = q(".icon-box", card);
      const firstMeta = icon ? icon.nextElementSibling : null;
      if (!orderBlock || !icon || !firstMeta) return;
      if (orderBlock.previousElementSibling === icon) return;
      icon.insertAdjacentElement("afterend", orderBlock);
    });
  }

  function sepoInferHistorialDesdeDOM(modulo) {
    const map = {
      "Centros Médicos": "#screen-centros .card-item",
      "Grado de Instrucción": "#screen-grado .card-item",
      "Ocupaciones": "#screen-ocupaciones .card-item",
      "Grupos Ocupacionales": "#screen-grupos .card-item",
      "Prestaciones": "#screen-prestaciones .card-item",
      "Fichas": "#screen-fichas .card-item",
      "Orden de Prestaciones": "#screen-orden .card-item",
      "Pruebas Psicológicas": "#screen-pruebas .card-prueba"
    };
    const selector = map[modulo];
    if (!selector) return [];
    const rows = qa(selector).slice(0, 10);
    const now = new Date();
    const stamp = now.getFullYear() + "-" + String(now.getMonth()+1).padStart(2,"0") + "-" + String(now.getDate()).padStart(2,"0") + " " + String(now.getHours()).padStart(2,"0") + ":" + String(now.getMinutes()).padStart(2,"0");
    return rows.map(function (row, idx) {
      const strong = q("strong", row);
      const name = q(".fw-semibold, .prueba-title, .desc-text", row);
      return {
        fecha: stamp,
        usuario: "Sistema",
        accion: idx % 2 === 0 ? "Consulta" : "Edición",
        registro: strong ? strong.textContent.trim() : ("REG-" + (idx + 1)),
        detalles: name ? name.textContent.trim() : "Registro visualizado",
        modulo: modulo
      };
    });
  }

  const _verHistorialBase = window.verHistorial;
  window.verHistorial = function (modulo) {
    const tbody = document.getElementById("historialTableBody");
    const title = document.getElementById("historialModuloTitle");
    if (!tbody || !title) {
      return _verHistorialBase ? _verHistorialBase.apply(this, arguments) : undefined;
    }

    title.textContent = modulo;
    let filtrados = [];
    try {
      filtrados = (_historialDemo || []).filter(function (h) { return h.modulo === modulo; });
    } catch (e) {
      filtrados = [];
    }

    if (!filtrados.length) {
      filtrados = sepoInferHistorialDesdeDOM(modulo);
    }

    tbody.innerHTML = "";
    if (!filtrados.length) {
      tbody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-muted">No hay cambios registrados recientemente.</td></tr>';
    } else {
      filtrados.slice().reverse().forEach(function (h) {
        tbody.innerHTML += `
          <tr>
            <td class="ps-4 fw-medium text-muted">${h.fecha}</td>
            <td>${h.usuario}</td>
            <td><span class="badge bg-light text-dark border">${h.accion}</span></td>
            <td class="fw-semibold">${h.registro}</td>
            <td class="pe-4">${h.detalles}</td>
          </tr>
        `;
      });
    }

    const modalEl = document.getElementById("modalHistorial");
    if (modalEl && window.bootstrap) {
      new window.bootstrap.Modal(modalEl).show();
    }
  };

  function sepoCompactLists() {
    // la mayor parte se resuelve por CSS; aquí solo ajustamos alturas puntuales
    qa(".card-item").forEach(function (el) {
      el.style.minHeight = "unset";
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    sepoEnsureModalCleanup();
    sepoMoveOrderFieldsLeft();
    sepoCompactLists();
  });

  document.addEventListener("sepo:screen:change", function () {
    setTimeout(function () {
      sepoMoveOrderFieldsLeft();
      sepoCompactLists();
    }, 30);
  });

  window.SEPOUIHardFixes = {
    sepoHardCloseModal,
    sepoMoveOrderFieldsLeft
  };
})(window, document);



/* ========================================== */
/* ACTUALIZACION: HOTFIX DUPLICAR Y ORDEN     */
/* ========================================== */
(function (window, document) {
  "use strict";

  function q(sel, root) { return (root || document).querySelector(sel); }
  function qa(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }

  document.addEventListener("click", function (e) {
    const btn = e.target.closest('button[title*="Duplicar"], button[title*="duplicar"]');
    if (!btn) return;
    const row = btn.closest("#boxPreg .item-row");
    if (!row) return;

    e.preventDefault();
    e.stopPropagation();

    if (typeof window.duplicarPregunta === "function") {
      window.duplicarPregunta(btn);
    }
  }, true);

  function moveOnlyOrderField() {
    qa("#lista-sepo .card-item, #lista-complementario .card-item, #listaPrestOrden .card-item").forEach(function (card) {
      const orderInput = q('input[type="number"][onchange*="reordenarPrestacion"]', card);
      if (!orderInput) return;

      const orderBlock = orderInput.closest("div");
      if (!orderBlock) return;

      const icon = q(".icon-box", card);
      const firstMeta = icon ? icon.nextElementSibling : null;
      if (!icon || !firstMeta) return;

      if (orderBlock.previousElementSibling === icon) return;

      icon.insertAdjacentElement("afterend", orderBlock);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    moveOnlyOrderField();
  });

  document.addEventListener("sepo:screen:change", function () {
    setTimeout(moveOnlyOrderField, 30);
  });

  window.SEPOHotfixV2 = { moveOnlyOrderField: moveOnlyOrderField };
})(window, document);
