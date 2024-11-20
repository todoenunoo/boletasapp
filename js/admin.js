import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from 'https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js';

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

// Obtener productos de Firestore y mostrar en el listado
async function loadProducts() {
  const productsRef = collection(db, 'products');
  const querySnapshot = await getDocs(productsRef);
  const productList = document.getElementById("product-list");
  productList.innerHTML = ''; // Limpiar la lista
  querySnapshot.forEach((doc) => {
    const li = document.createElement("li");
    li.textContent = `${doc.data().name} - $${doc.data().price} - Stock: ${doc.data().stock}`;
    productList.appendChild(li);
  });
}

// Cargar productos al iniciar
loadProducts();

// Agregar un producto nuevo
document.getElementById("add-product-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("product-name").value;
  const price = document.getElementById("product-price").value;
  const stock = document.getElementById("product-stock").value;

  try {
    await addDoc(collection(db, "products"), {
      name,
      price: parseFloat(price),
      stock: parseInt(stock),
    });
    loadProducts(); // Volver a cargar los productos
  } catch (error) {
    console.error("Error adding document: ", error);
  }
});
