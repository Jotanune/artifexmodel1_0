var imagenModal = document.getElementById('imagenModal');
  imagenModal.addEventListener('show.bs.modal', function (event) {
    var button = event.relatedTarget;
    var src = button.getAttribute('src');
    var modalImg = document.getElementById('imagenGrande');
    modalImg.setAttribute('src', src);
  });

document.querySelectorAll('#gallery img').forEach(img => {
  img.addEventListener('click', function () {
    const rutaImagen = img.src;
    const nombreCuadro = img.alt;

    document.getElementById('imagenGrande').src = rutaImagen;

    document.getElementById('exampleModalLabel').textContent = nombreCuadro;
  });
});