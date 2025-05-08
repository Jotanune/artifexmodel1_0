function t(key) {
    const lang = localStorage.getItem('language') || getBrowserLanguage();
    return translations[lang][key] || key;
}

function getBrowserLanguage() {
    const lang = navigator.language || navigator.userLanguage;
    return lang.startsWith('es') ? 'es' : 'en';
}

function translatePage() {
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
}

// Traducir la página cuando se cargue
document.addEventListener('DOMContentLoaded', () => {
    translatePage();
});

// Traducir la página cuando cambie el idioma
document.addEventListener('languageChanged', () => {
    translatePage();
});