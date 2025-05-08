class Menu extends HTMLElement {
    constructor() {
        super();
        this.loadMenuContent();
    }

    async loadMenuContent() {
        try {
            const response = await fetch('getUserInfo');
            const data = await response.json();
            
            const menuContent = data.loggedIn ? this.getLoggedInMenu(data.usuario) : this.getDefaultMenu();
            this.innerHTML = menuContent;
            
            document.dispatchEvent(new Event("mi-menu-cargado"));
            this.initializeNavbarBehavior();
            this.initializeThemeSwitch();
        } catch (error) {
            this.innerHTML = this.getDefaultMenu();
            document.dispatchEvent(new Event("mi-menu-cargado"));
            this.initializeNavbarBehavior();
            this.initializeThemeSwitch();
        }
    }

    getDefaultMenu() {
        return `
        <nav id="navbar" class="navbar navbar-expand-md navbar-dark custom-navbar fixed-top">
            <div class="container-fluid">
                <a class="navbar-brand" href="./">Artifex</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarExampleDefault">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarExampleDefault">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <a class="nav-link" href="./empresa.html" data-i18n="empresa">Empresa</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="./contacto.html" data-i18n="contacto">Contacto</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="./productos.jsp" data-i18n="productos">Productos</a>
                        </li>
                    </ul>
                    <ul class="navbar-nav ms-auto">
                        <li class="nav-item">
                            <label class="theme-switch">
                                <input type="checkbox" id="theme-toggle">
                                <span class="slider"></span>
                            </label>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="./login.jsp">
                                <img src="./img/user.png" alt="Usuario" id="userImg">
                            </a>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" id="carritoDropdown" role="button" data-bs-toggle="dropdown" data-i18n="carrito">
                                Carrito
                            </a>
                            <div class="dropdown-menu dropdown-menu-end">
                                <a class="dropdown-item" href="#" data-i18n="vacio">Vacío</a>
                            </div>
                        </li>
                        <li class="nav-item">
                            <button class="language-switch">
                                <img src="./img/es.png" alt="Español" id="currentFlag">
                                <span id="currentLang">ES</span>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>`;
    }

    getLoggedInMenu(usuario) {
        return `
        <nav id="navbar" class="navbar navbar-expand-md navbar-dark custom-navbar fixed-top">
            <div class="container-fluid">
                <a class="navbar-brand" href="./">Artifex</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarExampleDefault">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarExampleDefault">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <a class="nav-link" href="./empresa.html" data-i18n="empresa">Empresa</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="./contacto.html" data-i18n="contacto">Contacto</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="./productos.jsp" data-i18n="productos">Productos</a>
                        </li>
                    </ul>
                    <ul class="navbar-nav ms-auto">
                        <li class="nav-item">
                            <label class="theme-switch">
                                <input type="checkbox" id="theme-toggle">
                                <span class="slider"></span>
                            </label>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle user-dropdown" href="#" role="button" data-bs-toggle="dropdown">
                                <img src="./img/user.png" alt="Usuario" id="userImg" class="logged-in">
                                <span class="usuario-nombre">${usuario}</span>
                            </a>
                            <div class="dropdown-menu dropdown-menu-end">
                                <a class="dropdown-item" href="./my-account.jsp" data-i18n="miCuenta">Mi cuenta</a>
                                <div class="dropdown-divider"></div>
                                <a class="dropdown-item" href="./logout" data-i18n="cerrarSesion">Cerrar sesión</a>
                            </div>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" id="carritoDropdown" role="button" data-bs-toggle="dropdown" data-i18n="carrito">
                                Carrito
                            </a>
                            <div class="dropdown-menu dropdown-menu-end">
                                <a class="dropdown-item" href="#" data-i18n="vacio">Vacío</a>
                            </div>
                        </li>
                        <li class="nav-item">
                            <button class="language-switch">
                                <img src="./img/es.png" alt="Español" id="currentFlag">
                                <span id="currentLang">ES</span>
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>`;
    }

    initializeNavbarBehavior() {
        const links = this.querySelectorAll('.nav-link');
        const currentPath = window.location.pathname;

        links.forEach(link => {
            const linkPath = link.getAttribute('href')?.split('/').pop();
            if (linkPath && currentPath.includes(linkPath)) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Inicializar el selector de idioma
        this.initializeLanguageSwitch();
    }

    initializeThemeSwitch() {
        const themeToggle = this.querySelector('#theme-toggle');
        if (themeToggle) {
            // Cargar tema guardado
            const currentTheme = localStorage.getItem('theme') || 'light';
            document.documentElement.setAttribute('data-theme', currentTheme);
            themeToggle.checked = currentTheme === 'dark';

            // Manejar cambios en el switch
            themeToggle.addEventListener('change', () => {
                const theme = themeToggle.checked ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', theme);
                localStorage.setItem('theme', theme);
            });
        }
    }

    initializeLanguageSwitch() {
        const savedLang = localStorage.getItem('language') || this.getBrowserLanguage();
        this.setLanguage(savedLang);

        const languageSwitch = this.querySelector('.language-switch');
        if (languageSwitch) {
            languageSwitch.addEventListener('click', (e) => {
                e.preventDefault();
                const currentLang = localStorage.getItem('language') || this.getBrowserLanguage();
                const newLang = currentLang === 'es' ? 'en' : 'es';
                this.setLanguage(newLang);
                localStorage.setItem('language', newLang);
                document.dispatchEvent(new Event('languageChanged'));
                // Traducir la página inmediatamente
                translatePage();
            });
        }
    }

    getBrowserLanguage() {
        const lang = navigator.language || navigator.userLanguage;
        return lang.startsWith('es') ? 'es' : 'en';
    }

    setLanguage(lang) {
        const currentFlag = this.querySelector('#currentFlag');
        const currentLang = this.querySelector('#currentLang');
        
        if (lang === 'es') {
            currentFlag.src = './img/es.png';
            currentFlag.alt = 'Español';
            currentLang.textContent = 'ES';
        } else {
            currentFlag.src = './img/uk.png';
            currentFlag.alt = 'English';
            currentLang.textContent = 'EN';
        }
    }
}

window.customElements.define('mi-menu', Menu);

document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("mi-menu-cargado", function() {
        const navbar = document.getElementById("navbar");
        if (!navbar) return;

        let lastScrollTop = 0;
        let hideTimeout = null;
        const scrollThreshold = window.innerHeight * 0.25;

        window.addEventListener("scroll", function () {
            let currentScroll = window.scrollY || document.documentElement.scrollTop;

            if (currentScroll > lastScrollTop && currentScroll > scrollThreshold) {
                navbar.style.transform = "translateY(-100%)";
                resetHideTimeout();
            } else {
                navbar.style.transform = "translateY(0)";
                resetHideTimeout();
            }

            lastScrollTop = currentScroll;
        });

        document.addEventListener('mousemove', function (event) {
            if (event.clientY <= 40) {
                navbar.style.transform = "translateY(0)";
                resetHideTimeout();
            } else {
                if (window.scrollY > scrollThreshold) {
                    resetHideTimeout();
                }
            }
        });

        function resetHideTimeout() {
            if (hideTimeout) {
                clearTimeout(hideTimeout);
            }

            hideTimeout = setTimeout(function () {
                if (window.scrollY > scrollThreshold) { 
                    navbar.style.transform = "translateY(-100%)";
                }
            }, 1000);
        }

        // Gestión de la imagen de usuario
        if (window.location.pathname.includes("usuario")) {
            const userImage = document.querySelector(".nav-link img");
            if (userImage) {
                userImage.style.width = "30px";
                userImage.style.height = "30px";
                userImage.style.filter = "invert(0)";
            }
        }
    });
});

