document.addEventListener('DOMContentLoaded', () => {
    const fabButton = document.querySelector('.fab-button');
    const listContainer = document.querySelector('.list-container');
    const counterSpan = document.querySelector('.counter');
    
    // Elementos del modal
    const modalOverlay = document.getElementById('add-modal');
    const inputItem = document.getElementById('new-item-input');
    const btnAdd = document.getElementById('btn-add');
    const btnCancel = document.getElementById('btn-cancel');

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

    // Actualizar el contador inicialmente al cargar la página
    updateCounter();
});
