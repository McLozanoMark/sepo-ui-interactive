
      // Sync footer with sidebar collapse
      document.addEventListener('DOMContentLoaded', function() {
        const sidebar = document.getElementById('sidebar');
        const footer = document.getElementById('appFooter');
        const obs = new MutationObserver(() => {
          if(footer && sidebar)
            footer.style.left = sidebar.classList.contains('collapsed') ? '80px' : '260px';
        });
        if(sidebar) obs.observe(sidebar, { attributes: true, attributeFilter: ['class'] });
      });
    