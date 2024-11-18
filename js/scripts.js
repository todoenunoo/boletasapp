document.addEventListener("DOMContentLoaded", () => {
  const productSelect = document.getElementById("product-select");
  const cartList = document.getElementById("cart-list");
  const totalPrice = document.getElementById("total-price");
  const boletaForm = document.getElementById("boleta-form");
  const sendEmailForm = document.getElementById("send-email-form");
  const emailMessage = document.getElementById("email-message");
  const sendEmailButton = document.getElementById("send-email");

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
    const customerAddress = document.getElementById("customer-address").value;

    console.log("Producto seleccionado:", product);  // Depuración
    console.log("Cantidad:", quantity);  // Depuración
    console.log("Dirección del Cliente:", customerAddress);  // Depuración

    if (quantity > 0) {
      cart.push({ ...product, quantity });
      updateCart();
      updateTotal();

      // Almacenar la dirección y detalles del carrito en el mensaje
      emailMessage.value = generateEmailMessage(cart, customerAddress);
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

  // Función para generar el mensaje del correo
  function generateEmailMessage(cart, customerAddress) {
    let message = "Gracias por tu compra. A continuación, se detalla tu boleta:\n\n";
    cart.forEach((item) => {
      message += `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}\n`;
    });
    message += `\nTotal de la Compra: $${totalPrice.textContent}\n`;
    message += `Dirección de Envío: ${customerAddress}\n`;
    message += "\nEste es un correo automatizado, por favor no respondas.\n";
    return message;
  }

  // Enviar la boleta por correo cuando se haga clic en el botón
  sendEmailButton.addEventListener("click", () => {
    if (cart.length > 0) {
      sendEmailForm.style.display = "block";  // Mostrar el formulario de envío
      sendEmailForm.submit();  // Enviar el formulario con los datos
    } else {
      alert("Por favor, agrega productos al carrito.");
    }
  });
});
