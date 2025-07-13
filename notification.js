// notification.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// إعدادات Firebase الخاصة بك
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

// إنشاء عنصر الإشعار
const box = document.createElement("div");
box.id = "top-notification";
box.style.cssText = `
  display: none;
  position: fixed;
  top: 0; left: 0; right: 0;
  background: #fffae6;
  color: #333;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  z-index: 10000;
  text-align: center;
  font-family: sans-serif;
`;

box.innerHTML = `
  <span id="notification-message"></span>
  <a id="notification-button" href="#" target="_blank" style="margin-left: 10px; padding: 5px 10px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; display: none;"></a>
  <span id="notification-close" style="margin-left: 15px; cursor: pointer;">✖</span>
`;

document.body.appendChild(box);

// إغلاق الإشعار عند الضغط على ✖
document.getElementById("notification-close").onclick = function () {
  box.style.display = "none";
};

// الاشتراك في تحديث الإشعار من Firebase
const docRef = doc(db, "config", "siteNotification");

onSnapshot(docRef, (docSnap) => {
  if (docSnap.exists()) {
    const data = docSnap.data();
    const msg = document.getElementById("notification-message");
    const btn = document.getElementById("notification-button");

    if (data.enabled) {
      msg.textContent = data.message || "";
      if (data.showButton) {
        btn.style.display = "inline-block";
        btn.textContent = data.buttonText || "المزيد";
        btn.href = data.buttonLink || "#";
      } else {
        btn.style.display = "none";
      }
      box.style.display = "block";
    } else {
      box.style.display = "none";
    }
  }
});
