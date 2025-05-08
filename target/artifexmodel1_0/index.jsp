<%@ page language="java" contentType="text/html; charset=UTF-8" import="tienda.*" pageEncoding="UTF-8" %>
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" href="img/artifex.png" type="image/png">
    <title>Artifex</title>
    <link rel="stylesheet" href="styles/menu.css">
    <link rel="stylesheet" href="styles/footer.css">
    <link rel="stylesheet" href="styles/body.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Outfit:wght@100..900&display=swap" rel="stylesheet">
  </head>
  <body>
    <mi-menu></mi-menu>
    
    <div class="hero-section">
      <div class="container">
        <h1 class="hero-title" id="baseTitle">Bienvenido a Artifex</h1>
        <p class="hero-subtitle">Donde el arte cobra vida y transforma espacios</p>
        <a href="productos.jsp" class="hero-cta">Explorar Colección</a>
      </div>
    </div>

    <div class="container">
      <section id="about" class="section-spacing">
        <div class="row align-items-center">
          <div class="col-md-6">
            <div class="about-content">
              <h2 class="section-title">Sobre Nosotros</h2>
              <p class="section-text">En Artifex, nos apasiona el arte y creemos que un cuadro puede transformar cualquier espacio. Nuestra misión es hacer que el arte sea accesible para todos, ofreciendo una cuidadosa selección de obras que inspiran y cautivan.</p>
              <p class="section-text">Desde pinturas clásicas hasta arte moderno, cada pieza en nuestra colección ha sido elegida por su calidad y significado artístico.</p>
              <a href="empresa.html" class="section-link">Conoce nuestra historia</a>
            </div>
          </div>
          <div class="col-md-6">
            <div class="about-image">
              <img src="img/museo.jpg" class="img-fluid rounded-image" alt="Sobre Nosotros">
            </div>
          </div>
        </div>
      </section>

      <section id="featured" class="section-spacing">
        <h2 class="section-title text-center">Obras Destacadas</h2>
        <div class="featured-grid">
          <div class="featured-item">
            <img src="img/guernica.jpg" alt="Guernica" class="featured-image">
            <div class="featured-overlay">
              <h3>Guernica</h3>
              <p>Pablo Picasso</p>
            </div>
          </div>
          <div class="featured-item">
            <img src="img/noche.jpg" alt="La noche estrellada" class="featured-image">
            <div class="featured-overlay">
              <h3>La noche estrellada</h3>
              <p>Vincent van Gogh</p>
            </div>
          </div>
          <div class="featured-item">
            <img src="img/persistencia.jpg" alt="La persistencia de la memoria" class="featured-image">
            <div class="featured-overlay">
              <h3>La persistencia de la memoria</h3>
              <p>Salvador Dalí</p>
            </div>
          </div>
        </div>
      </section>

      <section id="categories" class="section-spacing">
        <h2 class="section-title text-center">Explora Nuestras Categorías</h2>
        <div class="categories-grid">
          <a href="productos.jsp?categoria=2" class="category-card">
            <div class="category-content">
              <h3>Arte Barroco</h3>
              <p>Obras maestras de los grandes maestros</p>
            </div>
          </a>
          <a href="productos.jsp?categoria=5" class="category-card">
            <div class="category-content">
              <h3>Arte Renacentista</h3>
              <p>Expresiones renacentistas del arte</p>
            </div>
          </a>
          <a href="productos.jsp?categoria=6" class="category-card">
            <div class="category-content">
              <h3>Surrealismo</h3>
              <p>Capturando la luz y el momento</p>
            </div>
          </a>
        </div>
      </section>

      <section id="testimonials" class="section-spacing">
        <h2 class="section-title text-center">Opiniones de Nuestros Clientes</h2>
        <div class="testimonials-grid">
          <div class="testimonial-card">
            <div class="testimonial-content">
              <p>"Artifex transformó mi sala con una pintura increíble. El proceso de selección y compra fue impecable."</p>
              <div class="testimonial-author">
                <img src="img/persona1.webp" alt="María López" class="testimonial-avatar">
                <div>
                  <h4>Mario López</h4>
                  <span>Cliente desde 2023</span>
                </div>
              </div>
            </div>
          </div>
          <div class="testimonial-card">
            <div class="testimonial-content">
              <p>"La calidad de las obras y la atención al cliente son excepcionales. Cada visita a la galería es una experiencia única."</p>
              <div class="testimonial-author">
                <img src="img/persona2.webp" alt="Carlos Martínez" class="testimonial-avatar">
                <div>
                  <h4>Carlos Martínez</h4>
                  <span>Cliente desde 2022</span>
                </div>
              </div>
            </div>
          </div>
          <div class="testimonial-card">
            <div class="testimonial-content">
              <p>"El cuadro personalizado que pedí superó todas mis expectativas. El equipo de Artifex entendió perfectamente mi visión."</p>
              <div class="testimonial-author">
                <img src="img/persona3.webp" alt="Laura Gómez" class="testimonial-avatar">
                <div>
                  <h4>Luis Gómez</h4>
                  <span>Cliente desde 2024</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact-preview" class="section-spacing">
        <div class="contact-preview-content text-center">
          <h2 class="section-title">¿Tienes alguna pregunta?</h2>
          <p class="section-text">Estamos aquí para ayudarte a encontrar la obra perfecta para tu espacio</p>
          <a href="contacto.html" class="contact-cta">Contáctanos</a>
        </div>
      </section>
    </div>

    <hr class="section-divider">
    <mi-footer></mi-footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
    <script src="./scripts/menu.js"></script>
    <script src="./scripts/footer.js"></script>
    <script src="./scripts/carrito.js"></script>
    <script src="./scripts/imagen.js"></script>
  </body>
</html>
