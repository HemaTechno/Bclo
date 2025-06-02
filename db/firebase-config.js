// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyAKPlddXSZl25p9SI9H0CcPK4XSTNQXxAM",
  authDomain: "t-shirt-94ff7.firebaseapp.com",
  projectId: "t-shirt-94ff7",
  storageBucket: "t-shirt-94ff7.appspot.com",
  messagingSenderId: "367396012881",
  appId: "1:367396012881:web:3127607d5ced7678e64970"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);
export { auth, provider, db, storage};
