// ---- LOGICA DE DEMOSTRACION UX ----
      document.addEventListener("DOMContentLoaded", () => {
         // --- Funcionalidad DEMO de Búsqueda y Filtros ---
         const screens = document.querySelectorAll('.screen');
         screens.forEach(screen => {
             // Todos los inputs tipo buscador y combos
             const textInputs = screen.querySelectorAll('input[type="text"], input[type="search"]');
             const selects = screen.querySelectorAll('select');
             
             // Buscar el contenedor padre que agrupa la lista
             const firstCard = screen.querySelector('.card-item');
             if(!firstCard) return;

             const listContainer = firstCard.parentElement;
             
             // Identificamos al "Buscador Principal" que solemos usar en la cabecera
             const searchInput = Array.from(textInputs).find(i => (i.placeholder || '').toLowerCase().includes('buscar') || (i.title || '').toLowerCase().includes('buscar'));
             
             const filterSelects = Array.from(selects);

             const aplicarFiltros = () => {
                 const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
                 const cards = listContainer.querySelectorAll('.card-item');
                 
                 cards.forEach(card => {
                     let matchSearch = true;
                     let matchSelects = true;
                     const cardContent = card.innerText.toLowerCase();
                     
                     if (query) {
                         matchSearch = cardContent.includes(query);
                     }
                     
                     filterSelects.forEach(sel => {
                         const val = sel.value.toLowerCase().trim();
                         // Ignoramos selecciones vacías o default
                         if(val && val !== 'todos' && val !== '0' && val !== '' && !val.includes('seleccionar')) {
                             const dataStatus = (card.dataset.estado || '').toLowerCase();
                             const dataType = (card.dataset.tipo || '').toLowerCase();
                             const optText = sel.options[sel.selectedIndex].text.toLowerCase();
                             
                             // Verificamos si el valor o el texto del filtro está en la info del card, en estado o en su tipo.
                             if (!cardContent.includes(optText) && !cardContent.includes(val) && !dataStatus.includes(val) && !dataType.includes(val)) {
                                 matchSelects = false;
                             }
                         }
                     });
                     
                     card.style.display = (matchSearch && matchSelects) ? '' : 'none';
                 });
             };

             if (searchInput) {
                 searchInput.addEventListener('input', aplicarFiltros);
                 // Quitamos event handlers viejos como oninput en html si chocan (aunque JS manda y convive en este caso de DEMO)
             }
             filterSelects.forEach(sel => sel.addEventListener('change', aplicarFiltros));
         });
         
         // --- Paginación Fake Dinámica ---
         const paginations = document.querySelectorAll('.pagination');
         paginations.forEach(ul => {
             const links = ul.querySelectorAll('.page-link');
             links.forEach(link => {
                 link.addEventListener('click', (e) => {
                     e.preventDefault();
                     const li = link.parentElement;
                     if(li.classList.contains('active') || li.classList.contains('disabled')) return;
                     
                     // Interfaz (pintamos el cuadrito azul)
                     ul.querySelectorAll('.page-item').forEach(i => i.classList.remove('active'));
                     li.classList.add('active');
                     
                     // Lógica visual simulando cambio de página
                     const screen = ul.closest('.screen');
                     if(screen) {
                         // Localizamos contenedor global de cards
                         const firstC = screen.querySelector('.card-item');
                         if (firstC) {
                             const container = firstC.parentElement;
                             const cards = Array.from(container.querySelectorAll('.card-item'));
                             
                             // Animamos opacidad simulando carga SPA
                             container.style.opacity = '0';
                             container.style.transition = 'opacity 0.2s ease-in-out';
                             
                             setTimeout(() => {
                                 // Hacemos el popular "Shuffle Array" (cambiar el orden de las cartas para que parezca data nueva)
                                 for (let i = cards.length - 1; i > 0; i--) {
                                     const j = Math.floor(Math.random() * (i + 1));
                                     [cards[i], cards[j]] = [cards[j], cards[i]];
                                 }
                                 cards.forEach(c => container.appendChild(c)); // Mueve en el DOM
                                 
                                 // Encontramos inputs de esta pantalla y les aplicamos blur/limpieza si aplica, para una demo queda igual
                                 container.style.opacity = '1';
                             }, 200);
                         }
                     }
                 });
             });
         });
      });
      // ------------------------------------
</script>
</body>
</html>

