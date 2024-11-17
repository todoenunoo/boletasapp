document.getElementById('product-form').addEventListener('submit', function (e) {
    e.preventDefault();
  
    const name = document.getElementById('product-name').value;
    const price = parseFloat(document.getElementById('product-price').value);
  
    let products = JSON.parse(localStorage.getItem('products')) || [];
    products.push({ name, price });
    localStorage.setItem('products', JSON.stringify(products));
  
    displayProducts();
    document.getElementById('product-form').reset();
  });
  
  function displayProducts() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
  
    const products = JSON.parse(localStorage.getItem('products')) || [];
    products.forEach((product, index) => {
      const li = document.createElement('li');
      li.textContent = `${product.name} - $${product.price.toFixed(2)} `;
      li.innerHTML += `<button onclick="deleteProduct(${index})">Eliminar</button>`;
      productList.appendChild(li);
    });
  }
  
  function deleteProduct(index) {
    let products = JSON.parse(localStorage.getItem('products'));
    products.splice(index, 1);
    localStorage.setItem('products', JSON.stringify(products));
    displayProducts();
  }
  
  document.addEventListener('DOMContentLoaded', displayProducts);
  
  emailjs.init("service_rawy53j");  // Sustituye YOUR_USER_ID con tu User ID de EmailJS

