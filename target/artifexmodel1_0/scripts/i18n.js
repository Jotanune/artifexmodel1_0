function t(key) {
    const lang = localStorage.getItem('language') || getBrowserLanguage();
    return translations[lang][key] || key;
}

function getBrowserLanguage() {
    const lang = navigator.language || navigator.userLanguage;
    return lang.startsWith('es') ? 'es' : 'en';
}

function translateCategory(categoria) {
    const lang = localStorage.getItem('language') || getBrowserLanguage();
    const categoriaKey = `categoria_${categoria.toLowerCase().replace(/\s+/g, '_')}`;
    return translations[lang][categoriaKey] || categoria;
}

function translateImage(imagePath) {
    if (!imagePath) return '';
    const fileName = imagePath.substring(imagePath.lastIndexOf("/") + 1, imagePath.lastIndexOf("."));
    return t(fileName);
}

function translatePage() {
    const lang = localStorage.getItem('language') || getBrowserLanguage();
    
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
            if (element.getAttribute('placeholder')) {
                element.placeholder = t(key);
            }
        } else {
            element.textContent = t(key);
        }
    });

    // Traducir categorías
    document.querySelectorAll('option[data-categoria]').forEach(option => {
        const categoria = option.getAttribute('data-categoria');
        if (categoria) {
            option.textContent = translateCategory(categoria);
        }
    });

    // Traducir títulos de los productos
    document.querySelectorAll('.card-title').forEach(title => {
        if (title.hasAttribute('data-i18n')) {
            title.textContent = t(title.getAttribute('data-i18n'));
        }
    });
}

// Traducir la página cuando se cargue
document.addEventListener('DOMContentLoaded', () => {
    translatePage();
});

// Traducir la página cuando cambie el idioma
document.addEventListener('languageChanged', () => {
    translatePage();
    
    // Actualizar el carrito con los nombres traducidos
    if (typeof actualizarDropdownCarrito === 'function') {
        actualizarDropdownCarrito();
    }
});