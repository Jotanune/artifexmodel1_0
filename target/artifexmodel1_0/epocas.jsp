<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Épocas Artísticas - Artifex</title>
    <link rel="icon" href="./img/artifex.png" type="image/png">    <link rel="stylesheet" href="./styles/menu.css">
    <link rel="stylesheet" href="./styles/body.css">
    <link rel="stylesheet" href="./styles/footer.css">
    <link rel="stylesheet" href="./styles/epocas.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet">    <link href="https://fonts.googleapis.com/css2?family=DM+Sans&family=Outfit&family=EB+Garamond:wght@400;600&family=Cormorant+Garamond:wght@400;600&family=Oswald:wght@400;700&family=Montserrat:wght@400;800&family=Poiret+One&display=swap" rel="stylesheet">    <script>
        // Manejo mejorado de animaciones con Intersection Observer
        document.addEventListener('DOMContentLoaded', function() {
            const sections = document.querySelectorAll('section');
            const observerOptions = {
                root: null,
                threshold: 0.2, // Reducido para activar antes la animación
                rootMargin: '-50px 0px' // Margen negativo para activar un poco antes
            };

            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        // No desactivar el observer para mantener las animaciones al volver a la sección
                    } else {
                        // Opcional: descomentar la siguiente línea si quieres que las animaciones
                        // se repitan cada vez que la sección entre en vista
                        // entry.target.classList.remove('active');
                    }
                });
            }, observerOptions);

            sections.forEach(section => {
                // Asegurarse de que las secciones empiecen sin la clase active
                section.classList.remove('active');
                observer.observe(section);
            });

            // Comprobar si el usuario prefiere reducir el movimiento
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
            if (prefersReducedMotion.matches) {
                sections.forEach(section => section.classList.add('active'));
            }
        });
    </script>
  </head>
