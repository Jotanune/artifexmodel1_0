
function cambiarEstado(button, estado) {
    const fila = button.closest('tr');
    const estadoBadge = fila.querySelector('td:nth-child(5) span');
    estadoBadge.textContent = estado;
    estadoBadge.className = `badge ${estado === 'Completado' ? 'bg-success' : 'bg-danger'}`;
  }

  function buscarPedido() {
    const input = document.getElementById('buscarPedido').value.toLowerCase();
    const filas = document.querySelectorAll('#tablaPedidos tr');

    filas.forEach(fila => {
      const comprador = fila.children[1].textContent.toLowerCase();
      fila.style.display = comprador.includes(input) ? '' : 'none';
    });
  }

