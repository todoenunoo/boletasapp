import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js';
import { getFirestore, collection, getDocs, doc, updateDoc, increment } from 'https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "tu-api-key",
  authDomain: "tu-project-id.firebaseapp.com",
  projectId: "tu-project-id",
  storageBucket: "tu-project-id.appspot.com",
  messagingSenderId: "tu-sender-id",
  appId: "tu-app-id",
  measurementId: "tu-measurement-id"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Obtener productos de Firestore
async function loadProducts() {
  const productsRef = collection(db, 'products');
  const querySnapshot = await getDocs(productsRef);
  const products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  const productSelect = document.getElementById("product-select");
  products.forEach((product, index) => {
    const option = document.createElement("option");
    option.value = product.id;
    option.textContent = `${product.name} - $${product.price} - Stock: ${product.stock}`;
    productSelect.appendChild(option);
  });

  return products;
}

// Cargar productos cuando la página cargue
loadProducts().then(products => {
  const productFilter = document.getElementById("product-filter");

  // Filtro de productos
  productFilter.addEventListener("input", () => {
    const filterText = productFilter.value.toLowerCase();
    const filteredProducts = products.filter(product => product.name.toLowerCase().includes(filterText));
    const productSelect = document.getElementById("product-select");
    productSelect.innerHTML = ''; // Limpiar select
    filteredProducts.forEach((product) => {
      const option = document.createElement("option");
      option.value = product.id;
      option.textContent = `${product.name} - $${product.price} - Stock: ${product.stock}`;
      productSelect.appendChild(option);
    });
  });

  const cart = [];

  // Agregar al carrito
  const boletaForm = document.getElementById("boleta-form");
  boletaForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const selectedProductId = document.getElementById("product-select").value;
    const quantity = parseInt(document.getElementById("product-quantity").value);
    const product = products.find(p => p.id === selectedProductId);

    if (quantity <= product.stock) {
      cart.push({ ...product, quantity });
      updateCart();
      updateTotal();

      // Reducir stock en Firestore
      const productRef = doc(db, 'products', selectedProductId);
      await updateDoc(productRef, {
        stock: increment(-quantity)
      });
    } else {
      alert("No hay suficiente stock.");
    }
  });

  function updateCart() {
    const cartList = document.getElementById("cart-list");
    cartList.innerHTML = "";
    cart.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = `${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`;
      cartList.appendChild(li);
    });
  }

  function updateTotal() {
    const totalPrice = document.getElementById("total-price");
    let total = 0;
    cart.forEach((item) => {
      total += item.price * item.quantity;
    });
    totalPrice.textContent = total.toFixed(2);
  }

  // Generar PDF
  document.getElementById("generate-pdf").addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("Boleta de Compra", 20, 20);
    let y = 30;
    cart.forEach((item) => {
      doc.text(`${item.name} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`, 20, y);
      y += 10;
    });
    doc.text(`Total: $${document.getElementById("total-price").textContent}`, 20, y + 10);

    // Guardar como archivo
    doc.save("boleta.pdf");

    // Enviar por correo
    const pdfFile = doc.output('blob');
    document.getElementById('pdf-file').files = [new File([pdfFile], "boleta.pdf")];
    document.getElementById('send-email-form').submit();
  });
});
