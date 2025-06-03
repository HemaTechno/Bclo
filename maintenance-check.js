// maintenance-check.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";

// بيانات Firebase الخاصة بك
const firebaseConfig = {
      apiKey: "AIzaSyBoPJbx5v6EkOqxOJkbhzHqIJdAByh79Rg",
      authDomain: "hhhhhh-d4fb8.firebaseapp.com",
      projectId: "hhhhhh-d4fb8",
      storageBucket: "hhhhhh-d4fb8.appspot.com",
      messagingSenderId: "24512338206",
      appId: "1:24512338206:web:dfe045db59bd3434a2110f",
      measurementId: "G-HD4R7GNQ5H"
    };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const statusRef = doc(db, "config", "maintenance");

getDoc(statusRef).then((snap) => {
  if (snap.exists() && snap.data().enabled) {
    window.location.href = "/maintenance.html";
  }
});
