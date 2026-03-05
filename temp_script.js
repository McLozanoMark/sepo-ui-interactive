<script>
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
        { codigo: "CPSG-002", descripcion: "Evaluación de Liderazgo (Grupo)" }
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
        
        const encontrada = FICHAS_DB.find(f => 
          f.codigo.toLowerCase().includes(val) || 
          f.descripcion.toLowerCase().includes(val)
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
        if (e.target?.id === "sfDes") autocompleteFicha("sfDes", "sfCod", false);
      });

      /* ── HELPERS ── */
      function pushItem(boxId, emptyId, html) {
        const box = document.getElementById(boxId);
        document.getElementById(emptyId)?.remove();
        const d = document.createElement("div");
        d.innerHTML = html;
        box.appendChild(d.firstElementChild);
      }
      function resetBox(boxId, emptyId, icon, msg) {
        document.getElementById(boxId).innerHTML =
          `<div class="text-center text-muted py-4 small" id="${emptyId}"><i class="${icon} fa-3x mb-3 opacity-25"></i><br>${msg}</div>`;
      }

      /* ── CENTROS ── */
      function nuevoCentro() {
        document.getElementById("tCentro").innerHTML =
          '<i class="fas fa-hospital me-2 text-primary"></i>Nuevo Centro Médico';
        ["cCod", "cDesc", "cDir"].forEach(
          (id) => (document.getElementById(id).value = ""),
        );
        document.getElementById("cActivo").checked = true;
        document.getElementById("cVirtual").checked = false;
      }
      function editarCentro(cod, activo, virtual) {
        document.getElementById("tCentro").innerHTML =
          '<i class="fas fa-pen me-2 text-primary"></i>Editar: ' + cod;
        document.getElementById("cCod").value = cod;
        document.getElementById("cActivo").checked = !!activo;
        document.getElementById("cVirtual").checked = !!virtual;
      }

      /* ── SIMPLE ── */
      function nuevoSimple(tipo) {
        document.getElementById("tSimple").innerHTML =
          '<i class="fas fa-plus me-2 text-primary"></i>Nuevo ' + tipo;
        document.getElementById("sCod").value = "";
        document.getElementById("sDesc").value = "";
        document.getElementById("sActivo").checked = true;
      }
      function editarSimple(cod, desc) {
        document.getElementById("tSimple").innerHTML =
          '<i class="fas fa-pen me-2 text-primary"></i>Editar Registro';
        document.getElementById("sCod").value = cod;
        document.getElementById("sDesc").value = desc;
      }

      /* ── PRESTACIONES ── */
      function nuevaPrestacion() {
        document.getElementById("tPrest").innerHTML =
          '<i class="fas fa-stethoscope me-2 text-primary"></i>Nueva Prestación';
        ["pCod", "pDesc", "pIcono"].forEach(
          (id) =>
            (document.getElementById(id).value =
              id === "pIcono" ? "fa-stethoscope" : ""),
        );
        document.getElementById("pIconoSelect").value = "fa-stethoscope";
        document.getElementById("pIconoPreview").innerHTML =
          '<i class="fas fa-stethoscope"></i>';
        document.getElementById("pEstado").value = "activo";
        document.getElementById("pTipoEx").value = "";
        resetBox("boxPF", "emptyPF", "fas fa-inbox", "Sin fichas vinculadas.");
        updatePrestIconos();
      }
      function editarPrestacion(cod) {
        document.getElementById("tPrest").innerHTML =
          '<i class="fas fa-pen me-2 text-primary"></i>Editar: ' + cod;
        document.getElementById("pCod").value = cod;

        let icon = "fa-stethoscope";

        if (cod === "PR-PSI-001") {
          document.getElementById("pDesc").value =
            "Evaluación Psicológica – Entrevista";
          document.getElementById("pEstado").value = "activo";
          document.getElementById("pTipoEx").value = "principal";
          icon = "fa-heart-pulse";
          resetBox(
            "boxPF",
            "emptyPF",
            "fas fa-inbox",
            "Sin fichas vinculadas.",
          );
          pushItem("boxPF", "emptyPF", rowPF("CPS-001", "Escala de Ansiedad"));
          pushItem(
            "boxPF",
            "emptyPF",
            rowPF("CPS-010", "Entrevista Psicológica - Básica"),
          );
        } else {
          document.getElementById("pDesc").value =
            "Psicología Ocupacional – Altura";
          document.getElementById("pEstado").value = "cesado";
          document.getElementById("pTipoEx").value = "altura";
          icon = "fa-helmet-safety";
          resetBox(
            "boxPF",
            "emptyPF",
            "fas fa-inbox",
            "Sin fichas vinculadas.",
          );
          pushItem(
            "boxPF",
            "emptyPF",
            rowPF("CPSG-001", "Competencias Laborales"),
          );
        }
        document.getElementById("pIcono").value = icon;
        document.getElementById("pIconoSelect").value = icon;
        document.getElementById("pIconoPreview").innerHTML =
          `<i class="fas ${icon}"></i>`;
        updatePrestIconos();
      }
      function addFichaPrestacion() {
        const val = document.getElementById("pfCod").value.trim();
        if(!val) { alert('Ingrese una búsqueda'); return; }
        
        // Find in DB
        const f = typeof FICHAS_DB !== 'undefined' ? FICHAS_DB.find(x => 
            x.codigo.toLowerCase().includes(val.toLowerCase()) || 
            x.descripcion.toLowerCase().includes(val.toLowerCase())
        ) : null;
        
        let cod = val.toUpperCase();
        let des = "—";
        if(f) {
           cod = f.codigo;
           des = f.descripcion;
        }
        
        pushItem("boxPF", "emptyPF", rowPF(cod, des));
        document.getElementById("pfCod").value = "";
      }
      function rowPF(cod, des) {
        return `<div class="item-row"><div class="inf"><span class="tag tag-fich fw-bold"><i class="fas fa-file-alt me-1 text-primary"></i>${cod}</span><span class="fw-medium">${des}</span></div><button class="btn btn-light rounded-circle text-danger p-0" style="width:32px;height:32px;" onclick="this.closest('.item-row').remove()"><i class="fas fa-times"></i></button></div>`;
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
        document.getElementById("tFicha").innerHTML =
          '<i class="fas fa-clipboard-list me-2 text-primary"></i>Nueva Ficha';
        document.getElementById("fCod").value = "";
        document.getElementById("fDesc").value = "";
        document.getElementById("chkGrupo").checked = false;
        document.getElementById("chkFinalizar").checked = false;
        setEstadoFichaMode("create");
        document.getElementById("secCD").style.display = "block";
        document.getElementById("secSF").style.display = "none";
        resetBox("boxCD", "emptyCD", "fas fa-inbox", "Sin Códigos Dato.");
        resetBox("boxSF", "emptySF", "fas fa-sitemap", "Sin sub-fichas.");
      }
      function editarFicha(cod, esGrupo) {
        document.getElementById("tFicha").innerHTML =
          '<i class="fas fa-pen me-2 text-primary"></i>Editar Ficha: ' + cod;
        document.getElementById("fCod").value = cod;
        setEstadoFichaMode("edit");
        document.getElementById("fEstado").value = "activo";
        document.getElementById("chkGrupo").checked = !!esGrupo;
        toggleGrupo();
        resetBox("boxCD", "emptyCD", "fas fa-inbox", "Sin Códigos Dato.");
        resetBox("boxSF", "emptySF", "fas fa-sitemap", "Sin sub-fichas.");
        if (!esGrupo) {
          pushItem(
            "boxCD",
            "emptyCD",
            rowCD("PUN-001", "Puntaje Total", "puntaje", "activo"),
          );
          pushItem(
            "boxCD",
            "emptyCD",
            rowCD("NIV-001", "Nivel Resultante", "nivel", "activo"),
          );
          pushItem(
            "boxCD",
            "emptyCD",
            rowCD(
              "INT-001",
              "Interpretación Clínica",
              "interpretacion",
              "activo",
            ),
          );
        } else {
          pushItem("boxSF", "emptySF", rowSF("CPS-001", "Escala de Ansiedad"));
          pushItem("boxSF", "emptySF", rowSF("CPS-002", "Escala de Depresión"));
          pushItem(
            "boxSF",
            "emptySF",
            rowSF("CPS-003", "Competencias Laborales - Módulo 1"),
          );
        }
      }
      function toggleGrupo() {
        const g = document.getElementById("chkGrupo").checked;
        document.getElementById("secCD").style.display = g ? "none" : "block";
        document.getElementById("secSF").style.display = g ? "block" : "none";
      }
      function addCD() {
        const cod = document.getElementById("cdCod").value.trim().toUpperCase(),
          des = document.getElementById("cdDes").value.trim(),
          tip = document.getElementById("cdTip").value,
          est = document.getElementById("cdEst").value;
        if (!cod || !des || !tip || !est) {
          alert("Faltan datos.");
          return;
        }
        pushItem("boxCD", "emptyCD", rowCD(cod, des, tip, est));
        ["cdCod", "cdDes"].forEach(
          (id) => (document.getElementById(id).value = ""),
        );
        document.getElementById("cdTip").value = "";
        document.getElementById("cdEst").value = "activo";
      }
      function addSF() {
        const cod = document.getElementById("sfCod").value.trim().toUpperCase(),
          des =
            document.getElementById("sfDes").value.trim() ||
            FICHAS_DB[cod] ||
            "—";
        if (!cod) {
          alert("Ingresa código.");
          return;
        }
        pushItem("boxSF", "emptySF", rowSF(cod, des));
        document.getElementById("sfCod").value = "";
        document.getElementById("sfDes").value = "";
      }
      function rowCD(cod, des, tip, est) {
        return `<div class="item-row"><div class="inf"><strong style="color:var(--primary)">${cod}</strong><span class="fw-medium">${des}</span><span class="tag ${TIPO_CLASS[tip]}">${TIPO_ICON[tip]} ${TIPO_LABEL[tip]}</span>${est === "activo" ? '<span class="b-activo">Activo</span>' : '<span class="b-cesado">Cesado</span>'}</div><button class="btn btn-light rounded-circle text-danger p-0" style="width:32px;height:32px;" onclick="this.closest('.item-row').remove()"><i class="fas fa-times"></i></button></div>`;
      }
      function rowSF(cod, des) {
        return `<div class="item-row"><div class="inf"><span class="tag tag-fich fw-bold"><i class="fas fa-file-alt me-1 text-primary"></i>${cod}</span><span class="fw-medium">${des}</span></div><button class="btn btn-light rounded-circle text-danger p-0" style="width:32px;height:32px;" onclick="this.closest('.item-row').remove()"><i class="fas fa-times"></i></button></div>`;
      }

      /* ══════════════════════════════
       PRUEBAS PSICOLÓGICAS
    ══════════════════════════════ */
      let currentStep = 0;
      const stepIds = [0, 1, 2, 2.5, 3, 4];
      const stepPct = [16, 33, 50, 66, 83, 100];

      function goStep(n) {
        n = parseFloat(n);
        const cIdx = stepIds.indexOf(n);
        if (cIdx === -1) return;

        for (let i = 0; i < stepIds.length; i++) {
          const sId = stepIds[i];
          const elTab = document.getElementById("step-" + sId);
          if (elTab) elTab.classList.remove("active");
          const snum = document.getElementById("snum-" + sId);
          const items = document.querySelectorAll(".stepper-item");
          const item = items[i];
          if (snum && item) {
            item.classList.remove("active");
            if (i < cIdx) {
              snum.className = "stepper-num done";
              snum.innerHTML =
                '<i class="fas fa-check" style="font-size:.7rem"></i>';
            } else if (sId === n) {
              snum.className = "stepper-num active";
              snum.innerHTML = sId === 2.5 ? "P" : (sId + 1);
              item.classList.add("active");
            } else {
              snum.className = "stepper-num pend";
              snum.innerHTML = sId === 2.5 ? "P" : (sId + 1);
            }
          }
        }
        const activeTab = document.getElementById("step-" + n);
        if (activeTab) activeTab.classList.add("active");
        
        currentStep = n;
        const fill = document.getElementById("modalProgressFill");
        if(fill) fill.style.width = stepPct[cIdx] + "%";
        
        const pct = document.getElementById("modalProgressPct");
        if(pct) pct.textContent = stepPct[cIdx] + "%";
        
        const btnPrev = document.getElementById("btnPrev");
        if(btnPrev) btnPrev.style.display = cIdx === 0 ? "none" : "inline-flex";
        
        const btnNext = document.getElementById("btnNext");
        if(btnNext) btnNext.style.display = cIdx === stepIds.length - 1 ? "none" : "inline-flex";
        
        const btnFinal = document.getElementById("btnGuardarFinal");
        if(btnFinal) {
           btnFinal.style.display = (cIdx === stepIds.length - 1) ? "inline-flex" : "none";
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
        const cIdx = stepIds.indexOf(currentStep);
        if (cIdx >= 0 && cIdx < stepIds.length - 1) {
          goStep(stepIds[cIdx + 1]);
        }
      }
      
      function prevStep() {
        const cIdx = stepIds.indexOf(currentStep);
        if (cIdx > 0) goStep(stepIds[cIdx - 1]);
      }

      function nuevaPrueba() {
        document.getElementById("tPrueba").innerHTML =
          '<i class="fas fa-file-medical-alt me-2 text-primary"></i>Nueva Prueba Psicológica';
        ["prCod", "prNom", "prIcon"].forEach(
          (id) => (document.getElementById(id).value = ""),
        );
        document.getElementById("prIconoSelect").value = "fa-brain";
        document.getElementById("prEmojiPreview").innerHTML =
          '<i class="fas fa-brain"></i>';
        resetBox("boxPreg", "emptyPreg", "fas fa-question", "Sin preguntas.");
        
        resetBox("boxFac", "emptyFac", "fas fa-layer-group", "Sin factores.");
        resetBox("boxResp", "emptyResp", "fas fa-check-double", "Sin claves.");
        
        document.getElementById("portadaTitulo").value = "";
        document.getElementById("portadaInstrucciones").value = "";
        document.getElementById("selectPlantillaPortada").value = "estandar";
        renderPreviewPortada();
        
        go('prueba-form');
        goStep(0);
      }

      function editarPrueba(cod) {
        document.getElementById("tPrueba").innerHTML =
          '<i class="fas fa-pen me-2 text-primary"></i>Editar Prueba: ' + cod;
        const demos = {
          "PSI-ANS-001": {
            nom: "Escala de Ansiedad de Beck",
            tipo: "ingreso",
            est: "activo",
            icon: "fa-brain",
            step: 4,
          },
          "PSI-CMP-002": {
            nom: "Competencias Laborales Volcán",
            tipo: "periodico",
            est: "borrador",
            icon: "fa-puzzle-piece",
            step: 1,
          },
          "PSI-ALT-003": {
            nom: "Evaluación Psicológica – Altura",
            tipo: "altura",
            est: "borrador",
            icon: "fa-helmet-safety",
            step: 0,
          },
          "PSI-CHI-004": {
            nom: "Entrevista Psicológica Chinalco",
            tipo: "retiro",
            est: "cesado",
            icon: "fa-clipboard-check",
            step: 4,
          },
        };
        const d = demos[cod];
        if (d) {
          document.getElementById("prCod").value = cod;
          document.getElementById("prNom").value = d.nom;
          document.getElementById("prIcon").value = d.icon;
          document.getElementById("prIconoSelect").value = d.icon;
          document.getElementById("prEmojiPreview").innerHTML =
            '<i class="fas ' + d.icon + '"></i>';
          resetBox("boxPreg", "emptyPreg", "fas fa-question", "Sin preguntas.");
          
          resetBox("boxFac", "emptyFac", "fas fa-layer-group", "Sin factores.");
          resetBox(
            "boxResp",
            "emptyResp",
            "fas fa-check-double",
            "Sin claves.",
          );
          if (d.step >= 1) {
            document.getElementById("selectPlantillaPortada").value = "detallada";
            document.getElementById("portadaTitulo").value = d.nom + " - Bienvenida";
            document.getElementById("portadaInstrucciones").value = "1. Lea atentamente antes de contestar.\n2. No hay respuestas correctas o incorrectas.\n3. Tiene un tiempo límite según aplique.";
            renderPreviewPortada();
          }
          if (d.step >= 2) {
            if (cod === "PSI-ANS-001") {
               pushItem("boxPreg", "emptyPreg", rowPregunta(1, "¿Con qué frecuencia siente tensión muscular?", "cerrada"));
               pushItem("boxPreg", "emptyPreg", rowPregunta(2, "¿Dibuja a una persona bajo la lluvia?", "abierta"));
               pushItem("boxPreg", "emptyPreg", rowPregunta(3, "Indique los problemas que reconoce frecuentemente", "cerrada"));
            } else if (cod === "PSI-CHI-004") {
               pushItem("boxPreg", "emptyPreg", rowPregunta(1, "¿Cuál fue el motivo de salida de su anterior empleo?", "abierta"));
               pushItem("boxPreg", "emptyPreg", rowPregunta(2, "Describa tres fortalezas y debilidades", "abierta"));
               pushItem("boxPreg", "emptyPreg", rowPregunta(3, "¿Cómo reacciona ante la presión?", "abierta"));
            } else {
               pushItem("boxPreg", "emptyPreg", rowPregunta(1, "Pregunta de prueba generada automáticamente", "cerrada"));
            }
          }
          if (d.step >= 3) {
            if (cod === "PSI-ANS-001") {
               pushItem("boxFac", "emptyFac", rowFactor("FAC-001", "Ansiedad Somática"));
               pushItem("boxFac", "emptyFac", rowFactor("FAC-002", "Ansiedad Cognitiva"));
            } else if (cod === "PSI-CHI-004") {
               pushItem("boxFac", "emptyFac", rowFactor("FAC-ENT-A", "Competencias Blandas"));
               pushItem("boxFac", "emptyFac", rowFactor("FAC-ENT-B", "Estabilidad Emocional"));
            }
          }
          if (d.step >= 4) {
            if (cod === "PSI-ANS-001") {
               pushItem("boxResp", "emptyResp", rowRespuesta(1, "B", "FAC-001"));
               pushItem("boxResp", "emptyResp", rowRespuesta(2, "C", "FAC-002"));
            } else if (cod === "PSI-CHI-004") {
               pushItem("boxResp", "emptyResp", rowRespuesta(1, "-", "FAC-ENT-A"));
            }
          }
          go('prueba-form');
          goStep(d.step > 4 ? 4 : d.step);
        }
      }

      function guardarPrueba() {
        showToast("✅ Prueba guardada como Borrador.");
        setTimeout(() => go('pruebas'), 300);
      }

      function renderPreviewPortada() {
        const plantilla = document.getElementById("selectPlantillaPortada").value;
        const titulo = document.getElementById("portadaTitulo").value || "TÍTULO DE LA PORTADA";
        const instrucciones = document.getElementById("portadaInstrucciones").value || "Instrucciones de la prueba irán aquí...";
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
        const estiloTexto = "font-size: 0.95rem; line-height: 1.5; white-space: pre-wrap;";
        
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
              card.dataset.nombre +
              " " +
              card.dataset.tipo +
              " " +
              card.dataset.codigo
            ).toLowerCase();
            card.style.display = txt.includes(q) ? "" : "none";
          });
      }

      function filtrarPantalla(id, value) {
        const q = value.trim().toLowerCase();
        document.querySelectorAll("#" + id + " .card-item").forEach(card => {
          const txt = card.textContent.toLowerCase();
          card.style.display = txt.includes(q) ? "" : "none";
        });
      }

      function filtrarPillContainer(id, value) {
        const q = value.trim().toLowerCase();
        document.querySelectorAll("#" + id + " .item-row").forEach(card => {
          const txt = card.textContent.toLowerCase();
          card.style.display = txt.includes(q) ? "" : "none";
        });
      }
      function filtrarPreguntas() {
        const q = document.getElementById("buscarPregunta").value.trim().toLowerCase();
        const tipoSel = document.getElementById("filtroTipoPregunta").value;
        document.querySelectorAll("#boxPreg .item-row").forEach(row => {
          const txt = row.querySelector(".desc") ? row.querySelector(".desc").textContent.toLowerCase() : "";
          const rowTipo = row.getAttribute('data-tipo') || "";
          const matchText = txt.includes(q);
          const matchTipo = (tipoSel === 'todos') || (rowTipo === tipoSel);
          row.style.display = (matchText && matchTipo) ? "" : "none";
        });
      }

      let draggedPregItem = null;
      function dragPregRow(e) { draggedPregItem = e.target.closest('.item-row'); e.dataTransfer.effectAllowed = 'move'; setTimeout(() => { if(draggedPregItem) draggedPregItem.style.opacity = '0.5'; }, 0); }
      function dragOverPregRow(e) { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; const overItem = e.target.closest('.item-row'); if (overItem && overItem !== draggedPregItem) { const list = overItem.parentNode; const items = [...list.querySelectorAll('.item-row')]; if (items.indexOf(draggedPregItem) < items.indexOf(overItem)) overItem.after(draggedPregItem); else overItem.before(draggedPregItem); } }
      function dropPregRow(e) { e.stopPropagation(); return false; }
      function dragEndPregRow(e) { if (draggedPregItem) draggedPregItem.style.opacity = '1'; draggedPregItem = null; const items = document.querySelectorAll('#boxPreg .item-row'); items.forEach((item, index) => { const badge = item.querySelector('.badge.bg-primary'); if(badge) badge.textContent = `P${index + 1}`; }); }

            function duplicarPregunta(btn) {
         const row = btn.closest('.item-row');
         const clone = row.cloneNode(true);
         clone.classList.remove('dragging');
         clone.style.opacity = '1';
         row.after(clone);
         dragEndPregRow(); // to renumber
      }

      function rowPregunta(n, txt, tipo = 'abierta') {
        const iconInfo = tipo === 'abierta' ? 'fas fa-align-left text-warning' : (tipo === 'cerrada' ? 'fas fa-check-circle text-primary' : 'fas fa-question text-muted');
        return `<li class="item-row p-3 mb-2 border rounded shadow-sm d-flex justify-content-between align-items-center bg-white" data-tipo="${tipo}" draggable="true" ondragstart="dragPregRow(event)" ondragover="dragOverPregRow(event)" ondrop="dropPregRow(event)" ondragend="dragEndPregRow(event)">
          <div class="inf d-flex align-items-center gap-3">
            <i class="fas fa-grip-lines text-muted" style="cursor: grab;" title="Arrastrar para ordenar"></i>
            <div>
              <span class="badge bg-primary mb-1">P${n}</span>
              <span class="badge bg-light text-dark border ms-1"><i class="${iconInfo} me-1"></i>${tipo.charAt(0).toUpperCase() + tipo.slice(1)}</span>
              <h6 class="mb-0 fw-bold desc mt-1">${txt}</h6>
            </div>
          </div>
          <div class="d-flex flex-column gap-1">
            <button class="btn btn-sm btn-light border" title="Editar"><i class="fas fa-edit text-muted"></i></button>
            <button class="btn btn-sm btn-light border text-primary" title="Duplicar" onclick="duplicarPregunta(this)"><i class="fas fa-copy"></i></button>
            <button class="btn btn-sm btn-light border text-danger" title="Eliminar" onclick="this.closest('.item-row').remove()"><i class="fas fa-trash"></i></button>
          </div>
        </li>`;
      }

      function renderizarControlesPregunta() {
        const tipo = document.getElementById('mpTipoPreg_Master').value;
        const c = document.getElementById('mpContenedorPregunta');
        
        if(!tipo) { c.style.display = 'none'; return; }
        c.style.display = 'block';

        let html = '';
        if (tipo === 'abierta') {
          html = `
            <div class="p-3 mb-0 border rounded shadow-sm bg-white border-top border-4" style="border-top-color: #f59e0b !important;">
              <h6 class="fw-bold mb-3"><i class="fas fa-align-left me-2 text-warning"></i>Configuración - Plantilla de Resultados</h6>
              
              <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label text-muted small fw-bold mb-1">Tipo de Vista</label>
                    <select class="form-select" id="mp_A_tipoVista">
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
                  
                  <div class="col-md-12" id="mp_A_boxPrecarga" style="display:none;">
                     <div class="p-3 bg-light rounded border border-secondary border-opacity-25" id="mp_A_precargaFields"></div>
                  </div>

                  
                  <div class="col-md-4 mt-2">
                    <label class="form-label text-muted small fw-bold mb-1">Tipo de Viñeta</label>
                    <select class="form-select form-select-sm" id="mp_vineta">
                      <option value="num">Números (1, 2, 3)</option>
                      <option value="min">Letras Minúsculas (a, b, c)</option>
                      <option value="may" selected>Letras Mayúsculas (A, B, C)</option>
                    </select>
                  </div>

<div class="col-12 mt-4" style="display: none;">
                     <div class="d-flex justify-content-between align-items-center mb-2">
                       <h6 class="fw-bold text-muted m-0"><i class="fas fa-list mt-1 me-1"></i> Creador de Alternativas / Claves</h6>
                     </div>
                     <div class="form-check form-switch mt-1">
                        <input class="form-check-input" type="checkbox" checked onchange="const b = this.closest('.col-12'); b.querySelectorAll('.mpc-pts-box').forEach(el=> el.style.display = this.checked ? 'block' : 'none');">
                        <label class="form-check-label small fw-bold text-muted">Habilitar puntajes personalizados</label>
                     </div>
                     <div id="mp_A_alternativas_box" class="d-flex flex-column gap-2 mb-3"></div>
                     <button class="btn btn-outline-warning text-dark btn-sm w-100 border-dashed fw-bold py-2" onclick="addMpaAlternativa()">
                       <i class="fas fa-plus me-1"></i> Añadir Nueva Alternativa
                     </button>
                  </div>
              </div>
            </div>
          `;
        } else if (tipo === 'cerrada') {
          html = `
            <div class="p-3 mb-0 border rounded shadow-sm bg-white border-top border-4" style="border-top-color: #3b82f6 !important;">
              <h6 class="fw-bold mb-3"><i class="fas fa-check-circle me-2 text-primary"></i>Configuración - Pregunta Cerrada</h6>
              <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label text-muted small fw-bold mb-1">Tipo de Vista</label>
                    <select class="form-select" id="mp_C_tipoVista">
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

                  <div class="col-md-4">
                    <label class="form-label text-muted small fw-bold mb-1">Nº Columnas</label>
                    <input type="number" class="form-control" id="mp_C_numCol" value="1" min="1" max="6">
                  </div>
                  
                  
                  <div class="col-md-4 mt-2">
                    <label class="form-label text-muted small fw-bold mb-1">Tipo de Viñeta</label>
                    <select class="form-select form-select-sm" id="mp_vineta">
                      <option value="num">Números (1, 2, 3)</option>
                      <option value="min">Letras Minúsculas (a, b, c)</option>
                      <option value="may" selected>Letras Mayúsculas (A, B, C)</option>
                    </select>
                  </div>

<div class="col-12 mt-4">
                     <div class="d-flex justify-content-between align-items-center mb-2">
                       <h6 class="fw-bold text-muted m-0"><i class="fas fa-list mt-1 me-1"></i> Creador de Alternativas</h6>
                     </div>
                     <div class="form-check form-switch mt-1">
                        <input class="form-check-input" type="checkbox" checked onchange="const b = this.closest('.col-12'); b.querySelectorAll('.mpc-pts-box').forEach(el=> el.style.display = this.checked ? 'block' : 'none');">
                        <label class="form-check-label small fw-bold text-muted">Habilitar puntajes personalizados</label>
                     </div>
                     <div id="mp_C_alternativas_box" class="d-flex flex-column gap-2 mb-3"></div>
                     <button class="btn btn-outline-primary btn-sm w-100 border-dashed fw-bold py-2" onclick="addMpcAlternativa()">
                       <i class="fas fa-plus me-1"></i> Añadir Nueva Alternativa
                     </button>
                  </div>
              </div>
            </div>
          `;
        } else {
          html = `<div class="alert alert-secondary mb-0"><i class="fas fa-info-circle me-2"></i>Funcionalidad no implementada para '${tipo}' actualmente. Elige Abierta o Cerrada.</div>`;
        }
        
        c.innerHTML = html;
        
        if(tipo === 'abierta') {
          ctrlAbierta();
        }
        if(tipo === 'cerrada') {
          ctrlCerrada(); 
          const bC = document.getElementById('mp_C_alternativas_box'); bC.innerHTML = ''; if(!bC.dataset.sortInit) { Sortable.create(bC, {handle: '.handle', animation: 150}); bC.dataset.sortInit = '1'; }
          addMpcAlternativa(); 
        }
      }

      function ctrlAbierta() {
        const td = document.getElementById('mp_A_tipoDato').value;
        document.getElementById('mp_A_boxText').style.display = (td === 'texto' || td === 'texto_imagen') ? 'block' : 'none';
        document.getElementById('mp_A_boxImage').style.display = (td === 'imagen' || td === 'texto_imagen') ? 'block' : 'none';
        
        const tr = document.getElementById('mp_A_tipoResp').value;
        const isMulti = (tr === 'multiple');
        document.getElementById('mp_A_boxNumResp').style.display = isMulti ? 'block' : 'none';
        document.getElementById('mp_A_boxNumRespValidas').style.display = isMulti ? 'block' : 'none';

        const rdSi = document.getElementById('mp_A_precargaSi');
        const boxPrecarga = document.getElementById('mp_A_boxPrecarga');
        const countFields = isMulti ? (parseInt(document.getElementById('mp_A_numResp').value) || 1) : 1;
        
        if (rdSi && rdSi.checked) {
          boxPrecarga.style.display = 'block';
          let inputsHtml = '<label class="form-label small text-primary fw-bold mb-2">Configure los valores por defecto a inyectar:</label>';
          for(let i=1; i<=countFields; i++) {
             inputsHtml += `<input type="text" class="form-control form-control-sm mb-2" placeholder="Valor por defecto para el cajón ${i}...">`;
          }
          document.getElementById('mp_A_precargaFields').innerHTML = inputsHtml;
        } else {
          boxPrecarga.style.display = 'none';
        }
      }

      function ctrlCerrada() {
        const td = document.getElementById('mp_C_tipoDato').value;
        document.getElementById('mp_C_boxText').style.display = (td === 'texto' || td === 'texto_imagen') ? 'block' : 'none';
        document.getElementById('mp_C_boxImage').style.display = (td === 'imagen' || td === 'texto_imagen') ? 'block' : 'none';
        const tr = document.getElementById('mp_C_tipoResp').value;
        document.getElementById('mp_C_boxNumResp').style.display = (tr === 'multiple') ? 'block' : 'none';
      }

      function addMpcAlternativa() {
         const box = document.getElementById('mp_C_alternativas_box');
         const div = document.createElement('div');
                  div.className = "d-flex gap-2 align-items-center p-2 border rounded bg-white shadow-sm item-alt";
         div.innerHTML = `
            <i class="fas fa-grip-vertical text-black-50 handle" style="cursor: grab;"></i>
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
            <div style="width: 60px;" class="mpc-pts-box"><input type="number" class="form-control form-control-sm border-primary text-center" placeholder="Pts" value="0" min="0"></div>
            <button class="btn btn-sm btn-outline-primary border-0" title="Duplicar" onclick="duplicarAlternativa(this)"><i class="fas fa-copy"></i></button>
            <button class="btn btn-sm btn-outline-danger border-0" title="Eliminar" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
         `;
         box.appendChild(div);
      }

      function addMpaAlternativa() {
         const box = document.getElementById('mp_A_alternativas_box');
         const div = document.createElement('div');
                  div.className = "d-flex gap-2 align-items-center p-2 border rounded bg-white shadow-sm item-alt";
         div.innerHTML = `
            <i class="fas fa-grip-vertical text-black-50 handle" style="cursor: grab;"></i>
            <div style="width: 80px;">
              <input type="text" class="form-control form-control-sm border-warning fw-bold text-center" placeholder="A, B...">
            </div>
            <div style="width: 100px;">
              <select class="form-select form-select-sm mpc-tipoalt bg-light text-muted" onchange="swMpcAlt(this)">
                 <option value="texto">Texto</option>
                 <option value="imagen">Imagen</option>
              </select>
            </div>
            <div class="flex-grow-1 mpc-dynamic-box">
               <input type="text" class="form-control form-control-sm border-warning" placeholder="Descripción de la alternativa...">
            </div>
            <div style="width: 60px;" class="mpc-pts-box"><input type="number" class="form-control form-control-sm border-warning text-center" placeholder="Pts" value="0" min="0"></div>
            <button class="btn btn-sm btn-outline-primary border-0" title="Duplicar" onclick="duplicarAlternativa(this)"><i class="fas fa-copy"></i></button>
            <button class="btn btn-sm btn-outline-danger border-0" title="Eliminar" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
         `;
         box.appendChild(div);
      }

            function duplicarAlternativa(btn) {
         const row = btn.closest('.d-flex');
         const clone = row.cloneNode(true);
         // Transfer select states
         const selOriginal = row.querySelector('select');
         const selClone = clone.querySelector('select');
         if(selOriginal && selClone) { selClone.value = selOriginal.value; }
         row.after(clone);
      }

      function swMpcAlt(sel) {
         const c = sel.parentElement.nextElementSibling;
         if(sel.value === 'texto') {
            c.innerHTML = '<input type="text" class="form-control form-control-sm border-primary" placeholder="Descripción de la alternativa...">';
         } else {
            c.innerHTML = '<div class="d-flex"><input type="file" class="form-control form-control-sm border-secondary p-0 border-end-0" accept="image/*" style="border-radius: 4px 0 0 4px;"><select class="form-select form-select-sm px-1 border-secondary border-start-0 text-muted" style="width:90px; border-radius: 0 4px 4px 0"><option value="small">Pqñ</option><option value="medium" selected>Med</option><option value="large">Grd</option></select></div>';
         }
      }

      function previsualizarPregunta() {
         const tipo = document.getElementById('mpTipoPreg_Master').value;
         if(!tipo) { showToast('Seleccione un tipo primero.'); return; }
         showToast('Modal de Pre-visualización generado correctamente.');
      }

      function guardarNuevaPregunta() {
         const tipo = document.getElementById('mpTipoPreg_Master').value;
         if(!tipo) { alert('Selecciona el tipo de pregunta'); return; }
         
         let txt = "Nueva Pregunta " + (document.querySelectorAll("#boxPreg .item-row").length + 1);
         if(tipo === "abierta" && document.getElementById('mp_A_text')) txt = document.getElementById('mp_A_text').value || txt;
         if(tipo === "cerrada" && document.getElementById('mp_C_text')) txt = document.getElementById('mp_C_text').value || txt;

         const n = document.querySelectorAll("#boxPreg .item-row").length + 1;
         
         const div = document.createElement('div');
         div.innerHTML = rowPregunta(n, txt, tipo);
         const empty = document.getElementById("emptyPreg");
         if(empty) empty.remove();
         document.getElementById("boxPreg").appendChild(div.firstElementChild);

         showToast('✅ Pregunta generada y guardada.');
         bootstrap.Modal.getInstance(document.getElementById('modalNuevaPregunta')).hide();
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

      function addFactor() {
        const cod = document
            .getElementById("facCod")
            .value.trim()
            .toUpperCase(),
          desc = document.getElementById("facDesc").value.trim();
        if (!cod || !desc) {
          alert("Completa código y descripción.");
          return;
        }
        pushItem("boxFac", "emptyFac", rowFactor(cod, desc));
        document.getElementById("facCod").value = "";
        document.getElementById("facDesc").value = "";
      }
      function rowFactor(cod, desc) {
        return `<div class="item-row"><div class="inf"><span class="tag tag-punt fw-bold">${cod}</span><span class="fw-medium">${desc}</span></div><button class="btn btn-light rounded-circle text-danger p-0" style="width:32px;height:32px;" onclick="this.closest('.item-row').remove()"><i class="fas fa-times"></i></button></div>`;
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
    </script>

    <!-- Modal: Añadir Prestación al Orden -->
    <div class="modal fade" id="modalAddPrestOrden" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              <i class="fas fa-plus-circle me-2 text-primary"></i>Añadir
              Prestación
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div class="modal-body">
            <p
              class="text-muted mb-3"
              id="lblGrupoOrden"
              style="font-size: 0.9rem"
            ></p>

            <div class="search-wrap mb-4">
              <i class="fas fa-search"></i>
              <input
                type="text"
                placeholder="Buscar prestación por código o descripción..."
                class="form-control w-100"
                style="border-radius: 100px"
                oninput="filtrarPillContainer('modalAddPrestOrden', this.value)"
              />
            </div>

            <div
              class="d-flex flex-column gap-2"
              style="max-height: 300px; overflow-y: auto"
            >
              <!-- Item Prestación 1 -->
              <div class="item-row p-3">
                <div class="inf">
                  <span class="tag tag-tipo fw-bold"
                    ><i class="fas fa-heart-pulse me-1 text-primary"></i
                    >PR-PSI-010</span
                  >
                  <span class="fw-medium"
                    >Evaluación Psicológica Gerencial</span
                  >
                </div>
                <button
                  class="btn btn-sm btn-prim"
                  style="padding: 4px 12px; font-size: 0.8rem"
                  data-bs-dismiss="modal"
                  onclick="
                    showToast('Prestación añadida al orden correctamente.')
                  "
                >
                  Añadir
                </button>
              </div>

              <!-- Item Prestación 2 -->
              <div class="item-row p-3">
                <div class="inf">
                  <span class="tag tag-tipo fw-bold"
                    ><i class="fas fa-helmet-safety me-1 text-danger"></i
                    >PR-ALT-008</span
                  >
                  <span class="fw-medium">Test de Altura Nivel 2</span>
                </div>
                <button
                  class="btn btn-sm btn-prim"
                  style="padding: 4px 12px; font-size: 0.8rem"
                  data-bs-dismiss="modal"
                  onclick="
                    showToast('Prestación añadida al orden correctamente.')
                  "
                >
                  Añadir
                </button>
              </div>

              <!-- Item Prestación 3 -->
              <div class="item-row p-3">
                <div class="inf">
                  <span class="tag tag-tipo fw-bold"
                    ><i class="fas fa-brain me-1" style="color: #4338ca"></i
                    >PR-PSI-012</span
                  >
                  <span class="fw-medium">Evaluación de Fatiga Laboral</span>
                </div>
                <button
                  class="btn btn-sm btn-prim"
                  style="padding: 4px 12px; font-size: 0.8rem"
                  data-bs-dismiss="modal"
                  onclick="
                    showToast('Prestación añadida al orden correctamente.')
                  "
                >
                  Añadir
                </button>
              </div>
            </div>
            <small class="text-muted mt-3 d-block"
              ><i class="fas fa-info-circle me-1"></i>Solo se muestran
              prestaciones en estado Activo.</small
            >
          </div>
          <div class="modal-footer">
            <button
              class="btn btn-light rounded-pill px-4 fw-bold"
              data-bs-dismiss="modal"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal: Orden de Pruebas -->
    <div class="modal fade" id="modalOrdenPruebas" tabindex="-1">
      <div
        class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
      >
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="tOrdenPruebas">
              <i class="fas fa-sort me-2 text-primary"></i>Orden de Pruebas
            </h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div class="modal-body">
            <div
              id="selectorGrupoOrden"
              class="soft-panel mb-4"
              style="display: none"
            >
              <p class="fw-bold mb-2">
                <i class="fas fa-users me-2 text-primary"></i>Esta prestación
                depende de Grupo Ocupacional
              </p>
              <label class="form-label"
                >Selecciona el Grupo Ocupacional para ver sus pruebas</label
              >
              <select
                class="form-select"
                id="selectGrupoOrden"
                onchange="cargarPruebasOrden()"
              >
                <option value="">Seleccionar grupo...</option>
                <option value="GO-001">Administrativos</option>
                <option value="GO-002">Operarios</option>
                <option value="GO-003">Operativos</option>
              </select>
            </div>
            <div id="listaPruebasOrden">
              <div class="card-item">
                <div
                  class="icon-box"
                  style="background: #e0f2fe; color: var(--primary)"
                >
                  <i class="fas fa-file-medical-alt"></i>
                </div>
                <div class="flex-grow-1">
                  <div class="d-flex align-items-center gap-2">
                    <strong style="color: var(--primary)">PSI-ANS-001</strong
                    ><span class="muted-dot">•</span>
                    <span class="fw-semibold">Escala de Ansiedad de Beck</span>
                  </div>
                </div>
                <div class="d-flex flex-column gap-1">
                  <button
                    class="btn-action btn-edit"
                    title="Subir"
                    onclick="moverOrden(this, 'up')"
                  >
                    <i class="fas fa-chevron-up"></i>
                  </button>
                  <button
                    class="btn-action btn-edit"
                    title="Bajar"
                    onclick="moverOrden(this, 'down')"
                  >
                    <i class="fas fa-chevron-down"></i>
                  </button>
                </div>
              </div>
              <div class="card-item">
                <div
                  class="icon-box"
                  style="background: #e0f2fe; color: var(--primary)"
                >
                  <i class="fas fa-file-medical-alt"></i>
                </div>
                <div class="flex-grow-1">
                  <div class="d-flex align-items-center gap-2">
                    <strong style="color: var(--primary)">PSI-CMP-002</strong
                    ><span class="muted-dot">•</span>
                    <span class="fw-semibold"
                      >Competencias Laborales Volcán</span
                    >
                  </div>
                </div>
                <div class="d-flex flex-column gap-1">
                  <button
                    class="btn-action btn-edit"
                    title="Subir"
                    onclick="moverOrden(this, 'up')"
                  >
                    <i class="fas fa-chevron-up"></i>
                  </button>
                  <button
                    class="btn-action btn-edit"
                    title="Bajar"
                    onclick="moverOrden(this, 'down')"
                  >
                    <i class="fas fa-chevron-down"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              class="btn btn-light rounded-pill px-4 fw-bold"
              data-bs-dismiss="modal"
            >
              Cerrar
            </button>
            <button
              class="btn-prim"
              onclick="
                confirmarGuardar('Orden de Pruebas', () => {
                  bootstrap.Modal.getInstance(
                    document.getElementById('modalOrdenPruebas'),
                  ).hide();
                  showToast('Orden guardado correctamente.');
                })
              "
            >
              <i class="fas fa-save me-2"></i>Guardar Orden
            </button>
          </div>
        </div>
      </div>
    </div>

    <script>
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
    </script>
    <!-- Modal: Confirmación -->
    <div class="modal fade" id="modalConfirm" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-sm">
        <div
          class="modal-content text-center py-4 px-3"
          style="border-radius: 24px"
        >
          <div class="mb-3">
            <div
              id="mConfirmIcon"
              class="d-inline-flex align-items-center justify-content-center rounded-circle"
              style="
                width: 64px;
                height: 64px;
                background: #e0f2fe;
                color: var(--primary);
                font-size: 1.5rem;
              "
            >
              <i class="fas fa-question"></i>
            </div>
          </div>
          <h5 class="modal-title mb-2 fw-bold" id="mConfirmTitle">
            ¿Estás seguro?
          </h5>
          <p
            class="text-muted mb-4 px-2"
            id="mConfirmMsg"
            style="font-size: 0.9rem"
          >
            Esta acción no se puede deshacer.
          </p>
          <div class="d-flex justify-content-center gap-2">
            <button
              class="btn btn-light rounded-pill px-4 fw-bold"
              data-bs-dismiss="modal"
            >
              Cancelar
            </button>
            <button class="btn-prim px-4" id="mConfirmBtn">Confirmar</button>
          </div>
        </div>
      </div>
    </div>

    <script>
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
          accionOnConfirm,
          "guardar",
          "fa-save",
        );
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
        document.getElementById('sidebar').classList.toggle('collapsed');
        document.getElementById('main-content').classList.toggle('expanded');
      }
    </script>

    <div
      class="toast-container position-fixed top-0 end-0 p-3"
      style="z-index: 2000"
    >
      <div
        id="statusToast"
        class="toast align-items-center text-white bg-success border-0 pr-toast"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div class="d-flex p-1">
          <div
            class="toast-body d-flex align-items-center fw-medium"
            style="font-size: 0.95rem; line-height: 1.2"
          >
            <i class="fas fa-check-circle fa-lg me-3 text-white"></i>
            <span id="toastMsg">Registro guardado correctamente.</span>
          </div>
          <button
            type="button"
            class="btn-close btn-close-white me-2 m-auto"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
      </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/sortablejs@latest/Sortable.min.js"></script>
