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
    doc.text("BOLETA DE COMPRA", 20, 10);

    // Direccion del cliente
    doc.setFontSize(12);
    doc.text(`DIRECCIÓN: ${customerAddress.toUpperCase()}`, 20, 20);  // Dirección en mayúsculas

    // Lista de productos
    let y = 30;  // Iniciamos desde 30 en el eje Y
    let total = 0;

    // Definir las posiciones de los encabezados
    const headerX = 20;
    const quantityX = 90;  // Posición de la columna de cantidad
    const unitPriceX = 120; // Posición de la columna de precio unitario
    const subtotalX = 160; // Posición de la columna de subtotal

    // Título de las columnas
    doc.setFontSize(12);
    doc.text("PRODUCTO", headerX, y);
    doc.text("CANTIDAD", quantityX, y);
    doc.text("PRECIO UNITARIO", unitPriceX, y);
    doc.text("SUBTOTAL", subtotalX, y);

    y += 10;  // Espacio después de los encabezados

    // Divisores verticales
    doc.setDrawColor(0, 0, 0);  // Color de las líneas
    doc.line(headerX, y, headerX, y + 50);
    doc.line(quantityX, y, quantityX, y + 50);
    doc.line(unitPriceX, y, unitPriceX, y + 50);
    doc.line(subtotalX, y, subtotalX, y + 50);

    // Imprimir productos
    cart.forEach((item) => {
      const productLine = `${item.name.toUpperCase()}`;
      const quantityLine = `${item.quantity}`;
      const unitPriceLine = `$${item.price.toFixed(2)}`;
      const subtotalLine = `$${(item.price * item.quantity).toFixed(2)}`;
      
      // Mostrar productos y precios
      doc.text(productLine, headerX, y + 10);
      doc.text(quantityLine, quantityX, y + 10);
      doc.text(unitPriceLine, unitPriceX, y + 10);
      doc.text(subtotalLine, subtotalX, y + 10);

      // Actualizar la posición vertical
      y += 10;
      total += item.price * item.quantity;
    });

    // Agregar divisores después de cada producto
    doc.line(headerX, y, headerX, y + 20);
    doc.line(quantityX, y, quantityX, y + 20);
    doc.line(unitPriceX, y, unitPriceX, y + 20);
    doc.line(subtotalX, y, subtotalX, y + 20);

    // Subtotal
    doc.text("SUBTOTAL", headerX, y + 10);
    doc.text(`$${total.toFixed(2)}`, subtotalX, y + 10);

    // Total
    y += 20;
    doc.text("TOTAL", headerX, y);
    doc.text(`$${total.toFixed(2)}`, subtotalX, y, { align: "right" });  // Total a la derecha

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
