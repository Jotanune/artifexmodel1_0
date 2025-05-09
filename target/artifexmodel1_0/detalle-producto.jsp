<%@ page language="java" contentType="text/html; charset=UTF-8" import="java.util.*,tienda.*" pageEncoding="UTF-8" %>
<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" href="./img/artifex.png" type="image/png">
    <title>Detalle de Obra - Artifex</title>
    <link rel="stylesheet" href="./styles/menu.css">
    <link rel="stylesheet" href="./styles/body.css">
    <link rel="stylesheet" href="./styles/footer.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans&family=Outfit&display=swap" rel="stylesheet">    <style>
      .obra-img {
        width: 100% !important;
        height: 600px !important;
        object-fit: contain !important;
        background-color: #f8f9fa;
        border-radius: 12px;
        padding: 1rem;
        margin-bottom: 2rem;
      }
      .info-obra {
        background-color: #f8f9fa;
        padding: 2rem;
        border-radius: 10px;
      }
    </style>
  </head>
  <body>
    <mi-menu></mi-menu>
      <div class="container my-5">
      <a href="productos.jsp" class="btn-back mb-4">
        <i class="bi bi-arrow-left"></i>
        <span>Volver a productos</span>
      </a>
      <% 
        ProductoBD producto = (ProductoBD)request.getAttribute("producto");
        if (producto != null) {
          String categoria = "";
          switch(producto.getCategoria()) {
            case 1: categoria = "Expresionismo / Postimpresionismo"; break;
            case 2: categoria = "Barroco"; break;
            case 3: categoria = "Cubismo"; break;
            case 4: categoria = "Abstracción geométrica / De Stijl"; break;
            case 5: categoria = "Renacimiento"; break;
            case 6: categoria = "Surrealismo"; break;
          }

          String autor = "";
          String año = "";
          String descripcionLarga = "";
          
          // Asignar información según la obra
          String imagenNombre = producto.getImagen().substring(producto.getImagen().lastIndexOf("/") + 1);
          switch(imagenNombre) {
            case "el-grito.jpg":
              autor = "Edvard Munch";
              año = "1893";
              descripcionLarga = "Una de las obras más icónicas del expresionismo, representa la ansiedad existencial del hombre moderno. La figura central, con su rostro deformado en un grito silencioso, se ha convertido en un símbolo universal del sufrimiento humano.";
              break;
            case "perla.jpg":
              autor = "Johannes Vermeer";
              año = "1665";
              descripcionLarga = "Esta obra maestra del periodo barroco holandés retrata a una joven con un pendiente de perla y un turbante exótico. La pintura es conocida por su intimidad y el uso magistral de la luz.";
              break;
            case "noche.jpg":
              autor = "Vincent van Gogh";
              año = "1889";
              descripcionLarga = "Pintada durante su estancia en el asilo de Saint-Rémy-de-Provence, esta obra refleja la vista desde la ventana de su habitación. Los remolinos en el cielo y la intensidad de los colores muestran la interpretación única de Van Gogh de la naturaleza.";
              break;
            case "guernica.jpg":
              autor = "Pablo Picasso";
              año = "1937";
              descripcionLarga = "Una de las obras más famosas de Picasso, el Guernica es un poderoso alegato contra la guerra y la violencia. Fue creado en respuesta al bombardeo de Guernica durante la Guerra Civil Española.";
              break;
            case "composition-8.jpg":
              autor = "Wassily Kandinsky";
              año = "1923";
              descripcionLarga = "Una obra maestra del arte abstracto, Composition VIII representa el período más geométrico de Kandinsky en la Bauhaus. La pintura es una compleja disposición de formas geométricas y líneas.";
              break;
            case "rojo-amarillo-azul.jpg":
              autor = "Piet Mondrian";
              año = "1930";
              descripcionLarga = "Esta composición neoplasticista es característica del estilo maduro de Mondrian, utilizando solo colores primarios y líneas negras que crean rectángulos.";
              break;
            case "nacimiento-venus.jpg":
              autor = "Sandro Botticelli";
              año = "1485";
              descripcionLarga = "Una de las obras más emblemáticas del Renacimiento italiano, representa el nacimiento de Venus emergiendo del mar. Es celebrada por su belleza y simbolismo mitológico.";
              break;
            case "persistencia.jpg":
              autor = "Salvador Dalí";
              año = "1931";
              descripcionLarga = "Esta obra surrealista muestra relojes blandos derritiéndose en un paisaje onírico. Es una de las pinturas más reconocibles de Dalí y explora conceptos del tiempo y la realidad.";
              break;
            case "impresion-sol-naciente.jpg":
              autor = "Claude Monet";
              año = "1872";
              descripcionLarga = "Esta pintura dio nombre al movimiento impresionista. Representa el puerto de Le Havre al amanecer, con el sol naciente reflejándose en el agua.";
              break;
            case "almuerzo-remeros.jpg":
              autor = "Pierre-Auguste Renoir";
              año = "1880";
              descripcionLarga = "Una obra maestra del impresionismo que captura un momento de ocio burgués. La pintura muestra un grupo de amigos almorzando en una terraza junto al río Sena.";
              break;
            case "las-meninas.jpg":
              autor = "Diego Velázquez";
              año = "1656";
              descripcionLarga = "Una de las obras más importantes del Barroco español, muestra una escena compleja en el palacio real con múltiples niveles de interpretación y significado.";
              break;
            case "rendicion-breda.jpg":
              autor = "Diego Velázquez";
              año = "1634";
              descripcionLarga = "También conocida como Las Lanzas, esta obra representa la rendición de la ciudad de Breda durante la Guerra de los Ochenta Años, destacando por su composición y humanismo.";
              break;
            case "fusilamientos.jpg":
              autor = "Francisco de Goya";
              año = "1814";
              descripcionLarga = "Una dramática representación de los fusilamientos del 3 de mayo de 1808 en Madrid, es considerada una de las primeras pinturas modernas por su cruda representación de la guerra.";
              break;
            case "dora-maar.jpg":
              autor = "Pablo Picasso";
              año = "1937";
              descripcionLarga = "Un retrato cubista de Dora Maar, fotógrafa y artista que fue musa y pareja de Picasso. Muestra la técnica característica de múltiples perspectivas simultáneas.";
              break;
            case "mujer-llorando.jpg":
              autor = "Pablo Picasso";
              año = "1937";
              descripcionLarga = "Relacionada temáticamente con el Guernica, esta obra retrata el dolor y sufrimiento a través de un rostro distorsionado en el estilo cubista característico de Picasso.";
              break;
            case "broadway-boogie.jpg":
              autor = "Piet Mondrian";
              año = "1942";
              descripcionLarga = "Inspirada en el ritmo del jazz y la vida urbana de Nueva York, esta pintura representa la ciudad mediante una compleja red de líneas y cuadrados de colores.";
              break;
            case "victory-boogie.jpg":
              autor = "Piet Mondrian";
              año = "1944";
              descripcionLarga = "Última obra incompleta de Mondrian, representa una evolución de su estilo neoplasticista influenciada por el ritmo del boogie-woogie y la energía de Nueva York.";
              break;
            case "hijo-hombre.jpg":
              autor = "René Magritte";
              año = "1964";
              descripcionLarga = "Un autorretrato surrealista donde el rostro del artista está oculto por una manzana flotante, jugando con los conceptos de visibilidad y ocultamiento.";
              break;
            case "creacion-adan.jpg":
              autor = "Miguel Ángel";
              año = "1512";
              descripcionLarga = "Parte de los frescos de la Capilla Sixtina, esta imagen icónica representa el momento en que Dios da vida a Adán. Es una de las obras de arte más reconocidas de la historia.";
          }
      %>          <div class="row">
            <div class="col-lg-7">
              <div class="d-flex justify-content-center align-items-center h-100">
                <img src="<%= producto.getImagen() %>" alt="<%= producto.getDescripcion() %>" class="img-fluid obra-img">
              </div>
            </div>
            <div class="col-lg-5">
              <div class="info-obra">
                <h1 class="mb-4"><%= producto.getDescripcion() %></h1>
                <h3 class="text-muted">Por <%= autor %></h3>
                <p class="lead">Año: <%= año %></p>
                <p class="lead">Movimiento artístico: <%= categoria %></p>
                <p><%= descripcionLarga %></p>
                <hr>
                <h4 class="mb-3">Precio: <%= producto.getPrecio() %>€</h4>
                <% if (producto.getStock() > 0) { %>
                  <div class="input-group mb-3" style="max-width: 200px;">
                    <input type="number" class="form-control" id="cantidadProducto" min="1" max="<%= producto.getStock() %>" value="1">
                    <button class="btn btn-primary" onclick="anyadirProducto('<%= producto.getCodigo() %>', '<%= producto.getDescripcion() %>', parseInt(document.getElementById('cantidadProducto').value))" data-i18n="comprar">
                      Comprar
                    </button>
                  </div>
                  <small class="text-muted">Disponibles: <%= producto.getStock() %> unidades</small>
                <% } else { %>
                  <p class="text-danger" data-i18n="sinStock">Sin stock</p>
                <% } %>
              </div>
            </div>
          </div>
      <% } else { %>
          <div class="alert alert-danger">
            Producto no encontrado.
          </div>
      <% } %>
    </div>

    <hr>
    <mi-footer></mi-footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="./scripts/menu.js"></script>
    <script src="./scripts/footer.js"></script>
    <script src="./scripts/carrito.js"></script>
    <script src="./scripts/translations.js"></script>
    <script src="./scripts/i18n.js"></script>
  </body>
</html>
