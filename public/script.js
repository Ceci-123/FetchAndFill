document.addEventListener("DOMContentLoaded", () => {
  const fabButton = document.getElementById("btn-add-item");
  const btnClearAll = document.getElementById("btn-clear-all");
  const listContainer = document.querySelector(".list-container");
  const counterSpan = document.querySelector(".counter");

  // Elementos del modal de agregar
  const modalOverlay = document.getElementById("add-modal");
  const inputItem = document.getElementById("new-item-input");
  const btnAdd = document.getElementById("btn-add");
  const btnCancel = document.getElementById("btn-cancel");

  // Elementos del modal de confirmar borrado
  const confirmModal = document.getElementById("confirm-modal");
  const btnConfirmClear = document.getElementById("btn-confirm-clear");
  const btnCancelClear = document.getElementById("btn-cancel-clear");

  // Función para actualizar el contador en el DOM
  const updateCounter = () => {
    const totalItems = document.querySelectorAll(".list-item").length;
    const completedItems = document.querySelectorAll(
      ".list-item.completed",
    ).length;
    counterSpan.textContent = `${completedItems}/${totalItems} comprados`;
  };

  // Función para dibujar un ítem en el DOM
  const renderItem = (item) => {
    const newItem = document.createElement("div");
    newItem.className = `list-item ${item.completed ? "completed" : ""}`;
    newItem.dataset.id = item.id;

    newItem.innerHTML = `
            <span class="item-name">${item.name}</span>
            <div class="checkbox"></div>
        `;

    listContainer.appendChild(newItem);

    newItem.style.animation = "none";
    newItem.offsetHeight; /* trigger reflow */
    newItem.style.animation = null;
  };

  // Cargar datos desde la base de datos
  const loadData = async () => {
    try {
      console.log("Cargando datos inicio");
      const response = await fetch("/api/items");
      if (response.ok) {
        const items = await response.json();
        listContainer.innerHTML = "";
        items.forEach(renderItem);
        updateCounter();
        console.log("Cargando datos ya cargo");
      }
    } catch (error) {
      console.error("Error cargando los datos:", error);
    }
  };

  // Inicializar cargando los datos
  loadData();

  // Añadir funcionalidad para marcar/desmarcar elementos de la lista
  listContainer.addEventListener("click", async (e) => {
    const listItem = e.target.closest(".list-item");
    if (listItem) {
      const id = listItem.dataset.id;
      const isCompleted = !listItem.classList.contains("completed");

      // Actualización optimista en el UI
      listItem.classList.toggle("completed");
      updateCounter();

      try {
        // Actualizar en el servidor
        await fetch(`/api/items/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ completed: isCompleted }),
        });
      } catch (error) {
        console.error("Error actualizando el ítem:", error);
        // Revertir en caso de error
        listItem.classList.toggle("completed");
        updateCounter();
        alert("Hubo un error al actualizar el ítem.");
      }
    }
  });

  // --- Lógica del Modal de Agregar ---

  fabButton.addEventListener("click", () => {
    modalOverlay.classList.add("active");
    inputItem.value = "";
    setTimeout(() => inputItem.focus(), 100);
  });

  const closeModal = () => {
    modalOverlay.classList.remove("active");
  };

  btnCancel.addEventListener("click", closeModal);

  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  // Añadir ítem (Frontend -> Backend)
  const addItem = async () => {
    const itemName = inputItem.value;

    if (itemName && itemName.trim() !== "") {
      try {
        const response = await fetch("/api/items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: itemName.trim() }),
        });
        console.log("Intentando añadir ítem:", itemName.trim());
        if (response.ok) {
          const savedItem = await response.json();
          renderItem(savedItem);
          updateCounter();
          closeModal();
          console.log("todo salio bien");
        }
      } catch (error) {
        console.error("Error añadiendo el ítem:", error);
        alert("Hubo un error al añadir el ítem.");
      }
    }
  };

  btnAdd.addEventListener("click", addItem);

  inputItem.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addItem();
  });

  // --- Lógica del Modal de Borrar Lista ---

  btnClearAll.addEventListener("click", () => {
    confirmModal.classList.add("active");
  });

  const closeConfirmModal = () => {
    confirmModal.classList.remove("active");
  };

  btnCancelClear.addEventListener("click", closeConfirmModal);

  confirmModal.addEventListener("click", (e) => {
    if (e.target === confirmModal) closeConfirmModal();
  });

  // Borrar toda la lista (Frontend -> Backend)
  btnConfirmClear.addEventListener("click", async () => {
    try {
      const response = await fetch("/api/items", { method: "DELETE" });
      if (response.ok) {
        listContainer.innerHTML = "";
        updateCounter();
        closeConfirmModal();
      }
    } catch (error) {
      console.error("Error borrando la lista:", error);
      alert("Hubo un error al borrar la lista.");
    }
  });
});
