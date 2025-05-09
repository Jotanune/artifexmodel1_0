<%@ page language="java" contentType="text/html; charset=UTF-8" import="java.util.List,tienda.*" pageEncoding="UTF-8" %>
<!doctype html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" href="./img/artifex.png" type="image/png">
  <title>Artifex</title>
  <link rel="stylesheet" href="./styles/menu.css">
  <link rel="stylesheet" href="./styles/footer.css">
  <link rel="stylesheet" href="./styles/body.css">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link
    href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Outfit:wght@100..900&display=swap"
    rel="stylesheet">
</head>

<body>
  <mi-menu></mi-menu>

  <div class="container">
    <h1 class="text-center" data-i18n="crearCuenta">Crear cuenta</h1>
    <form action="register" method="POST" id="registroForm" novalidate>
      <div class="mb-3">
        <label for="usuario" class="form-label" data-i18n="nombreUsuario">Nombre de usuario</label>
        <input type="text" class="form-control" id="usuario" name="usuario" required>
        <div class="invalid-feedback" data-i18n="usuarioObligatorio">El nombre de usuario es obligatorio.</div>
        <div class="text-danger mt-1" id="usuarioError" style="display: none;" data-i18n="usuarioEnUso">
          Este nombre de usuario ya está en uso.
        </div>
      </div>

      <div class="row">
        <div class="col-md-6 mb-3">
          <label for="nombre" class="form-label" data-i18n="nombre">Nombre</label>
          <input type="text" class="form-control" id="nombre" name="nombre" required>
          <div class="invalid-feedback" data-i18n="nombreObligatorio">El nombre es obligatorio.</div>
        </div>
        <div class="col-md-6 mb-3">
          <label for="apellidos" class="form-label" data-i18n="apellidos">Apellidos</label>
          <input type="text" class="form-control" id="apellidos" name="apellidos" required>
          <div class="invalid-feedback" data-i18n="apellidosObligatorios">Los apellidos son obligatorios.</div>
        </div>
      </div>

      <div class="mb-3">
        <label for="email" class="form-label" data-i18n="correoElectronico">Correo electrónico</label>
        <input type="email" class="form-control" id="email" name="email" required>
        <div class="invalid-feedback" data-i18n="correoValido">Introduce un correo electrónico válido.</div>
        <div class="text-danger mt-1" id="emailError" style="display: none;" data-i18n="correoRegistrado">
          Este correo electrónico ya está registrado.
        </div>
      </div>

      <div class="mb-3">
        <label for="clave" class="form-label" data-i18n="contrasena">Contraseña</label>
        <input type="password" class="form-control" id="clave" name="clave" required maxlength="40"
               pattern="^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,40}$">
        <div class="invalid-feedback" data-i18n="contrasenaRequisitos">
          La contraseña debe tener entre 8 y 40 caracteres, una mayúscula, un número y un símbolo.
        </div>
        <div class="text-danger mt-1" id="claveLengthError" style="display: none;" data-i18n="contrasenaLarga">
          La contraseña no puede superar los 40 caracteres.
        </div>
      </div>

      <div class="mb-3">
        <label for="confirmPassword" class="form-label" data-i18n="confirmarContrasena">Confirmar contraseña</label>
        <input type="password" class="form-control" id="confirmPassword" required>
        <div class="invalid-feedback" data-i18n="contrasenasNoCoinciden">Las contraseñas no coinciden.</div>
      </div>

      <div class="mb-3">
        <label for="domicilio" class="form-label" data-i18n="domicilio">Domicilio *</label>
        <input type="text" class="form-control" id="domicilio" name="domicilio" required>
        <div class="invalid-feedback" data-i18n="domicilioObligatorio">El domicilio es obligatorio.</div>
      </div>

      <div class="row">
        <div class="col-md-6 mb-3">
          <label for="poblacion" class="form-label" data-i18n="poblacion">Población *</label>
          <input type="text" class="form-control" id="poblacion" name="poblacion" required>
          <div class="invalid-feedback" data-i18n="poblacionObligatoria">La población es obligatoria.</div>
        </div>
        <div class="col-md-6 mb-3">
          <label for="provincia" class="form-label" data-i18n="provincia">Provincia *</label>
          <input type="text" class="form-control" id="provincia" name="provincia" required>
          <div class="invalid-feedback" data-i18n="provinciaObligatoria">La provincia es obligatoria.</div>
        </div>
      </div>

      <div class="row">
        <div class="col-md-6 mb-3">
          <label for="cp" class="form-label" data-i18n="codigoPostal">Código Postal *</label>
          <input type="text" class="form-control" id="cp" name="cp" pattern="[0-9]{5}" required>
          <div class="invalid-feedback" data-i18n="codigoPostalValido">El código postal debe tener 5 dígitos.</div>
        </div>
        <div class="col-md-6 mb-3">
          <label for="telefono" class="form-label" data-i18n="telefono">Teléfono *</label>
          <input type="tel" class="form-control" id="telefono" name="telefono" pattern="[0-9]{9}" required>
          <div class="invalid-feedback" data-i18n="telefonoValido">El teléfono debe tener 9 dígitos.</div>
        </div>
      </div>

      <div class="mb-3 form-check">
        <input type="checkbox" class="form-check-input" id="terminos" required>
        <label class="form-check-label" for="terminos" data-i18n="aceptarTerminos">Acepto los términos y condiciones</label>
        <div class="invalid-feedback" data-i18n="aceptarTerminosObligatorio">Debes aceptar los términos para registrarte.</div>
      </div>

      <div id="registerError" class="alert alert-danger" style="display: none;" data-i18n="errorRegistro">
        Error al registrar el usuario. Por favor, inténtalo de nuevo.
      </div>

      <button type="submit" class="btn btn-primary" data-i18n="registrarse">Registrarse</button>
      <a href="login.jsp" class="btn btn-link" data-i18n="yaTienesCuenta">¿Ya tienes una cuenta? Inicia sesión</a>
    </form>
  </div>
  <mi-footer></mi-footer>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
    integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
    crossorigin="anonymous"></script>
  <script src="./scripts/menu.js"></script>
  <script src="./scripts/carrito.js"></script>
  <script src="./scripts/footer.js"></script>
  <script src="./scripts/register.js"></script>
  <script src="./scripts/translations.js"></script>
  <script src="./scripts/i18n.js"></script>
</body>

</html>