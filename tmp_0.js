
      // ── Orden de Prestaciones ─────────────────────────────────
      // (Drag & Drop e initDrag definidos más abajo en el bloque dedicado)

      /* ── Mover ítem arriba/abajo ── */
      function moverOrden(btn, dir) {
        const card = btn.closest('.card-item');
        if (!card) return;
        if (dir === 'up' && card.previousElementSibling) {
          card.parentNode.insertBefore(card, card.previousElementSibling);
        } else if (dir === 'down' && card.nextElementSibling) {
          card.parentNode.insertBefore(card.nextElementSibling, card);
        }
      }

      /* ── Añadir Prestación Automática al final ── */
      function appendNuevaPrestacion() {
        const cod = document.getElementById("pCod") ? document.getElementById("pCod").value || 'PR-NUEVO' : 'PR-NUEVO';
        const desc = document.getElementById("pDesc") ? document.getElementById("pDesc").value || 'Nueva Prestación' : 'Nueva Prestación';
        const activo = document.getElementById("pEstado") ? document.getElementById("pEstado").value === "activo" : true;
        const statusHTML = activo ? '<span class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25" style="padding: 3px 6px; font-size: 0.7rem; font-weight: 500;">Activo</span>' : '<span class="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25" style="padding: 3px 6px; font-size: 0.7rem; font-weight: 500;">Inactivo</span>';
        
        const isComplementario = document.getElementById("pTipoExamen") && document.getElementById("pTipoExamen").value === "complementario";
        const listaId = isComplementario ? "lista-complementario" : "lista-sepo";
        const lista = document.getElementById(listaId);
        if (!lista) return;

        const totalItems = lista.querySelectorAll('.card-item').length;
        const card = document.createElement('div');
        const bgStyle = isComplementario ? "background: #ffedd5; color: #c2410c;" : "background: #e0f2fe; color: var(--primary);";
        const iconClass = isComplementario ? "fas fa-helmet-safety" : "fas fa-heart-pulse";

        card.className = "card-item p-2 d-flex align-items-center shadow-sm mb-2";
        card.style.cssText = "gap: 1rem; border-radius: 8px; border: 1px solid var(--border-light); background: #fff;";
        card.innerHTML = `
          <div class="icon-box" style="${bgStyle} width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 8px; flex-shrink: 0; font-size: 1.1rem;">
            <i class="${iconClass}"></i>
          </div>
          <div class="flex-grow-1 d-flex flex-column" style="min-width: 0;">
            <div class="d-flex align-items-center gap-2 flex-wrap">
              <strong style="color: var(--primary); font-size: 0.9rem;">${cod}</strong>
              <span class="muted-dot">•</span>
              <span class="fw-semibold text-truncate" style="font-size: 0.95rem; max-width: 250px;" title="${desc}">${desc}</span>
              ${statusHTML}
            </div>
          </div>
          <div class="d-flex align-items-center gap-4 flex-shrink-0">
            <div class="d-flex align-items-center gap-3 text-muted" style="font-size: 0.85rem;">
              <span title="Fichas asociadas" class="d-flex align-items-center"><i class="fas fa-clipboard-list me-2 text-primary"></i><span class="fw-medium">0 fichas</span></span>
              <span title="Pruebas" class="d-flex align-items-center"><i class="fas fa-file-medical-alt me-2 text-primary"></i><span class="fw-medium">0 pruebas</span></span>
            </div>
            <div class="d-flex align-items-center gap-2">
              <label class="small text-muted fw-bold mb-0">Pos:</label>
              <input type="number" class="form-control form-control-sm text-center fw-bold text-primary border-primary" onchange="reordenarPrestacion(this)" value="${totalItems + 1}" min="1" style="width: 50px; height: 30px; border-radius: 6px; font-size: 0.9rem;">
            </div>
            <span class="badge bg-warning text-dark border border-warning"><i class="fas fa-clock me-1"></i>Sin Orden</span>
          </div>`;

        lista.appendChild(card);
        if(typeof initDrag === 'function') initDrag(card);
      }

      /* ── Modal: Añadir Prestación al Orden ── */
      let _grupoOrdenActivo = 'principal';

      function abrirAddPrestOrden(grupo) {
        _grupoOrdenActivo = grupo;
        const lbl = document.getElementById('lblGrupoOrden');
        if (lbl) lbl.textContent = grupo === 'principal'
          ? 'Añadiendo a: Examen Principal'
          : 'Añadiendo a: Exámenes Complementarios';
        const inp = document.getElementById('inputBuscadorPrestOrden');
        if (inp) inp.value = '';
        // Mostrar todos los items del listado
        document.querySelectorAll('#listaPrestOrden .item-row').forEach(r => r.style.display = '');
      }

      function filtrarListaPrestOrden(query) {
        const q = query.toLowerCase();
        document.querySelectorAll('#listaPrestOrden .item-row').forEach(row => {
          const txt = row.textContent.toLowerCase();
          row.style.display = txt.includes(q) ? '' : 'none';
        });
      }

      function confirmarAddPrestOrden(cod, nombre) {
        const lista = document.getElementById(
          _grupoOrdenActivo === 'principal' ? 'lista-sepo' : 'lista-complementario'
        );
        if (!lista) return;
        const icoBg    = _grupoOrdenActivo === 'principal' ? '#e0f2fe' : '#ffedd5';
        const icoCol   = _grupoOrdenActivo === 'principal' ? 'var(--primary)' : '#c2410c';
        const icoClass = _grupoOrdenActivo === 'principal' ? 'fa-heart-pulse' : 'fa-helmet-safety';
        const tarjeta = document.createElement('div');
        tarjeta.className = 'card-item';
        initDrag(tarjeta);
        tarjeta.innerHTML = `
          <div class="icon-box" style="background:${icoBg};color:${icoCol}"><i class="fas ${icoClass}"></i></div>
          <div class="flex-grow-1">
            <div class="d-flex align-items-center gap-2 mb-1 flex-wrap">
              <strong style="color:var(--primary)">${cod}</strong>
              <span class="muted-dot">•</span>
              <span class="fw-semibold">${nombre}</span>
              <span class="b-activo">Activo</span>
            </div>
            <small class="text-muted d-flex align-items-center gap-3 mt-1">
              <span><i class="fas fa-clipboard-list me-1"></i>0 fichas</span>
              <span><i class="fas fa-file-medical-alt me-1"></i>0 pruebas</span>
            </small>
          </div>
          <div class="d-flex gap-2 align-items-center">
            <div class="d-flex flex-column align-items-center gap-1 me-2">
                <label class="small text-muted fw-bold mb-0" style="font-size: 0.65rem;">Posición</label>
                <input type="number" class="form-control form-control-sm text-center fw-bold" value="${lista.querySelectorAll('.card-item').length + 1}" min="1" style="width: 50px; height: 32px; border-radius: 8px; border: 2px solid var(--border-light);" onchange="reordenarPrestacion(this)">
            </div>
            <button class="btn-prim" style="font-size:0.8rem;padding:8px 16px"
              data-bs-toggle="modal" data-bs-target="#modalOrdenPruebas"
              onclick="abrirOrdenPruebas('${cod}', false)">
              <i class="fas fa-sort me-1"></i>Orden de Pruebas
            </button>
          </div>`;
        lista.appendChild(tarjeta);
        // Cerrar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalAddPrestOrden'));
        if (modal) modal.hide();
        showToast('✅ Prestación añadida al orden correctamente.');
      }

      /* ── Modal: Orden de Pruebas ── */
      const _pruebasPorGrupo = {
        'GO-001': [
          { cod: 'PSI-ANS-001', nom: 'Escala de Ansiedad de Beck' },
          { cod: 'PSI-CMP-002', nom: 'Competencias Laborales Volcán' }
        ],
        'GO-002': [
          { cod: 'PSI-ALT-003', nom: 'Evaluación Psicológica – Altura' },
          { cod: 'PSI-ANS-001', nom: 'Escala de Ansiedad de Beck' },
          { cod: 'PSI-CHI-004', nom: 'Entrevista Psicológica Chinalco' }
        ],
        'GO-003': [
          { cod: 'PSI-CHI-004', nom: 'Entrevista Psicológica Chinalco' },
          { cod: 'PSI-CMP-002', nom: 'Competencias Laborales Volcán' },
          { cod: 'PSI-ALT-003', nom: 'Evaluación Psicológica – Altura' }
        ]
      };

      function abrirOrdenPruebas(codPrest, depGrupo) {
        // Actualizar título del modal
        const titulo = document.getElementById('tOrdenPruebas');
        if (titulo) titulo.innerHTML = '<i class="fas fa-sort me-2 text-primary"></i>Orden de Pruebas — ' + codPrest;

        const sg = document.getElementById('selectorGrupoOrden');
        const lp = document.getElementById('listaPruebasOrden');

        if (depGrupo) {
          // Mostrar selector de grupo, ocultar lista
          if (sg) sg.style.display = 'block';
          if (lp) lp.style.display = 'none';
          const sel = document.getElementById('selectGrupoOrden');
          if (sel) sel.value = '';
        } else {
          // Mostrar lista directamente con pruebas pre-cargadas
          if (sg) sg.style.display = 'none';
          if (lp) {
            lp.style.display = 'block';
            lp.innerHTML = `
              <div class="card-item item-row p-3 mb-2 border rounded shadow-sm bg-white d-flex align-items-center justify-content-between">
                <div class="d-flex flex-column">
                    <strong class="text-primary" style="font-size: 0.9rem;">PSI-ANS-001</strong>
                    <span class="text-dark fw-medium mb-1">Escala de Ansiedad de Beck</span>
                    <div class="d-flex gap-2">
                        <span class="text-muted" style="font-size: 0.75rem;"><i class="fas fa-clock me-1"></i>45 min</span>
                        <span class="text-muted" style="font-size: 0.75rem;"><i class="fas fa-question-circle me-1"></i>30 preg</span>
                    </div>
                </div>
                <div class="d-flex flex-column align-items-center gap-1">
                    <label class="small text-muted fw-bold mb-0" style="font-size: 0.65rem;">Posición</label>
                    <input type="number" class="form-control form-control-sm text-center fw-bold text-primary border-primary" style="width: 50px; border-radius: 8px;" value="1" min="1" onchange="reordenarPrestacion(this)">
                </div>
              </div>
              <div class="card-item item-row p-3 mb-2 border rounded shadow-sm bg-white d-flex align-items-center justify-content-between">
                <div class="d-flex flex-column">
                    <strong class="text-primary" style="font-size: 0.9rem;">PSI-CMP-002</strong>
                    <span class="text-dark fw-medium mb-1">Competencias Laborales Volcán</span>
                    <div class="d-flex gap-2">
                        <span class="text-muted" style="font-size: 0.75rem;"><i class="fas fa-clock me-1"></i>45 min</span>
                        <span class="text-muted" style="font-size: 0.75rem;"><i class="fas fa-question-circle me-1"></i>30 preg</span>
                    </div>
                </div>
                <div class="d-flex flex-column align-items-center gap-1">
                    <label class="small text-muted fw-bold mb-0" style="font-size: 0.65rem;">Posición</label>
                    <input type="number" class="form-control form-control-sm text-center fw-bold text-primary border-primary" style="width: 50px; border-radius: 8px;" value="2" min="1" onchange="reordenarPrestacion(this)">
                </div>
              </div>`;
            lp.querySelectorAll('.card-item').forEach(initDrag);
          }
        }
      }

      function cargarPruebasOrden() {
        const grupo = document.getElementById('selectGrupoOrden')?.value;
        const lp = document.getElementById('listaPruebasOrden');
        if (!grupo || !lp) return;
        const pruebas = _pruebasPorGrupo[grupo] || [];
        if (pruebas.length === 0) {
          lp.style.display = 'none';
          return;
        }
        lp.style.display = 'block';
        lp.innerHTML = pruebas.map((p, index) => `
          <div class="card-item item-row p-3 mb-2 border rounded shadow-sm bg-white d-flex align-items-center justify-content-between">
              <div class="d-flex flex-column">
                  <strong class="text-primary" style="font-size: 0.9rem;">${p.cod}</strong>
                  <span class="text-dark fw-medium mb-1">${p.nom}</span>
                  <div class="d-flex gap-2">
                      <span class="text-muted" style="font-size: 0.75rem;"><i class="fas fa-clock me-1"></i>45 min</span>
                      <span class="text-muted" style="font-size: 0.75rem;"><i class="fas fa-question-circle me-1"></i>30 preg</span>
                  </div>
              </div>
              <div class="d-flex flex-column align-items-center gap-1">
                  <label class="small text-muted fw-bold mb-0" style="font-size: 0.65rem;">Posición</label>
                  <input type="number" class="form-control form-control-sm text-center fw-bold text-primary border-primary" style="width: 50px; border-radius: 8px;" value="${index + 1}" min="1" onchange="reordenarPrestacion(this)">
              </div>
          </div>`).join('');
        lp.querySelectorAll('.card-item').forEach(initDrag);
      }

      // Inicializar drag & drop en los card-item existentes al cargar la página
      document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('#lista-sepo .card-item, #lista-complementario .card-item').forEach(initDrag);
      });

    