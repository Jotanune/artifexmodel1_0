class Footer extends HTMLElement {    constructor() {
        super()
        this.innerHTML = `
            <footer>
                <div class="footer-content">
                    <div class="footer-section brand">
                        <img src="./img/artifex.png" alt="Artifex Logo" class="footer-logo">
                        <p class="tagline">Tu portal al mundo del arte</p>
                    </div>
                    <div class="footer-section links">
                        <h3>Enlaces Rápidos</h3>
                        <ul>
                            <li><a href="index.jsp">Inicio</a></li>
                            <li><a href="productos.jsp">Productos</a></li>
                            <li><a href="epocas.jsp">Épocas</a></li>
                            <li><a href="empresa.html">Sobre Nosotros</a></li>
                            <li><a href="contacto.html">Contacto</a></li>
                        </ul>
                    </div>
                    <div class="footer-section contact">
                        <h3>Contáctanos</h3>
                        <p><i class="location-icon"></i>Valencia, España</p>
                        <p><i class="email-icon"></i>info@artifex.com</p>
                        <p><i class="phone-icon"></i>+34 960 000 000</p>
                    </div>
                    <div class="footer-section social">
                        <h3>Síguenos</h3>
                        <div class="social-icons">
                            <img src="./img/instagram.png" alt="Instagram" class="icon" onclick="window.open('https://www.instagram.com/')">
                            <img src="./img/facebook.png" alt="Facebook" class="icon" onclick="window.open('https://www.facebook.com/')">
                            <img src="./img/x.png" alt="Twitter" class="icon" onclick="window.open('https://twitter.com/')">
                        </div>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p>&copy; ${new Date().getFullYear()} Artifex. Todos los derechos reservados.</p>
                </div>
            </footer>
        `;
    }
}
window.customElements.define('mi-footer', Footer);