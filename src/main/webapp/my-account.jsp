<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="tienda.UsuarioBD" %>
<%
    UsuarioBD usuario = (UsuarioBD) session.getAttribute("usuario");
    if (usuario == null) {
        response.sendRedirect("login.jsp");
        return;
    }
    String passwordMask = "*".repeat(8); // Mostrar 8 asteriscos para la contraseña
%>
<!doctype html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" href="./img/artifex.png" type="image/png">
    <title>Mi Cuenta - Artifex</title>
    <link rel="stylesheet" href="./styles/menu.css">
    <link rel="stylesheet" href="./styles/footer.css">
    <link rel="stylesheet" href="./styles/body.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Outfit:wght@100..900&display=swap"
        rel="stylesheet">
</head>

<body>
    <mi-menu></mi-menu>

    <div class="container">
        <div class="card shadow-sm">
            <div class="card-header">
                <h1 class="text-center mb-0">Mi Cuenta</h1>
            </div>
            <div class="card-body">
                <div id="usuarioInfo" class="mb-4">
                    <div class="row mb-3">
                        <div class="col-md-6">                            <p class="mb-2"><strong>Nombre:</strong> <span class="text-muted"><%= usuario.getNombre() %> <%= usuario.getApellidos() %></span></p>
                            <p class="mb-2"><strong>Email:</strong> <span class="text-muted"><%= usuario.getEmail() %></span></p>
                            <p class="mb-2"><strong>Contraseña:</strong> <span class="text-muted"><%= passwordMask %></span></p>
                        </div>
                        <div class="col-md-6">
                        </div>
                    </div>
                    <button class="btn btn-primary w-100" onclick="editarUsuario()">Editar Datos</button>
                </div>

                <div id="alertaExito" class="alert alert-success alert-dismissible fade" role="alert" style="display: none;">
                    <span id="alertaExitoMensaje"></span>
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>

                <div id="alertaError" class="alert alert-danger alert-dismissible fade" role="alert" style="display: none;">
                    <span id="alertaErrorMensaje"></span>
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>

                <h2 class="h4 mb-3">Mi Carrito</h2>
                <div id="carritoContent">
                    <div class="alert alert-info mb-0">Cargando carrito...</div>
                </div>
                <button id="comprarCarrito" class="btn btn-success w-100 mt-3">Comprar Carrito</button>

                <div class="mt-4">
                    <h2 class="h4 mb-3">Mis Pedidos</h2>
                    <div id="pedidosInfo">
                        <div class="alert alert-info mb-0">No tienes pedidos.</div>
                    </div>
                </div>

                <div id="alertaCompra" class="alert alert-success alert-dismissible fade" role="alert" style="display: none;">
                    <span id="alertaCompraMensaje"></span>
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal para compra -->
    <div class="modal fade" id="compraModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Finalizar Compra</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="formCompra">
                        <h6 class="mb-3">Dirección de Envío</h6>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Domicilio</label>
                                <input type="text" class="form-control" id="domicilioEnvio" name="domicilio" value="<%= usuario.getDomicilio() != null ? usuario.getDomicilio() : "" %>" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Población</label>
                                <input type="text" class="form-control" id="poblacionEnvio" name="poblacion" value="<%= usuario.getPoblacion() != null ? usuario.getPoblacion() : "" %>" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Provincia</label>
                                <input type="text" class="form-control" id="provinciaEnvio" name="provincia" value="<%= usuario.getProvincia() != null ? usuario.getProvincia() : "" %>" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label class="form-label" data-i18n="codigoPostal">Código Postal</label>
                                <input type="text" class="form-control" id="cpEnvio" name="cp" pattern="[0-9]{5}" value="<%= usuario.getCp() != null ? usuario.getCp() : "" %>" required>
                            </div>
                        </div>

                        <h6 class="mb-3 mt-4">Método de Pago</h6>
                        <div class="mb-3">
                            <select class="form-select" id="metodoPago" required>
                                <option value="">Seleccione un método de pago</option>
                                <option value="tarjeta">Tarjeta de Crédito</option>
                                <option value="transferencia">Transferencia Bancaria</option>
                            </select>
                        </div>

                        <div id="datosTarjeta" style="display: none;">
                            <div class="row">
                                <div class="col-12 mb-3">
                                    <label class="form-label">Número de Tarjeta</label>
                                    <input type="text" class="form-control" id="numeroTarjeta" pattern="[0-9]{16}" placeholder="1234567890123456">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Fecha de Caducidad (MM/AA)</label>
                                    <input type="text" class="form-control" id="caducidadTarjeta" pattern="(0[1-9]|1[0-2])\/([0-9]{2})" placeholder="MM/AA">
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">CVV</label>
                                    <input type="text" class="form-control" id="cvvTarjeta" pattern="[0-9]{3,4}" placeholder="123">
                                </div>
                            </div>
                        </div>

                        <div id="datosTransferencia" style="display: none;">
                            <div class="alert alert-info">
                                <h6>Datos Bancarios para la Transferencia:</h6>
                                <p class="mb-1">IBAN: ES91 2100 0418 4502 0005 1332</p>
                                <p class="mb-1">Beneficiario: Artifex Model</p>
                                <p class="mb-1">Concepto: Pedido + su email</p>
                                <p class="mb-0">Por favor, adjunte el comprobante de transferencia a continuación:</p>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Comprobante de Transferencia</label>
                                <input type="file" class="form-control" id="comprobanteTransferencia" accept=".pdf,.jpg,.jpeg,.png">
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary" id="btnFinalizarCompra">Finalizar Compra</button>
                </div>
            </div>
        </div>
    </div>

    <mi-footer></mi-footer>

    <!-- Modal para cambiar contraseña (fuera de la tarjeta para evitar bugs al editar datos) -->
    <div class="modal fade" id="cambiarClaveModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Cambiar Contraseña</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="formCambiarClave">
                        <div class="mb-3">
                            <label class="form-label">Contraseña Actual</label>
                            <input type="password" class="form-control" id="claveActual" required>
                        </div>
                        <div id="nuevaClaveFields" style="display: none;">
                            <div class="mb-3">
                                <label class="form-label">Nueva Contraseña</label>
                                <input type="password" class="form-control" id="nuevaClave" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Confirmar Nueva Contraseña</label>
                                <input type="password" class="form-control" id="confirmarClave" required>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary" id="btnVerificarClave">Verificar Contraseña</button>
                    <button type="button" class="btn btn-success" id="btnGuardarClave" style="display: none;">Guardar Nueva Contraseña</button>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
        crossorigin="anonymous"></script>
    <script src="./scripts/menu.js"></script>
    <script src="./scripts/carrito.js"></script>
    <script src="./scripts/footer.js"></script>
    <script src="./scripts/my-account.js"></script>
    <script src="./scripts/translations.js"></script>
    <script src="./scripts/i18n.js"></script>
</body>
</html>