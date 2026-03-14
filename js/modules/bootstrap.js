/* ========================================== */
/* ACTUALIZACION: BOOTSTRAP GENERAL SEPO      */
/* ========================================== */
(function (window, document) {
  "use strict";
  function runSepoEnhancers(root) {
    if (!window.SEPO) return;
    if (window.SEPO.components.accordion) {
      window.SEPO.components.accordion.init(root || document);
    }
    if (window.SEPO.components.typeahead) {
      window.SEPO.components.typeahead.init(root || document);
    }
    if (window.SEPO.components.switch) {
      window.SEPO.components.switch.autoInit(root || document);
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!window.SEPO) return;
    window.SEPO.init();

    runSepoEnhancers(document);
  });

  document.addEventListener("shown.bs.modal", function (event) {
    runSepoEnhancers(event.target || document);
  });

  document.addEventListener("sepo:refresh", function (event) {
    runSepoEnhancers((event && event.detail && event.detail.root) || document);
  });
})(window, document);