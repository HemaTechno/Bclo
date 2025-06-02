// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyAX8PWbKfWeBYzmX7sdrBhIT0Wp1yPjR04",
  authDomain: "hemaern.firebaseapp.com",
  databaseURL: "https://hemaern-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "hemaern",
  storageBucket: "hemaern.firebasestorage.app",
  messagingSenderId: "533729874483",
  appId: "1:533729874483:web:142462fdbd96156fe30946"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);
export { auth, provider, db, storage};
