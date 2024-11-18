document.addEventListener("DOMContentLoaded", () => {
  const productList = document.getElementById("product-list");
  const addProductForm = document.getElementById("add-product-form");
  const nameInput = document.getElementById("product-name");
  const priceInput = document.getElementById("product-price");

  let products = JSON.parse(localStorage.getItem("products")) || [];

  function renderProducts() {
    productList.innerHTML = "";
    products.forEach((product, index) => {
      const li = document.createElement("li");
      li.textContent = `${product.name} - $${product.price}`;
      const editButton = document.createElement("button");
      editButton.textContent = "Editar";
      editButton.onclick = () => editProduct(index);
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Eliminar";
      deleteButton.onclick = () => deleteProduct(index);
      li.appendChild(editButton);
      li.appendChild(deleteButton);
      productList.appendChild(li);
    });
  }

  function saveProducts() {
    localStorage.setItem("products", JSON.stringify(products));
  }

  function addProduct(name, price) {
    products.push({ name, price });
    saveProducts();
    renderProducts();
  }

  function editProduct(index) {
    const newName = prompt("Nuevo nombre:", products[index].name);
    const newPrice = parseFloat(prompt("Nuevo precio:", products[index].price));
    if (newName && !isNaN(newPrice)) {
      products[index].name = newName;
      products[index].price = newPrice;
      saveProducts();
      renderProducts();
    }
  }

  function deleteProduct(index) {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
      products.splice(index, 1);
      saveProducts();
      renderProducts();
    }
  }

  addProductForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = nameInput.value.trim();
    const price = parseFloat(priceInput.value.trim());
    if (name && !isNaN(price)) {
      addProduct(name, price);
      nameInput.value = "";
      priceInput.value = "";
    }
  });

  renderProducts();
});
