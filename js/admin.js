document.addEventListener('DOMContentLoaded', function () {
  // Variables
  const productForm = document.getElementById('product-form');
  const productNameInput = document.getElementById('product-name');
  const productPriceInput = document.getElementById('product-price');
  const productList = document.getElementById('product-list');

  // Cargar productos del localStorage y mostrarlos
  function displayProducts() {
    // Obtener productos del localStorage
    const products = JSON.parse(localStorage.getItem('products')) || [];
    
    // Limpiar la lista
    productList.innerHTML = '';
    
    // Mostrar productos
    products.forEach((product, index) => {
      const li = document.createElement('li');
      li.textContent = `${product.name} - $${product.price.toFixed(2)} `;
      li.innerHTML += `<button onclick="deleteProduct(${index})">Eliminar</button>`;
      productList.appendChild(li);
    });
  }

  // Función para agregar un producto
  productForm.addEventListener('submit', function (e) {
    e.preventDefault();  // Evitar recarga de página al enviar el formulario
    
    const name = productNameInput.value;
    const price = parseFloat(productPriceInput.value);
    
    if (!name || isNaN(price)) {
      alert("Por favor, ingrese el nombre y el precio del producto.");
      return;
    }

    // Obtener productos existentes y agregar el nuevo
    let products = JSON.parse(localStorage.getItem('products')) || [];
    products.push({ name, price });
    
    // Guardar productos en localStorage
    localStorage.setItem('products', JSON.stringify(products));

    // Limpiar los campos
    productNameInput.value = '';
    productPriceInput.value = '';

    // Actualizar la lista de productos
    displayProducts();
  });

  // Función para eliminar un producto
  window.deleteProduct = function (index) {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    
    // Eliminar el producto por índice
    products.splice(index, 1);

    // Guardar cambios en localStorage
    localStorage.setItem('products', JSON.stringify(products));

    // Actualizar la lista de productos
    displayProducts();
  };

  // Mostrar los productos cuando la página se carga
  displayProducts();
});
