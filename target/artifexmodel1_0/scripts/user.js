document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            if (!this.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            this.classList.add('was-validated');
        });

        // Mostrar mensaje de error si existe el parámetro error en la URL
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('error') === 'true') {
            document.getElementById('loginError').style.display = 'block';
        }
    }

    // Mostrar mensaje de registro exitoso si existe el parámetro registro en la URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('registro') === 'success') {
        // Crear y mostrar una alerta de éxito
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success';
        alertDiv.role = 'alert';
        alertDiv.textContent = 'Registro exitoso. Por favor, inicia sesión.';
        
        const container = document.querySelector('.container');
        container.insertBefore(alertDiv, container.firstChild);
    }
});
