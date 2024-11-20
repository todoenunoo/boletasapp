document.addEventListener("DOMContentLoaded", () => {
  const productSelect = document.getElementById("product-select");
  const cartList = document.getElementById("cart-list");
  const totalPrice = document.getElementById("total-price");
  const boletaForm = document.getElementById("boleta-form");
  const sendEmailForm = document.getElementById("send-email-form");
  const pdfFileInput = document.getElementById("pdf-file");
  const productFilter = document.getElementById("product-filter");

  // Cargar productos desde localStorage
  const products = JSON.parse(localStorage.getItem("products")) || [];
  console.log("Productos cargados:", products);

  // Cargar los productos en el dropdown y mostrar el stock
  function loadProducts() {
    productSelect.innerHTML = ''; // Limpiar el select
    products.forEach((product, index) => {
      const option = document.createElement("option");
      option.value = index;
      option.textContent = `${product.name} - $${product.price} - Stock: ${product.stock}`;
      productSelect.appendChild(option);
    });
  }

  loadProducts();

  // Filtrar productos
  productFilter.addEventListener("input", () => {
    const filterText = productFilter.value.toLowerCase();
    const filteredProducts = products.filter(product => product.name.toLowerCase().includes(filterText));
    productSelect.innerHTML = ''; // Limpiar el select
    filteredProducts.forEach((product, index) => {
      const option = document.createElement("option");
      option.value = index;
      option.textContent = `${product.name} - $${product.price} - Stock: ${product.stock}`;
      productSelect.appendChild(option);
    });
  });

  const cart = [];

  // Agregar productos al carrito
  boletaForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const selectedIndex = productSelect.value;
    const quantity = parseInt(document.getElementById("product-quantity").value);
    const product = products[selectedIndex];

    console.log("Producto seleccionado:", product);
    console.log("Cantidad:", quantity);

    if (quantity > 0 && quantity <= product.stock) {
      cart.push({ ...product, quantity });
      updateCart();
      updateTotal();

      // Actualizar el stock del producto
      product.stock -= quantity;
      localStorage.setItem("products", JSON.stringify(products));
      loadProducts(); // Recargar productos con el nuevo stock
    } else {
      alert("La cantidad es mayor que el stock disponible.");
    }
  });

  function updateCart() {
    cartList.innerHTML = "";
    cart.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`;
      cartList.appendChild(li);
    });
  }

  function updateTotal() {
    let total = 0;
    cart.forEach((item) => {
      total += item.price * item.quantity;
    });
    totalPrice.textContent = total.toFixed(2);
  }

  // Enviar boleta por correo
  sendEmailForm.addEventListener("submit", (e) => {
    e.preventDefault();
    alert("Boleta enviada por correo.");
  });
});
