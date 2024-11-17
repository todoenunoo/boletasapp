document.addEventListener("DOMContentLoaded", () => {
  const productSelect = document.getElementById("product-select");
  const cartList = document.getElementById("cart-list");
  const totalPrice = document.getElementById("total-price");
  const boletaForm = document.getElementById("boleta-form");
  const generatePdfButton = document.getElementById("generate-pdf");
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

  // Generar boleta en PDF
  generatePdfButton.addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("Boleta de Compra", 20, 10);

    let y = 20;
    cart.forEach((item) => {
      const text = `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`;
      doc.text(text, 20, y);
      y += 10;
    });

    doc.text(`Total: $${totalPrice.textContent}`, 20, y);

    // Convertir el PDF a blob para enviarlo
    const pdfBlob = doc.output("blob");

    // Crear un archivo y agregarlo al formulario
    const pdfFile = new File([pdfBlob], "boleta_compra.pdf", { type: "application/pdf" });
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(pdfFile);
    pdfFileInput.files = dataTransfer.files;

    // Mostrar el formulario de envío
    sendEmailForm.style.display = "block";
    alert("Boleta generada. Ahora puedes enviarla por correo.");
  });
});