</body>
</html>
function cargarPlantillaRespuestasDemo() {
    const lista = document.getElementById('listaPlantillaResp');
    const empty = document.getElementById('emptyPlantilla');
    if (empty) empty.remove();
    
    lista.innerHTML = `
      <div class="item-row mb-2 p-3 border rounded shadow-sm bg-white d-flex align-items-center justify-content-between">
          <div class="d-flex flex-column">
              <strong class="text-primary" style="font-size: 0.9rem;">P1 - ¿Qué número continúa de la serie?</strong>
              <span class="text-muted" style="font-size: 0.75rem;">Abierta (2 respuestas esperadas)</span>
          </div>
          <div class="d-flex align-items-center gap-2">
              <label class="small text-muted mb-0">Ptos. por acierto:</label>
              <input type="number" class="form-control form-control-sm text-center" value="0.5" step="0.1" style="width: 70px;">
          </div>
      </div>
      <div class="item-row p-3 border rounded shadow-sm bg-white d-flex align-items-center justify-content-between">
          <div class="d-flex flex-column">
              <strong class="text-primary" style="font-size: 0.9rem;">P2 - Nivel de ansiedad frecuente</strong>
              <span class="text-muted" style="font-size: 0.75rem;">Cerrada (Likert 5)</span>
          </div>
          <div class="d-flex align-items-center gap-2">
              <label class="small text-muted mb-0">Plantilla:</label>
              <select class="form-select form-select-sm" style="width: 150px;">
                  <option>Likert Estándar (1-5)</option>
                  <option>Likert Invertido (5-1)</option>
                  <option>Personalizado</option>
              </select>
          </div>
      </div>
    `;
    showToast('Preguntas sincronizadas con la plantilla.');
}
