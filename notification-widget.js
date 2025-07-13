// notification-widget.js
class NotificationWidget {
  constructor() {
    this.notificationData = null;
    this.initFirebase();
    this.initElements();
    this.loadNotification();
  }

  initFirebase() {
    // تكوين Firebase
    const firebaseConfig = {
      apiKey: "AIzaSyBoPJbx5v6EkOqxOJkbhzHqIJdAByh79Rg",
      authDomain: "hhhhhh-d4fb8.firebaseapp.com",
      projectId: "hhhhhh-d4fb8",
      storageBucket: "hhhhhh-d4fb8.appspot.com",
      messagingSenderId: "24512338206",
      appId: "1:24512338206:web:dfe045db59bd3434a2110f",
      measurementId: "G-HD4R7GNQ5H"
    };
    
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    this.db = firebase.firestore();
  }

  initElements() {
    // إنشاء عنصر الإشعار
    this.notificationEl = document.createElement('div');
    this.notificationEl.id = 'global-notification';
    this.notificationEl.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #2563eb;
      color: white;
      padding: 15px 20px;
      text-align: center;
      z-index: 9999;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
    `;
    
    // محتوى الإشعار
    this.contentEl = document.createElement('div');
    this.contentEl.style.flex = '1';
    
    // زر الإغلاق
    this.closeBtn = document.createElement('button');
    this.closeBtn.innerHTML = '&times;';
    this.closeBtn.style.cssText = `
      background: transparent;
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
      margin-right: 10px;
    `;
    this.closeBtn.addEventListener('click', () => this.hideNotification());
    
    // زر الإجراء (إذا كان موجوداً)
    this.actionBtn = document.createElement('a');
    this.actionBtn.style.cssText = `
      margin-right: 15px;
      color: white;
      text-decoration: underline;
      font-weight: bold;
    `;
    
    this.notificationEl.appendChild(this.contentEl);
    this.notificationEl.appendChild(this.actionBtn);
    this.notificationEl.appendChild(this.closeBtn);
    
    document.body.prepend(this.notificationEl);
  }

  async loadNotification() {
    try {
      const doc = await this.db.collection('notifications').doc('current').get();
      if (doc.exists) {
        this.notificationData = doc.data();
        this.renderNotification();
      }
    } catch (error) {
      console.error('Error loading notification:', error);
    }
  }

  renderNotification() {
    if (!this.notificationData || !this.notificationData.enabled) {
      this.hideNotification();
      return;
    }

    this.contentEl.textContent = this.notificationData.message;
    
    if (this.notificationData.showButton && this.notificationData.buttonLink) {
      this.actionBtn.textContent = this.notificationData.buttonText || 'اضغط هنا';
      this.actionBtn.href = this.notificationData.buttonLink;
      this.actionBtn.style.display = 'inline-block';
    } else {
      this.actionBtn.style.display = 'none';
    }

    this.showNotification();
  }

  showNotification() {
    this.notificationEl.style.display = 'flex';
    setTimeout(() => {
      this.notificationEl.style.transform = 'translateY(0)';
    }, 100);
  }

  hideNotification() {
    this.notificationEl.style.transform = 'translateY(-100%)';
    setTimeout(() => {
      this.notificationEl.style.display = 'none';
    }, 300);
  }
}

// تهيئة الإشعار عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  new NotificationWidget();
});
