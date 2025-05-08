document.addEventListener('DOMContentLoaded', () => {
    class ProductManager {
      constructor() {
        this.defaultProducts = [
          { name: 'El grito', price: 300 },
          { name: 'La joven de la perla', price: 400 },
          { name: 'La noche estrellada', price: 500 },
          { name: 'Guernica', price: 600 },
          { name: 'Composition VIII', price: 350 },
          { name: 'Composición en rojo, azul y amarillo', price: 450 },
          { name: 'El nacimiento de Venus', price: 700 },
          { name: 'La persistencia de la memoria', price: 1000 }
        ];
        
        this.products = JSON.parse(localStorage.getItem('products')) || [];
        this.initializeDefaultProducts();
        this.currentEditId = null;
        this.initEventListeners();
        this.renderProducts();
      }
  
      initializeDefaultProducts() {
        if (this.products.length === 0) {
          this.defaultProducts.forEach((product, index) => {
            this.products.push({
              id: (Date.now() - index).toString(),
              name: product.name,
              price: product.price
            });
          });
          this.saveProducts();
        }
      }
  
      // El resto de los métodos permanecen igual
      initEventListeners() {
        document.getElementById('productForm').addEventListener('submit', (e) => this.handleSubmit(e));
        document.getElementById('productList').addEventListener('click', (e) => this.handleTableActions(e));
      }
  
      saveProducts() {
        localStorage.setItem('products', JSON.stringify(this.products));
      }
  
      renderProducts() {
        const tbody = document.getElementById('productList');
        tbody.innerHTML = this.products.map(product => `
          <tr data-id="${product.id}">
            <td class="align-middle">${product.name}</td>
            <td class="align-middle">$${product.price.toFixed(2)}</td>
            <td class="text-center align-middle">
              <button class="btn btn-warning btn-sm btn-action edit-btn">Editar</button>
              <button class="btn btn-danger btn-sm btn-action delete-btn">Eliminar</button>
            </td>
          </tr>
        `).join('');
      }
  
      handleSubmit(e) {
        e.preventDefault();
        
        const nameInput = document.getElementById('productName');
        const priceInput = document.getElementById('productPrice');
        
        try {
          if (!nameInput.value.trim() || !priceInput.value) {
            throw new Error('Todos los campos son requeridos');
          }
  
          const newProduct = {
            id: this.currentEditId || Date.now().toString(),
            name: nameInput.value.trim(),
            price: parseFloat(priceInput.value)
          };
  
          if (isNaN(newProduct.price)) {
            throw new Error('El precio debe ser un número válido');
          }
  
          if (this.currentEditId) {
            const index = this.products.findIndex(p => p.id === this.currentEditId);
            this.products[index] = newProduct;
            this.showAlert('Producto actualizado correctamente', 'success');
          } else {
            this.products.push(newProduct);
            this.showAlert('Producto agregado correctamente', 'success');
          }
  
          this.saveProducts();
          this.renderProducts();
          this.resetForm();
        } catch (error) {
          this.showAlert(error.message, 'danger');
        }
      }
  
      handleTableActions(e) {
        const row = e.target.closest('tr');
        if (!row) return;
  
        const productId = row.dataset.id;
        const product = this.products.find(p => p.id === productId);
  
        if (e.target.classList.contains('delete-btn')) {
          if (confirm('¿Estás seguro de eliminar este producto?')) {
            this.products = this.products.filter(p => p.id !== productId);
            this.saveProducts();
            this.renderProducts();
            this.showAlert('Producto eliminado correctamente', 'info');
          }
        }
  
        if (e.target.classList.contains('edit-btn')) {
          this.handleEdit(product);
        }
      }
  
      handleEdit(product) {
        document.getElementById('productName').value = product.name;
        document.getElementById('productPrice').value = product.price;
        this.currentEditId = product.id;
        document.querySelector('#productForm button[type="submit"]').textContent = 'Guardar Cambios';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
  
      resetForm() {
        document.getElementById('productForm').reset();
        this.currentEditId = null;
        document.querySelector('#productForm button[type="submit"]').textContent = 'Agregar Producto';
      }
  
      showAlert(message, type) {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type} alert-dismissible fade show fixed-top mt-5`;
        alert.style = `
          max-width: 500px; 
          margin: 20px auto; 
          z-index: 1050; /* Asegura que esté por encima del menú */
        `;
        alert.innerHTML = `
          ${message}
          <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.prepend(alert);
        
        setTimeout(() => {
          alert.remove();
        }, 5000);
      }
    }
  
    // Inicializar el administrador de productos
    new ProductManager();
  });

  function buscarProducto() {
    const input = document.getElementById('buscarProducto').value.toLowerCase();
    const filas = document.querySelectorAll('#productList tr');

    filas.forEach(fila => {
      const nombreProducto = fila.children[0].textContent.toLowerCase();
      fila.style.display = nombreProducto.includes(input) ? '' : 'none';
    });
  }