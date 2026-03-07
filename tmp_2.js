
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
        // initDragList("lista-sepo");
        // initDragList("lista-complementario");
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
    