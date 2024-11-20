document.addEventListener("DOMContentLoaded", () => {
  const productForm = document.getElementById("product-form");
  const productList = document.getElementById("product-list");
  let products = JSON.parse(localStorage.getItem("products")) || [];

  // Mostrar productos
  function displayProducts() {
    productList.innerHTML = "";
    products.forEach((product, index) => {
      const li = document.createElement("li");
      li.textContent = `${product.name} - $${product.price} (Stock: ${product.stock})`;
      const editButton = document.createElement("button");
      editButton.textContent = "Editar Stock";
      editButton.addEventListener("click", () => editStock(index));
      li.appendChild(editButton);
      productList.appendChild(li);
    });
  }

  // Agregar producto
  productForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("product-name").value;
    const price = parseFloat(document.getElementById("product-price").value);
    const stock = parseInt(document.getElementById("product-stock").value);
    products.push({ name, price, stock });
    localStorage.setItem("products", JSON.stringify(products));
    displayProducts();
  });

  // Editar stock
  function editStock(index) {
    const newStock = parseInt(prompt("Nuevo stock:", products[index].stock));
    if (!isNaN(newStock)) {
      products[index].stock = newStock;
      localStorage.setItem("products", JSON.stringify(products));
      displayProducts();
    }
  }

  displayProducts();
});
