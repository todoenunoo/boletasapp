document.addEventListener("DOMContentLoaded", () => {
  const productSelect = document.getElementById("product-select");
  const cartList = document.getElementById("cart-list");
  const totalPrice = document.getElementById("total-price");
  const boletaForm = document.getElementById("boleta-form");
  const sendEmailButton = document.getElementById("send-email");
  const sendEmailForm = document.getElementById("send-email-form");
  const boletaFileInput = document.getElementById("boleta-file");
  const boletaMessageInput = document.getElementById("boleta-message");

  const products = [
    { name: "Producto 1", price: 100 },
    { name: "Producto 2", price: 200 },
    { name: "Producto 3", price: 300 },
  ];

  let cart = [];
  let boletaCount = 1;

  // Cargar productos en el select
  products.forEach((product, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = `${product.name} - $${product.price}`;
    productSelect.appendChild(option);
  });

  // Agregar producto al carrito
  boletaForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const selectedIndex = productSelect.value;
    const quantity = parseInt(document.getElementById("product-quantity").value);
    const address = document.getElementById("customer-address").value;

    if (quantity > 0) {
      const product = products[selectedIndex];
      cart.push({ ...product, quantity, address });
      updateCart();
      updateTotal();
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
  sendEmailButton.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("El carrito está vacío.");
      return;
    }

    const address = cart[0].address; // Usar dirección del primer item
    let boletaText = `========================================\n`;
    boletaText += `           BOLETA DE COMPRA            \n`;
    boletaText += `========================================\n\n`;
    boletaText += `Dirección de Envío:\n${address}\n\n`;
    boletaText += `Productos:\n`;
    boletaText += `----------------------------------------\n`;

    cart.forEach((item) => {
      const line = `${item.name.padEnd(20)} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`;
      boletaText += `${line}\n`;
    });

    boletaText += `----------------------------------------\n`;
    boletaText += `Subtotal: $${totalPrice.textContent}\n`;
    boletaText += `========================================\n`;
    boletaText += `Total: $${totalPrice.textContent}\n`;
    boletaText += `========================================\n\n`;
    boletaText += `Gracias por su compra.\n`;

    // Crear archivo de boleta
    const boletaBlob = new Blob([boletaText], { type: "text/plain" });
    const boletaFile = new File([boletaBlob], `boleta_${boletaCount}.txt`, { type: "text/plain" });

    // Actualizar inputs del formulario
    boletaMessageInput.value = `Boleta ${boletaCount}`;
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(boletaFile);
    boletaFileInput.files = dataTransfer.files;

    // Incrementar número de boleta
    boletaCount++;

    // Enviar formulario
    sendEmailForm.submit();
  });
});
