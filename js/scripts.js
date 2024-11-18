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
    doc.text("Boleta de Compra", 105, 10, null, null, "center");

    // Dirección del cliente
    doc.setFontSize(12);
    doc.text(`Dirección: ${customerAddress}`, 20, 20);

    // Crear una línea divisoria
    doc.setLineWidth(0.5);
    doc.line(20, 25, 190, 25);  // Dibuja una línea horizontal

    // Encabezado de la tabla de productos
    let y = 30;
    doc.setFontSize(12);

    // Centrar los encabezados de la tabla
    doc.text("Producto", 40, y);
    doc.text("Cantidad", 100, y);
    doc.text("Precio Unitario", 140, y);
    doc.text("Subtotal", 180, y);
    y += 10;

    // Línea divisoria para la cabecera de la tabla
    doc.line(20, y, 190, y);
    y += 5;

    // Lista de productos
    let total = 0;
    cart.forEach((item) => {
      const productName = item.name;
      const quantity = item.quantity;
      const priceUnit = item.price;
      const subtotal = priceUnit * quantity;

      // Centramos el texto de cada producto, cantidad, precio unitario y subtotal
      const productWidth = 40;
      const quantityWidth = 100;
      const priceWidth = 140;
      const subtotalWidth = 180;

      doc.text(productName, productWidth, y, null, null, "center");
      doc.text(quantity.toString(), quantityWidth, y, null, null, "center");
      doc.text(`$${priceUnit.toFixed(2)}`, priceWidth, y, null, null, "center");
      doc.text(`$${subtotal.toFixed(2)}`, subtotalWidth, y, null, null, "center");
      y += 10;
      total += subtotal;

      // Líneas divisorias por producto (verticales)
      doc.setLineWidth(0.5);
      doc.line(productWidth, y - 10, productWidth, y); // Línea vertical entre Producto y Cantidad
      doc.line(quantityWidth, y - 10, quantityWidth, y); // Línea vertical entre Cantidad y Precio Unitario
      doc.line(priceWidth, y - 10, priceWidth, y); // Línea vertical entre Precio Unitario y Subtotal
      doc.line(subtotalWidth, y - 10, subtotalWidth, y); // Línea vertical entre Subtotal y el final

      // Línea divisoria por cada producto
      doc.line(20, y, 190, y);
      y += 5;
    });

    // Línea divisoria antes del total
    doc.line(20, y, 190, y);
    y += 10;

    // Total final
    doc.setFontSize(14);
    doc.text(`Total: $${total.toFixed(2)}`, 120, y);

    // Crear línea divisoria al final
    doc.line(20, y + 5, 190, y + 5); // Línea debajo del total

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
