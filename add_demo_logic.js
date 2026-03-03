const fs = require("fs");
let html = fs.readFileSync("index.html", "utf8");

const setupDemoJs = `
      // ---- LOGICA DE DEMOSTRACION UX ----
      document.addEventListener("DOMContentLoaded", () => {
         // 1. Buscadores Genéricos (Filtrados por texto)
         // Mapeamos los inputs de búsqueda sin ID a la pantalla en donde están
         const screens = document.querySelectorAll('.screen');
         screens.forEach(screen => {
             const inputs = screen.querySelectorAll('input[type="text"], input[type="search"]');
             const selects = screen.querySelectorAll('select');
             const listContainer = screen.querySelector('.card-item')?.parentElement;
             
             if(!listContainer) return;
             
             // Encontramos el input de búsqueda principal (el que tenga "Buscar" en el placeholder)
             const searchInput = Array.from(inputs).find(i => (i.placeholder || '').toLowerCase().includes('buscar'));
             
             // Encontramos los filtros select (ej: Estado, Tipo)
             const filterSelects = Array.from(selects);

             const aplicarFiltros = () => {
                 const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
                 const cards = listContainer.querySelectorAll('.card-item'); // u otro selector de items
                 
                 cards.forEach(card => {
                     let matchSearch = true;
                     let matchSelects = true;
                     
                     if (query) {
                         const cardText = card.textContent.toLowerCase();
                         matchSearch = cardText.includes(query);
                     }
                     
                     filterSelects.forEach(sel => {
                         const val = sel.value.toLowerCase().trim();
                         if(val && val !== 'todos' && val !== '0' && val !== '') {
                             // Búsqueda simple: el texto de la opción seleccionada debe estar en la tarjeta
                             const optText = sel.options[sel.selectedIndex].text.toLowerCase();
                             const dataStatus = card.dataset.estado || '';
                             const dataType = card.dataset.tipo || '';
                             const cardContent = card.textContent.toLowerCase();
                             if (!cardContent.includes(optText) && !cardContent.includes(val) && !dataStatus.includes(val) && !dataType.includes(val)) {
                                 matchSelects = false;
                             }
                         }
                     });
                     
                     card.style.display = (matchSearch && matchSelects) ? '' : 'none';
                 });
             };

             if (searchInput) searchInput.addEventListener('input', aplicarFiltros);
             filterSelects.forEach(sel => sel.addEventListener('change', aplicarFiltros));
         });
         
         // 2. Paginadores Fake
         const paginations = document.querySelectorAll('.pagination');
         paginations.forEach(ul => {
             const links = ul.querySelectorAll('.page-link');
             links.forEach(link => {
                 link.addEventListener('click', (e) => {
                     e.preventDefault();
                     const li = link.parentElement;
                     if(li.classList.contains('active') || li.classList.contains('disabled')) return;
                     
                     ul.querySelectorAll('.page-item').forEach(i => i.classList.remove('active'));
                     li.classList.add('active');
                     
                     // Simular cambio de data (mezclar items)
                     const screen = ul.closest('.screen');
                     if(screen) {
                         const container = screen.querySelector('.card-item')?.parentElement;
                         if (container) {
                             const cards = Array.from(container.querySelectorAll('.card-item'));
                             cards.forEach(c => container.appendChild(c)); // shuffle simple by re-appending
                         }
                     }
                 });
             });
         });
      });
      // ------------------------------------
`;

// Insert the demo script at the end of the existing script block but before it closes
html = html.replace(
  "/* ── DB FAKE Y FUNCIONES ── */",
  "/* ── DB FAKE Y FUNCIONES ── */\n" + setupDemoJs,
);
fs.writeFileSync("index.html", html);
console.log("Demo Logic injected!");
