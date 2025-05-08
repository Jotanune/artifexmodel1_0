class Menu extends HTMLElement {
    constructor() {
        super()
        this.innerHTML = `
        <nav id="navbar" class="navbar navbar-expand-md navbar-dark custom-navbar fixed-top">
            <div class="container-fluid">
                <a class="navbar-brand" href="./">Artifex</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarExampleDefault">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarExampleDefault">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <a class="nav-link" href="./usuarios-admin.html">Usuarios</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="./pedidos-admin.html">Pedidos</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link active" href="./productos-admin.html">Productos</a>
                        </li>
                    </ul>
                    <ul class="navbar-nav ms-auto">
                        <li class="nav-item">
                            <a class="nav-link" href="../web/">
                                <img src="./img/door-exit.png" alt="Exit" id="exitImg">
                            </a>
                        </li>
                    </ul>
                </div>                   
            </div>
        </nav>    
        `;
        document.dispatchEvent(new Event("mi-menu-cargado"));
    }
    connectedCallback() {
        const links = this.querySelectorAll('.nav-link');
        const currentPath = window.location.pathname;

        links.forEach(link => {
            const linkPath = link.getAttribute('href').split('/').pop();
            if (currentPath.includes(linkPath)) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
}
window.customElements.define('mi-menu', Menu);

/* Navbar se esconde al scrollear. He investigado como hacerlo 
   a través de la inteligencia artificial. */

   let lastScrollTop = 0;
   let hideTimeout = null;
   const navbar = document.getElementById("navbar");
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
   
   document.addEventListener("DOMContentLoaded", function () {
       if (window.location.pathname.includes("usuario")) {
           const userImage = document.querySelector(".nav-link img");
           if (userImage) {
               userImage.style.width = "30px";
               userImage.style.height = "30px";
               userImage.style.filter = "invert(0)";
           }
       }
   });
   
