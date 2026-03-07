
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
    