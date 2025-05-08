<%@ page language="java" contentType="text/html; charset=UTF-8" import="java.util.*,tienda.*" pageEncoding="UTF-8" %>
<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" href="./img/artifex.png" type="image/png">
    <title>Artifex</title>
    <link rel="stylesheet" href="./styles/menu.css">
    <link rel="stylesheet" href="./styles/body.css">
    <link rel="stylesheet" href="./styles/footer.css">

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans&family=Outfit&display=swap" rel="stylesheet">
  </head>
  <body>
    <mi-menu></mi-menu>
    <div class="container">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h1 class="mb-0">Nuestros Productos</h1>
        <div class="dropdown-container">
          <select class="form-select categoria-select" id="categoriaSelect" onchange="cambiarCategoria(this.value)">
            <option value="0">Todas las categorías</option>
            <% 
              AccesoBD con = AccesoBD.getInstance();
              List<Map<String, Object>> categorias = con.obtenerCategorias();
              for (Map<String, Object> categoria : categorias) {
                int codigo = (Integer) categoria.get("codigo");
                String descripcion = (String) categoria.get("descripcion");
            %>
                <option value="<%= codigo %>"<%= (request.getParameter("categoria") != null && Integer.parseInt(request.getParameter("categoria")) == codigo ? " selected" : "") %>><%= descripcion %></option>
            <% } %>
          </select>
        </div>
      </div>
      <div class="search-container mb-4">
        <input type="search" class="form-control" id="searchBar" placeholder="Buscar cuadros..." value="<%= request.getParameter("busqueda") != null ? request.getParameter("busqueda") : "" %>">
      </div>
      <div class="row g-4">
        <% 
          String busqueda = request.getParameter("busqueda");
          List<ProductoBD> productos;
          
          if (busqueda != null && !busqueda.trim().isEmpty()) {
            // Si hay término de búsqueda, usar el nuevo método de búsqueda
            productos = con.buscarProductos(busqueda.trim());
          } else {
            // Si no hay búsqueda, usar la paginación normal
            int categoria = 0;
            if (request.getParameter("categoria") != null) {
                categoria = Integer.parseInt(request.getParameter("categoria"));
            }

            int paginaActual = 1;
            if (request.getParameter("pagina") != null) {
                paginaActual = Integer.parseInt(request.getParameter("pagina"));
            }

            final int PRODUCTOS_POR_PAGINA = 8;
            productos = con.obtenerProductosPaginados(categoria, paginaActual, PRODUCTOS_POR_PAGINA);
          }

          int i = 1;
          for (ProductoBD producto : productos) {
              int codigo = producto.getCodigo();
              String descripcion = producto.getDescripcion();
              float precio = producto.getPrecio();
              int existencias = producto.getStock();
              String imagen = producto.getImagen();
        %>
        
        <div class="col-lg-3 col-md-4 col-sm-6">
          <div class="card shadow-sm producto-mancha h-100 d-flex flex-column align-items-center">
            <img src="<%= imagen %>" class="card-img-top img-fluid p-3" alt="<%= descripcion %>">
            <div class="card-body text-center">
              <h5 class="card-title"><%= descripcion %></h5>
              <p class="card-text"><%= precio %>€</p>
              <div class="input-group">
                <% if (existencias > 0) { %>
                  <input type="number" class="form-control" placeholder="0" min="0" max="<%= existencias %>" id="cantidadProducto<%=i%>">
                  <button class="btn btn-primary" type="button" onclick="anyadirProducto('<%=codigo%>', '<%=descripcion%>', parseInt(document.getElementById('cantidadProducto<%=i%>').value))">Comprar</button>
                <% } else { %>
                  <p class="text-danger">Sin stock</p>
                <% } %>
              </div>
            </div>
          </div>
        </div>

        <%
            i++;
          }
          
          // Solo mostrar paginación si no hay búsqueda activa
          if (busqueda == null || busqueda.trim().isEmpty()) {
            int categoria = request.getParameter("categoria") != null ? Integer.parseInt(request.getParameter("categoria")) : 0;
            int paginaActual = request.getParameter("pagina") != null ? Integer.parseInt(request.getParameter("pagina")) : 1;
            final int PRODUCTOS_POR_PAGINA = 8;
            int totalProductos = con.obtenerTotalProductos(categoria);
            int totalPaginas = (int) Math.ceil((double) totalProductos / PRODUCTOS_POR_PAGINA);
            
            if (totalPaginas > 1) {
        %>
            <nav aria-label="Navegación de páginas" class="mt-4">
              <div class="d-flex justify-content-between align-items-center">
                <p class="mb-0">Página <%= paginaActual %> de <%= totalPaginas %></p>
                <ul class="pagination mb-0">
                  <% if (paginaActual > 1) { %>
                    <li class="page-item">
                      <a class="page-link" href="?categoria=<%= categoria %>&pagina=<%= paginaActual - 1 %>" aria-label="Anterior">
                        <span aria-hidden="true">&laquo;</span>
                      </a>
                    </li>
                  <% } %>

                  <% 
                  int inicio = Math.max(1, paginaActual - 2);
                  int fin = Math.min(totalPaginas, paginaActual + 2);

                  if (inicio > 1) { %>
                    <li class="page-item"><a class="page-link" href="?categoria=<%= categoria %>&pagina=1">1</a></li>
                    <% if (inicio > 2) { %>
                      <li class="page-item disabled"><span class="page-link">...</span></li>
                    <% } %>
                  <% } %>

                  <% for (int p = inicio; p <= fin; p++) { %>
                    <li class="page-item <%= (p == paginaActual ? "active" : "") %>">
                      <a class="page-link" href="?categoria=<%= categoria %>&pagina=<%= p %>"><%= p %></a>
                    </li>
                  <% } %>

                  <% if (fin < totalPaginas) { %>
                    <% if (fin < totalPaginas - 1) { %>
                      <li class="page-item disabled"><span class="page-link">...</span></li>
                    <% } %>
                    <li class="page-item">
                      <a class="page-link" href="?categoria=<%= categoria %>&pagina=<%= totalPaginas %>"><%= totalPaginas %></a>
                    </li>
                  <% } %>

                  <% if (paginaActual < totalPaginas) { %>
                    <li class="page-item">
                      <a class="page-link" href="?categoria=<%= categoria %>&pagina=<%= paginaActual + 1 %>" aria-label="Siguiente">
                        <span aria-hidden="true">&raquo;</span>
                      </a>
                    </li>
                  <% } %>
                </ul>
              </div>
            </nav>
        <% 
            }
          }
        %>
      </div>
    </div>
    <hr>
    <mi-footer></mi-footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="./scripts/menu.js"></script>
    <script src="./scripts/footer.js"></script>
    <script src="./scripts/carrito.js"></script>
    <script>
      function cambiarCategoria(categoria) {
        // Limpiar la búsqueda al cambiar de categoría
        const searchBar = document.getElementById('searchBar');
        searchBar.value = '';
        window.location.href = 'productos.jsp?categoria=' + categoria;
      }

      document.addEventListener('DOMContentLoaded', function() {
        const searchBar = document.getElementById('searchBar');
        let timeoutId;

        searchBar.addEventListener('input', function() {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            const query = searchBar.value.trim();
            if (query !== '') {
              window.location.href = 'productos.jsp?busqueda=' + encodeURIComponent(query);
            } else {
              // Si la búsqueda está vacía, volver a la vista normal
              const categoria = document.getElementById('categoriaSelect').value;
              window.location.href = 'productos.jsp?categoria=' + categoria;
            }
          }, 500); // Esperar 500ms después de que el usuario deje de escribir
        });
      });
    </script>
  </body>
</html>
