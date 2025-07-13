import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore, doc, onSnapshot } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// إعدادات Firebase
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

// تحميل خط Cairo الجميل
const loadFont = () => {
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
};

loadFont();

// إنشاء عنصر الإشعار
const createNotification = () => {
  const notification = document.createElement("div");
  notification.id = "global-notification";
  notification.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
    padding: 14px 20px;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    font-family: 'Cairo', sans-serif;
    transform: translateY(-100%);
    transition: transform 0.4s ease-out;
  `;

  notification.innerHTML = `
    <div id="notification-content" style="
      flex: 1;
      text-align: center;
      font-size: 16px;
      font-weight: 600;
      padding: 0 10px;
    "></div>
    <a id="notification-action" href="#" target="_blank" style="
      display: none;
      margin-right: 12px;
      padding: 8px 16px;
      background: rgba(255, 255, 255, 0.2);
      color: white;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      font-size: 14px;
      transition: background 0.2s;
    "></a>
    <button id="notification-close" style="
      background: none;
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
      padding: 0 8px;
      opacity: 0.8;
      transition: opacity 0.2s;
    ">&times;</button>
  `;

  document.body.prepend(notification);
  return notification;
};

const notification = createNotification();

// تأثيرات التفاعل
const actionBtn = document.getElementById("notification-action");
actionBtn.addEventListener("mouseenter", () => {
  actionBtn.style.background = "rgba(255, 255, 255, 0.3)";
});
actionBtn.addEventListener("mouseleave", () => {
  actionBtn.style.background = "rgba(255, 255, 255, 0.2)";
});

document.getElementById("notification-close").addEventListener("click", () => {
  notification.style.transform = "translateY(-100%)";
});

// متابعة التحديثات من Firebase
const docRef = doc(db, "config", "siteNotification");

onSnapshot(docRef, (docSnap) => {
  if (docSnap.exists()) {
    const data = docSnap.data();
    const content = document.getElementById("notification-content");
    const action = document.getElementById("notification-action");

    if (data.enabled && data.message) {
      content.textContent = data.message;
      
      if (data.showButton && data.buttonText) {
        action.style.display = "inline-block";
        action.textContent = data.buttonText;
        action.href = data.buttonLink || "#";
      } else {
        action.style.display = "none";
      }
      
      // عرض الإشعار
      setTimeout(() => {
        notification.style.transform = "translateY(0)";
      }, 100);
      
    } else {
      // إخفاء الإشعار
      notification.style.transform = "translateY(-100%)";
    }
  }
});

// تكييف التصميم للهواتف
const adaptForMobile = () => {
  if (window.innerWidth < 768) {
    notification.style.flexDirection = "column";
    notification.style.padding = "12px";
    action.style.margin = "8px 0 0 0";
  } else {
    notification.style.flexDirection = "row";
    notification.style.padding = "14px 20px";
    action.style.margin = "0 12px 0 0";
  }
};

window.addEventListener("resize", adaptForMobile);
adaptForMobile();
