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
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Outfit:wght@100..900&display=swap" rel="stylesheet">
  </head>
  <body>
    <mi-menu></mi-menu>
    <div class="container">
      <h1 class="text-center">Inicia sesión</h1>
      <form id="loginForm" action="login" method="POST">
        <div class="mb-3">
          <label class="form-label">Nombre de usuario</label>
          <input class="form-control" id="usuario" name="usuario" required>
        </div>
        <div class="mb-3">
          <label for="clave" class="form-label">Contraseña</label>
          <input type="password" class="form-control" id="clave" name="clave" required>
        </div>
        <div id="loginError" class="alert alert-danger" style="display: none;">
          Usuario o contraseña incorrectos
        </div>
        <button type="submit" class="btn btn-primary">Iniciar sesión</button>
        <a href="./register.jsp" class="btn btn-link">¿No tienes cuenta? Regístrate</a>
      </form>
    </div>
    <hr>
    <mi-footer></mi-footer>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
    <script src="./scripts/menu.js"></script>
    <script src="./scripts/carrito.js"></script>
    <script src="./scripts/footer.js"></script>
    <script src="./scripts/user.js"></script>
    <script src="./scripts/translations.js"></script>
    <script src="./scripts/i18n.js"></script>
  </body>
</html>