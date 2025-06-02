// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDhpIG2co2LIV9m_E1a5LE6fNqbceI_eCw",
  authDomain: "cloud-c5b93.firebaseapp.com",
  projectId: "cloud-c5b93",
  storageBucket: "cloud-c5b93.firebasestorage.app",
  messagingSenderId: "96719477673",
  appId: "1:96719477673:web:11dc6c42f36f139a0782b8",
  measurementId: "G-LSQ0249S3D"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, db};
