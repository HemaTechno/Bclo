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

// إنشاء عنصر الإشعار
const notification = document.createElement("div");
notification.id = "global-notification";
notification.style.cssText = `
  position: fixed;
  top: -100px;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #4361ee 0%, #3a56d4 100%);
  color: white;
  padding: 15px 20px;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(67, 97, 238, 0.3);
  transition: transform 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55), opacity 0.3s ease;
  font-family: 'Tajawal', sans-serif;
  opacity: 0;
`;

notification.innerHTML = `
  <div id="notification-content" style="flex: 1; text-align: center; padding: 0 15px;"></div>
  <a id="notification-action" href="#" target="_blank" style="
    display: none;
    margin-left: 12px;
    padding: 8px 16px;
    background: rgba(255, 255, 255, 0.2);
    color: white;
    text-decoration: none;
    border-radius: 24px;
    font-weight: 500;
    transition: all 0.2s ease;
    white-space: nowrap;
  "></a>
  <button id="notification-close" style="
    background: none;
    border: none;
    color: white;
    font-size: 22px;
    cursor: pointer;
    padding: 0 8px;
    margin-left: 8px;
    line-height: 1;
    opacity: 0.8;
    transition: opacity 0.2s ease;
  ">&times;</button>
`;

document.body.prepend(notification);

// إضافة تأثير hover لزر الإجراء
const actionBtn = document.getElementById("notification-action");
actionBtn.addEventListener("mouseenter", () => {
  actionBtn.style.background = "rgba(255, 255, 255, 0.3)";
});
actionBtn.addEventListener("mouseleave", () => {
  actionBtn.style.background = "rgba(255, 255, 255, 0.2)";
});

// إغلاق الإشعار
document.getElementById("notification-close").addEventListener("click", () => {
  notification.style.transform = "translateY(-100%)";
  notification.style.opacity = "0";
});

// متابعة التحديثات من Firebase
const docRef = doc(db, "config", "siteNotification");

onSnapshot(docRef, (docSnap) => {
  if (docSnap.exists()) {
    const data = docSnap.data();
    const content = document.getElementById("notification-content");
    const action = document.getElementById("notification-action");

    if (data.enabled) {
      content.textContent = data.message || "";
      
      if (data.showButton && data.buttonText) {
        action.style.display = "inline-block";
        action.textContent = data.buttonText;
        action.href = data.buttonLink || "#";
      } else {
        action.style.display = "none";
      }
      
      // عرض الإشعار بتحريك من الأعلى
      setTimeout(() => {
        notification.style.transform = "translateY(0)";
        notification.style.opacity = "1";
      }, 100);
      
    } else {
      // إخفاء الإشعار إذا كان معطلاً
      notification.style.transform = "translateY(-100%)";
      notification.style.opacity = "0";
    }
  }
});

// إضافة خط Tajawal إذا لم يكن موجوداً
if (!document.querySelector('link[href*="Tajawal"]')) {
  const fontLink = document.createElement("link");
  fontLink.href = "https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap";
  fontLink.rel = "stylesheet";
  document.head.appendChild(fontLink);
}

// تحسينات للهواتف
const updateMobileStyles = () => {
  if (window.innerWidth < 768) {
    notification.style.padding = "12px 15px";
    notification.style.flexWrap = "wrap";
    document.getElementById("notification-action").style.marginTop = "8px";
  } else {
    notification.style.padding = "15px 20px";
    notification.style.flexWrap = "nowrap";
    document.getElementById("notification-action").style.marginTop = "0";
  }
};

window.addEventListener("resize", updateMobileStyles);
updateMobileStyles();
