document.addEventListener('DOMContentLoaded', () => {
    const fabButton = document.getElementById('btn-add-item');
    const btnClearAll = document.getElementById('btn-clear-all');
    const listContainer = document.querySelector('.list-container');
    const counterSpan = document.querySelector('.counter');
    
    // Elementos del modal de agregar
    const modalOverlay = document.getElementById('add-modal');
    const inputItem = document.getElementById('new-item-input');
    const btnAdd = document.getElementById('btn-add');
    const btnCancel = document.getElementById('btn-cancel');

    // Elementos del modal de confirmar borrado
    const confirmModal = document.getElementById('confirm-modal');
    const btnConfirmClear = document.getElementById('btn-confirm-clear');
    const btnCancelClear = document.getElementById('btn-cancel-clear');

    // Función para actualizar el contador
    const updateCounter = () => {
        const totalItems = document.querySelectorAll('.list-item').length;
        const completedItems = document.querySelectorAll('.list-item.completed').length;
        counterSpan.textContent = `${completedItems}/${totalItems} comprados`;
    };

    // Añadir funcionalidad para marcar/desmarcar elementos de la lista
    listContainer.addEventListener('click', (e) => {
        const listItem = e.target.closest('.list-item');
        if (listItem) {
            listItem.classList.toggle('completed');
            updateCounter();
        }
    });

    // Abrir modal
    fabButton.addEventListener('click', () => {
        modalOverlay.classList.add('active');
        inputItem.value = ''; // Limpiar input
        setTimeout(() => inputItem.focus(), 100); // Dar focus al input al abrir
    });

    // Cerrar modal
    const closeModal = () => {
        modalOverlay.classList.remove('active');
    };

    btnCancel.addEventListener('click', closeModal);

    // Cerrar al hacer clic fuera del modal
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // Añadir ítem
    const addItem = () => {
        const itemName = inputItem.value;
        
        if (itemName && itemName.trim() !== '') {
            const newItem = document.createElement('div');
            newItem.className = 'list-item';
            
            newItem.innerHTML = `
                <span class="item-name">${itemName.trim()}</span>
                <div class="checkbox"></div>
            `;
            
            listContainer.appendChild(newItem);
            
            newItem.style.animation = 'none';
            newItem.offsetHeight; /* trigger reflow */
            newItem.style.animation = null;
            
            updateCounter();
            closeModal();
        }
    };

    btnAdd.addEventListener('click', addItem);

    // Permitir añadir con tecla Enter
    inputItem.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addItem();
        }
    });

    // Abrir modal de confirmar borrado
    btnClearAll.addEventListener('click', () => {
        confirmModal.classList.add('active');
    });

    // Cerrar modal de confirmar borrado
    const closeConfirmModal = () => {
        confirmModal.classList.remove('active');
    };

    btnCancelClear.addEventListener('click', closeConfirmModal);

    // Cerrar al hacer clic fuera del modal de confirmación
    confirmModal.addEventListener('click', (e) => {
        if (e.target === confirmModal) {
            closeConfirmModal();
        }
    });

    // Acción de borrar toda la lista
    btnConfirmClear.addEventListener('click', () => {
        listContainer.innerHTML = '';
        updateCounter();
        closeConfirmModal();
    });

    // Actualizar el contador inicialmente al cargar la página
    updateCounter();
});
