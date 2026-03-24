/* ========================================== */
/* ACTUALIZACION: BOOTSTRAP GENERAL SEPO      */
/* ========================================== */
(function (window, document) {
  "use strict";

  const THEME_STORAGE_KEY = "sepo_visual_config_v1";
  const DEFAULT_VISUAL_CONFIG = { theme: "classic", mode: "light" };

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

  function getSavedVisualConfig() {
    try {
      const raw = window.localStorage.getItem(THEME_STORAGE_KEY);
      if (!raw) return { ...DEFAULT_VISUAL_CONFIG };
      const parsed = JSON.parse(raw);
      const theme = ["classic", "purple", "dalton"].includes(parsed.theme)
        ? parsed.theme
        : DEFAULT_VISUAL_CONFIG.theme;
      const mode = ["light", "dark"].includes(parsed.mode)
        ? parsed.mode
        : DEFAULT_VISUAL_CONFIG.mode;
      return { theme, mode };
    } catch (error) {
      return { ...DEFAULT_VISUAL_CONFIG };
    }
  }

  function saveVisualConfig(config) {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(config));
    } catch (error) {}
  }

  function syncVisualForm(config) {
    const modeInput = document.querySelector(
      'input[name="sepoColorMode"][value="' + config.mode + '"]'
    );
    const themeInput = document.querySelector(
      'input[name="sepoUiTheme"][value="' + config.theme + '"]'
    );
    if (modeInput) modeInput.checked = true;
    if (themeInput) themeInput.checked = true;

    document
      .querySelectorAll(".config-theme-card")
      .forEach((card) => card.classList.remove("active-visual-card"));
    const activeCard = document.querySelector(
      '.config-theme-card[data-theme-card="' + config.theme + '"]'
    );
    if (activeCard) activeCard.classList.add("active-visual-card");
  }

  function applyVisualConfig(config, shouldPersist) {
    const safeConfig = {
      theme: ["classic", "purple", "dalton"].includes(config && config.theme)
        ? config.theme
        : DEFAULT_VISUAL_CONFIG.theme,
      mode: ["light", "dark"].includes(config && config.mode)
        ? config.mode
        : DEFAULT_VISUAL_CONFIG.mode,
    };

    document.body.setAttribute("data-theme", safeConfig.theme);
    document.body.setAttribute("data-mode", safeConfig.mode);
    syncVisualForm(safeConfig);

    if (shouldPersist !== false) {
      saveVisualConfig(safeConfig);
    }
  }

  function bindVisualConfigEvents() {
    document.querySelectorAll('input[name="sepoColorMode"]').forEach((input) => {
      input.addEventListener("change", function () {
        const current = getSavedVisualConfig();
        applyVisualConfig({ theme: current.theme, mode: this.value }, true);
      });
    });

    document.querySelectorAll('input[name="sepoUiTheme"]').forEach((input) => {
      input.addEventListener("change", function () {
        const current = getSavedVisualConfig();
        applyVisualConfig({ theme: this.value, mode: current.mode }, true);
      });
    });
  }

  window.abrirConfiguracionVisual = function abrirConfiguracionVisual() {
    const modalEl = document.getElementById("modalConfiguracionVisual");
    if (!modalEl || !window.bootstrap) return;
    syncVisualForm(getSavedVisualConfig());
    const modal = window.bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
  };

  window.restablecerConfiguracionVisual = function restablecerConfiguracionVisual() {
    applyVisualConfig({ ...DEFAULT_VISUAL_CONFIG }, true);
    if (typeof window.showToast === "function") {
      window.showToast("Configuración visual restablecida.");
    }
  };

  document.addEventListener("DOMContentLoaded", function () {
    applyVisualConfig(getSavedVisualConfig(), false);
    bindVisualConfigEvents();

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
