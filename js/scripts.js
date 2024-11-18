document.addEventListener("DOMContentLoaded", () => {
  const productSelect = document.getElementById("product-select");
  const cartList = document.getElementById("cart-list");
  const totalPrice = document.getElementById("total-price");
  const boletaForm = document.getElementById("boleta-form");
  const sendEmailForm = document.getElementById("send-email-form");
  const pdfFileInput = document.getElementById("pdf-file");
  const emailAddressInput = document.getElementById("email-address");

  // Cargar productos desde localStorage
  const products = JSON.parse(localStorage.getItem("products")) || [];
  
  // Cargar los productos en el dropdown
  products.forEach((product, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = `${product.name} - $${product.price}`;
    productSelect.appendChild(option);
  });

  const cart = [];

  // Agregar productos al carrito
  boletaForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const selectedIndex = productSelect.value;
    const quantity = parseInt(document.getElementById("product-quantity").value);
    const product = products[selectedIndex];
    const customerAddress = document.getElementById("customer-address").value;

    if (quantity > 0) {
      cart.push({ ...product, quantity });
      updateCart();
      updateTotal();

      // Al enviar la boleta, generamos el PDF y lo preparamos para el envío
      generateBoletaPdf(customerAddress);
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

  function generateBoletaPdf(customerAddress) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Título de la boleta
    doc.setFontSize(16);
    doc.text("Boleta de Compra", 20, 10);

    // Direccion del cliente
    doc.setFontSize(12);
    doc.text(`Dirección: ${customerAddress}`, 20, 20);

    // Lista de productos
    let y = 30;
    let total = 0;
    cart.forEach((item) => {
      const line = `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`;
      doc.text(line, 20, y);
      y += 10;
      total += item.price * item.quantity;
    });

    // Total final
    doc.text(`Total: $${total.toFixed(2)}`, 20, y);

    // Convertir el PDF a blob para enviarlo
    const pdfBlob = doc.output("blob");

    // Crear un archivo PDF y agregarlo al formulario
    const pdfFile = new File([pdfBlob], "boleta_compra.pdf", { type: "application/pdf" });
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(pdfFile);
    pdfFileInput.files = dataTransfer.files;

    // Agregar la dirección al formulario
    emailAddressInput.value = customerAddress;

    // Mostrar el formulario de envío
    sendEmailForm.style.display = "block";
    alert("Boleta generada. Ahora puedes enviarla por correo.");
  }
});
