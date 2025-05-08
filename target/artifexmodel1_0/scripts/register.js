document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registroForm');
    const passwordInput = document.getElementById('clave');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const usuarioInput = document.getElementById('usuario');
    const emailInput = document.getElementById('email');
    const submitButton = form.querySelector('button[type="submit"]');
    const usuarioError = document.getElementById('usuarioError');
    const emailError = document.getElementById('emailError');
    const registerError = document.getElementById('registerError');
    const claveLengthError = document.getElementById('claveLengthError');

    // Función para verificar usuario/email
    async function verificarDuplicado(campo, valor) {
        try {
            const formData = new FormData();
            formData.append(campo, valor);
            formData.append('accion', 'verificar');
            
            const response = await fetch('register', {
                method: 'POST',
                body: new URLSearchParams(formData)
            });

            const data = await response.json();
            return data.error === campo;
        } catch (error) {
            console.error('Error:', error);
            return false;
        }
    }

    // Validar usuario cuando pierde el foco
    usuarioInput.addEventListener('blur', async function() {
        if (this.value) {
            const duplicado = await verificarDuplicado('usuario', this.value);
            if (duplicado) {
                usuarioError.style.display = 'block';
                usuarioInput.classList.add('is-invalid');
                submitButton.disabled = true;
            } else {
                usuarioError.style.display = 'none';
                usuarioInput.classList.remove('is-invalid');
                submitButton.disabled = false;
            }
        }
    });

    // Validar email cuando pierde el foco
    emailInput.addEventListener('blur', async function() {
        if (this.value && this.checkValidity()) {
            const duplicado = await verificarDuplicado('email', this.value);
            if (duplicado) {
                emailError.style.display = 'block';
                emailInput.classList.add('is-invalid');
                submitButton.disabled = true;
            } else {
                emailError.style.display = 'none';
                emailInput.classList.remove('is-invalid');
                submitButton.disabled = false;
            }
        }
    });

    // Validar contraseñas cuando se modifica la confirmación
    confirmPasswordInput.addEventListener('input', function() {
        const coinciden = this.value === passwordInput.value;
        this.setCustomValidity(coinciden ? '' : 'Las contraseñas no coinciden');
    });

    passwordInput.addEventListener('input', function() {
        if (this.value.length > 40) {
            claveLengthError.style.display = 'block';
            this.classList.add('is-invalid');
            submitButton.disabled = true;
        } else {
            claveLengthError.style.display = 'none';
            this.classList.remove('is-invalid');
            submitButton.disabled = false;
        }
        if (confirmPasswordInput.value) {
            const coinciden = this.value === confirmPasswordInput.value;
            confirmPasswordInput.setCustomValidity(coinciden ? '' : 'Las contraseñas no coinciden');
        }
    });

    // Manejar el envío del formulario
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Validar todos los campos requeridos
        if (!form.checkValidity()) {
            e.stopPropagation();
            form.classList.add('was-validated');
            return;
        }

        if (passwordInput.value.length > 40) {
            claveLengthError.style.display = 'block';
            passwordInput.classList.add('is-invalid');
            submitButton.disabled = true;
            return;
        }

        // Verificar usuario y email antes de enviar
        const usuarioExiste = await verificarDuplicado('usuario', usuarioInput.value);
        const emailExiste = await verificarDuplicado('email', emailInput.value);

        if (usuarioExiste) {
            usuarioError.style.display = 'block';
            usuarioInput.classList.add('is-invalid');
            return;
        }

        if (emailExiste) {
            emailError.style.display = 'block';
            emailInput.classList.add('is-invalid');
            return;
        }

        // Si todo está bien, enviar el formulario
        try {
            const formData = new FormData(form);
            formData.append('accion', 'registrar');
            
            const response = await fetch('register', {
                method: 'POST',
                body: new URLSearchParams(formData)
            });

            const data = await response.json();
            
            if (data.success) {
                window.location.href = 'login.jsp';
            } else if (data.error) {
                if (data.error === 'usuario') {
                    usuarioError.style.display = 'block';
                    usuarioInput.classList.add('is-invalid');
                } else if (data.error === 'email') {
                    emailError.style.display = 'block';
                    emailInput.classList.add('is-invalid');
                } else if (data.error === 'clave_larga') {
                    claveLengthError.style.display = 'block';
                    passwordInput.classList.add('is-invalid');
                } else {
                    registerError.style.display = 'block';
                }
            }
        } catch (error) {
            console.error('Error:', error);
            registerError.textContent = 'Error al procesar la solicitud. Por favor, inténtalo de nuevo.';
            registerError.style.display = 'block';
        }
    });

    // Limpiar mensajes de error al escribir
    usuarioInput.addEventListener('input', function() {
        usuarioError.style.display = 'none';
        this.classList.remove('is-invalid');
        submitButton.disabled = false;
    });

    emailInput.addEventListener('input', function() {
        emailError.style.display = 'none';
        this.classList.remove('is-invalid');
        submitButton.disabled = false;
    });
});