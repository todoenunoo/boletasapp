document.addEventListener("DOMContentLoaded", () => {
  const productSelect = document.getElementById("product-select");
  const cartList = document.getElementById("cart-list");
  const totalPrice = document.getElementById("total-price");
  const boletaForm = document.getElementById("boleta-form");
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
    const address = document.getElementById("customer-address").value;

    if (quantity > 0) {
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

  // Enviar la boleta por correo
  sendEmailForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(sendEmailForm);

    fetch(sendEmailForm.action, {
      method: 'POST',
      body: formData
    })
      .then(response => {
        alert("¡Boleta enviada con éxito!");
        cart.length = 0;
        updateCart();
        updateTotal();
      })
      .catch(error => {
        console.error("Error al enviar la boleta:", error);
        alert("Hubo un error al enviar la boleta.");
      });
  });
});
