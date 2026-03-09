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
    // Feedback visual de resaltado
    card.classList.add("highlight");
    setTimeout(() => card.classList.remove("highlight"), 1000);
  }
  // Actualizar todos los inputs del mismo contenedor
  container
    .querySelectorAll('.card-item .pos-input, .card-item input[type="number"]')
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
