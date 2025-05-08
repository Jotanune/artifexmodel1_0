class Footer extends HTMLElement {
    constructor() {
        super()
        this.innerHTML = `
            <footer class="py-3">
            <p>&copy; Artifex 2025</p>
            <img src="./img/instagram.png" alt="Instagram" class="icon" onclick="window.open('https://www.instagram.com/')">
            <img src="./img/facebook.png" alt="Facebook" class="icon" onclick="window.open('https://www.facebook.com/')">
            <img src="./img/x.png" alt="Twitter" class="icon" onclick="window.open('https://twitter.com/')">
            </footer>
        `;
    }
}
window.customElements.define('mi-footer', Footer);