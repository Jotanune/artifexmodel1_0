function toggleUsuario(button) {
    const fila = button.closest('tr');
    const estadoBadge = fila.querySelector('td:nth-child(4) span');
    const estadoActual = estadoBadge.textContent;
    const nuevoEstado = estadoActual === 'Activo' ? 'Inactivo' : 'Activo';
    estadoBadge.textContent = nuevoEstado;
    estadoBadge.className = `badge ${nuevoEstado === 'Activo' ? 'bg-success' : 'bg-danger'}`;
    button.textContent = nuevoEstado === 'Activo' ? 'Desactivar' : 'Activar';
    button.className = `btn ${nuevoEstado === 'Activo' ? 'btn-danger' : 'btn-success'} btn-sm`;
  }

  function editarUsuario(button) {
    const fila = button.closest('tr');
    const nombre = fila.children[1].textContent;
    const email = fila.children[2].textContent;
    const nuevoNombre = prompt('Editar Nombre:', nombre);
    const nuevoEmail = prompt('Editar Email:', email);

    if (nuevoNombre) fila.children[1].textContent = nuevoNombre;
    if (nuevoEmail) fila.children[2].textContent = nuevoEmail;
  }