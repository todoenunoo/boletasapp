document.addEventListener("DOMContentLoaded", () => {
  const productSelect = document.getElementById("product-select");
  const cartList = document.getElementById("cart-list");
  const totalPrice = document.getElementById("total-price");
  const boletaForm = document.getElementById("boleta-form");
  const sendEmailButton = document.getElementById("send-email");
  const sendEmailForm = document.getElementById("send-email-form");
  const pdfFileInput = document.getElementById("pdf-file");

  // Cargar productos desde localStorage
  const products = JSON.parse(localStorage.getItem("products")) || [];
  console.log("Productos cargados:", products);  // Depuración

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

    console.log("Producto seleccionado:", product);  // Depuración
    console.log("Cantidad:", quantity);  // Depuración

    if (quantity > 0) {
      cart.push({ ...product, quantity });
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

  // Generar el cuerpo del correo
  function generateEmailBody() {
    let emailBody = `
      <h2>Boleta de Compra</h2>
      <p><strong>Gracias por tu compra. A continuación, se detalla tu boleta:</strong></p>
      <table border="1" cellpadding="10" cellspacing="0" style="width: 100%; margin-bottom: 20px;">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>`;

    // Agregar los productos al cuerpo del correo
    cart.forEach(item => {
      emailBody += `
        <tr>
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>$${item.price}</td>
          <td>$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>`;
    });

    emailBody += `</tbody></table>`;

    // Total de la compra
    emailBody += `<p><strong>Total de la Compra: $${totalPrice.textContent}</strong></p>`;

    // Dirección de envío
    emailBody += `<p><strong>Dirección de Envío:</strong> Calle Ficticia 123, Ciudad, País</p>`;

    // Mensaje adicional
    emailBody += `<p><strong>Gracias por tu preferencia. ¡Esperamos verte pronto!</strong></p>
                  <p>Este es un correo automatizado, por favor no respondas.</p>`;

    return emailBody;
  }

  // Función para enviar el correo
  sendEmailButton.addEventListener("click", function(event) {
    event.preventDefault();

    // Generar el cuerpo del correo
    const emailBody = generateEmailBody();

    // Asignar el cuerpo generado al campo 'body' del formulario
    document.getElementById('email-body').value = emailBody;

    // Enviar el formulario
    sendEmailForm.submit();
  });

  // Mostrar el formulario de envío después de generar el PDF
  sendEmailForm.style.display = "none";  // Escondido inicialmente
});
