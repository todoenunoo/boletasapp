document.addEventListener("DOMContentLoaded", () => {
  const productSelect = document.getElementById("product-select");
  const cartList = document.getElementById("cart-list");
  const totalPrice = document.getElementById("total-price");
  const boletaForm = document.getElementById("boleta-form");
  const sendEmailForm = document.getElementById("send-email-form");
  const pdfFileInput = document.getElementById("pdf-file");
  const customerAddressInput = document.getElementById("customer-address");

  // Cargar productos desde localStorage
  const products = JSON.parse(localStorage.getItem("products")) || [];

  function loadProducts() {
    productSelect.innerHTML = '<option value="">Selecciona un producto</option>';
    products.forEach((product, index) => {
      const option = document.createElement("option");
      option.value = index;
      option.textContent = `${product.name} - $${product.price}`;
      productSelect.appendChild(option);
    });
  }

  loadProducts();

  const cart = [];

  boletaForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const selectedIndex = productSelect.value;
    const quantity = parseInt(document.getElementById("product-quantity").value);
    const customerAddress = customerAddressInput.value.trim();

    if (selectedIndex === "" || quantity <= 0 || !customerAddress) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const product = products[selectedIndex];
    cart.push({ ...product, quantity });

    updateCart();
    updateTotal();
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

  sendEmailForm.addEventListener("submit", (e) => {
    const customerAddress = customerAddressInput.value.trim();

    const content = `Boleta de Compra\n\n` +
                    `Dirección del Cliente: ${customerAddress}\n\n` +
                    `Productos:\n` +
                    cart.map(item => `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`).join("\n") +
                    `\n\nTotal: $${totalPrice.textContent}`;

    const blob = new Blob([content], { type: "text/plain" });
    const file = new File([blob], "boleta.txt", { type: "text/plain" });

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    pdfFileInput.files = dataTransfer.files;
  });
});