<body class="epocas-page">
    <mi-menu></mi-menu>

    <div class="timeline-bar">
        <div class="timeline-line"></div>
        <div class="timeline-marker"></div>
        <div class="timeline-dates">
            <div class="timeline-date" data-section="renacimiento">S. XV-XVI</div>
            <div class="timeline-date" data-section="barroco">S. XVII-XVIII</div>
            <div class="timeline-date" data-section="expresionismo">S. XIX-XX</div>
            <div class="timeline-date" data-section="cubismo">S. XX</div>
            <div class="timeline-date" data-section="surrealismo">1924-1966</div>
        </div>
    </div>

    <main>
        <!-- Renacimiento -->
        <section id="renacimiento" class="vh-100 d-flex align-items-center">
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-md-6">
                        <h2 class="display-4" data-i18n="renacimiento">Renacimiento</h2>
                        <h3 class="h5 text-muted mb-4" data-i18n="renacimientoFecha">Siglos XV-XVI</h3>
                        <p class="lead" data-i18n="renacimientoDesc">
                            Período de renovación artística y cultural que marcó la transición entre la Edad Media y la Edad Moderna. 
                            Caracterizado por un renovado interés en la antigüedad clásica, el humanismo y la perspectiva.
                        </p>
                        <a href="productos.jsp?categoria=5" class="btn btn-primary mt-3" data-i18n="verObras">Ver obras de esta época</a>
                    </div>
                    <div class="col-md-6">
                        <figure class="obra-destacada">
                            <img 
                                src="./img/creacion-adan.jpg" 
                                alt="La Creación de Adán de Miguel Ángel - Fresco icónico de la Capilla Sixtina que representa el momento en que Dios da vida a Adán" 
                                class="img-fluid rounded shadow"
                                loading="lazy"
                                width="1200"
                                height="800"
                            >
                            <figcaption class="text-center mt-2 text-muted">
                                <small data-i18n="creacionadancaption">La Creación de Adán - Miguel Ángel (1512)</small>
                            </figcaption>
                        </figure>
                    </div>
                </div>
            </div>
        </section>

        <!-- Barroco -->
        <section id="barroco" class="vh-100 d-flex align-items-center">
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-md-6 order-md-2">
                        <h2 class="display-4" data-i18n="barroco">Barroco</h2>
                        <h3 class="h5 text-muted mb-4" data-i18n="barrocoFecha">Siglos XVII-XVIII</h3>
                        <p class="lead" data-i18n="barrocoDesc">
                            Estilo artístico que enfatiza el dramatismo, el movimiento y el contraste. 
                            Se caracteriza por su grandiosidad, teatralidad y el uso intenso del claroscuro.
                        </p>
                        <a href="productos.jsp?categoria=2" class="btn btn-primary mt-3" data-i18n="verObras">Ver obras de esta época</a>
                    </div>
                    <div class="col-md-6 order-md-1">
                        <figure class="obra-destacada">
                            <img 
                                src="./img/las-meninas.jpg" 
                                alt="Las Meninas de Diego Velázquez - Obra maestra del Barroco español que representa a la infanta Margarita acompañada de sus damas de honor" 
                                class="img-fluid rounded shadow"
                                loading="lazy"
                                width="1200"
                                height="800"
                            >
                            <figcaption class="text-center mt-2 text-muted">
                                <small data-i18n="lasmeninascaption">Las Meninas - Diego Velázquez (1656)</small>
                            </figcaption>
                        </figure>
                    </div>
                </div>
            </div>
        </section>

        <!-- Expresionismo -->
        <section id="expresionismo" class="vh-100 d-flex align-items-center">
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-md-6">
                        <h2 class="display-4" data-i18n="expresionismo">Expresionismo / Postimpresionismo</h2>
                        <h3 class="h5 text-muted mb-4" data-i18n="expresionismoFecha">Finales del siglo XIX - Principios del XX</h3>
                        <p class="lead" data-i18n="expresionismoDesc">
                            Movimientos que priorizaron la expresión emocional y la interpretación subjetiva de la realidad. 
                            Se caracteriza por el uso intenso del color y la distorsión de las formas.
                        </p>
                        <a href="productos.jsp?categoria=1" class="btn btn-primary mt-3" data-i18n="verObras">Ver obras de esta época</a>
                    </div>
                    <div class="col-md-6">
                        <figure class="obra-destacada">
                            <img 
                                src="./img/el-grito.jpg" 
                                alt="El Grito de Edvard Munch - Obra icónica del expresionismo que representa la angustia existencial del ser humano" 
                                class="img-fluid rounded shadow"
                                loading="lazy"
                                width="1200"
                                height="800"
                            >
                            <figcaption class="text-center mt-2 text-muted">
                                <small data-i18n="elgritocaption">El Grito - Edvard Munch (1893)</small>
                            </figcaption>
                        </figure>
                    </div>
                </div>
            </div>
        </section>

        <!-- Cubismo -->
        <section id="cubismo" class="vh-100 d-flex align-items-center">
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-md-6 order-md-2">
                        <h2 class="display-4" data-i18n="cubismo">Cubismo</h2>
                        <h3 class="h5 text-muted mb-4" data-i18n="cubismoFecha">Principios del siglo XX</h3>
                        <p class="lead" data-i18n="cubismoDesc">
                            Revolución artística que rompió con la perspectiva tradicional, representando objetos desde múltiples ángulos simultáneamente. 
                            Marcó el inicio del arte moderno.
                        </p>
                        <a href="productos.jsp?categoria=3" class="btn btn-primary mt-3" data-i18n="verObras">Ver obras de esta época</a>
                    </div>
                    <div class="col-md-6 order-md-1">
                        <figure class="obra-destacada">
                            <img 
                                src="./img/guernica.jpg" 
                                alt="Guernica de Pablo Picasso - Obra maestra del cubismo que representa el bombardeo de Guernica durante la Guerra Civil Española" 
                                class="img-fluid rounded shadow"
                                loading="lazy"
                                width="1200"
                                height="800"
                            >
                            <figcaption class="text-center mt-2 text-muted">
                                <small data-i18n="guernicacaption">Guernica - Pablo Picasso (1937)</small>
                            </figcaption>
                        </figure>
                    </div>
                </div>
            </div>
        </section>

        <!-- Surrealismo -->
        <section id="surrealismo" class="vh-100 d-flex align-items-center">
            <div class="container">
                <div class="row align-items-center">
                    <div class="col-md-6">
                        <h2 class="display-4" data-i18n="surrealismo">Surrealismo</h2>
                        <h3 class="h5 text-muted mb-4" data-i18n="surrealismoFecha">1924-1966</h3>
                        <p class="lead" data-i18n="surrealismoDesc">
                            Movimiento que exploró el subconsciente y los sueños, creando imágenes oníricas y fantásticas. 
                            Buscaba liberar la mente de las restricciones de la racionalidad.
                        </p>
                        <a href="productos.jsp?categoria=6" class="btn btn-primary mt-3" data-i18n="verObras">Ver obras de esta época</a>
                    </div>
                    <div class="col-md-6">
                        <figure class="obra-destacada">
                            <img 
                                src="./img/persistencia.jpg" 
                                alt="La persistencia de la memoria de Salvador Dalí - Obra surrealista que representa relojes blandos en un paisaje onírico" 
                                class="img-fluid rounded shadow"
                                loading="lazy"
                                width="1200"
                                height="800"
                            >
                            <figcaption class="text-center mt-2 text-muted">
                                <small data-i18n="persistenciacaption">La persistencia de la memoria - Salvador Dalí (1931)</small>
                            </figcaption>
                        </figure>
                    </div>
                </div>
            </div>
        </section>
    </main>

    <mi-footer></mi-footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="./scripts/menu.js"></script>
    <script src="./scripts/footer.js"></script>
    <script src="./scripts/translations.js"></script>
    <script src="./scripts/i18n.js"></script>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const timelineMarker = document.querySelector('.timeline-marker');
            const timelineDates = document.querySelectorAll('.timeline-date');
            const sections = document.querySelectorAll('section');
            
            function updateTimeline() {
                const windowHeight = window.innerHeight;
                const scrollPosition = window.scrollY;
                const documentHeight = document.documentElement.scrollHeight - windowHeight;
                const scrollPercentage = (scrollPosition / documentHeight) * 100;
                
                // Actualizar posición del marcador
                timelineMarker.style.top = `${Math.min(85, Math.max(15, scrollPercentage))}%`;
                
                // Actualizar fechas activas
                sections.forEach((section, index) => {
                    const rect = section.getBoundingClientRect();
                    const isVisible = rect.top < windowHeight/2 && rect.bottom > windowHeight/2;
                    
                    if (isVisible) {
                        timelineDates.forEach(date => date.classList.remove('active'));
                        timelineDates[index].classList.add('active');
                    }
                });
            }
            
            window.addEventListener('scroll', updateTimeline);
            updateTimeline(); // Inicializar posición
        });
    </script>
</body>
</html>
