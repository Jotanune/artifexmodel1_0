<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" isErrorPage="true" %>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" href="./img/artifex.png" type="image/png">
    <title>Error - Artifex</title>
    <link rel="stylesheet" href="./styles/menu.css">
    <link rel="stylesheet" href="./styles/footer.css">
    <link rel="stylesheet" href="./styles/body.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@100..1000&family=Outfit:wght@100..900&display=swap" rel="stylesheet">
    <style>
        .error-container {
            min-height: 70vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 2rem;
        }
        .error-code {
            font-size: 6rem;
            font-weight: 700;
            color: var(--text-primary);
            margin-bottom: 1rem;
            opacity: 0.8;
        }
        .error-message {
            font-size: 1.5rem;
            color: var(--text-secondary);
            margin-bottom: 2rem;
        }
        .error-details {
            font-size: 1rem;
            color: var(--text-muted);
            margin-bottom: 2rem;
            max-width: 600px;
        }
        .back-button {
            background-color: var(--text-primary) !important;
            color: var(--bg-primary) !important;
            border: none !important;
            padding: 12px 30px !important;
            border-radius: 8px !important;
            font-weight: 500 !important;
            transition: all 0.3s ease !important;
        }
        .back-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px var(--shadow-color);
        }
    </style>
</head>
<body>
    <mi-menu></mi-menu>
    
    <div class="container error-container">
        <div class="error-code">
            <%= response.getStatus() %>
        </div>
        <h1 class="error-message">
            <%
            String errorMessage;
            switch(response.getStatus()) {
                case 404:
                    errorMessage = "Página no encontrada";
                    break;
                case 500:
                    errorMessage = "Error interno del servidor";
                    break;
                case 403:
                    errorMessage = "Acceso denegado";
                    break;
                default:
                    errorMessage = "Ha ocurrido un error";
            }
            %>
            <%= errorMessage %>
        </h1>
        <p class="error-details">
            <% if (exception != null) { %>
                <%= exception.getMessage() %>
            <% } else { %>
                Lo sentimos, pero no podemos encontrar lo que estás buscando. Puede que la página haya sido movida o eliminada.
            <% } %>
        </p>
        <a href="./" class="btn back-button">Volver al inicio</a>
    </div>

    <mi-footer></mi-footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="./scripts/menu.js"></script>
    <script src="./scripts/footer.js"></script>
    <script src="./scripts/translations.js"></script>
    <script src="./scripts/i18n.js"></script>
</body>
</html>