import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getPerformance } from "firebase/performance";

const firebaseConfig = {
    apiKey: "AIzaSyCZiFwpb-ufuah3OLwlJKoa-UjJhjfKqHM",
    authDomain: "login-app-edef8.firebaseapp.com",
    projectId: "login-app-edef8",
    storageBucket: "login-app-edef8.firebasestorage.app",
    messagingSenderId: "291776492607",
    appId: "1:291776492607:web:1fad1e2a57e8ea67ef348a",
    measurementId: "G-QBNBJEGZ6H"
  };

  const app = initializeApp(firebaseConfig);
  export const auth = getAuth(app);
  export const analytics = getAnalytics(app);
  export const performance = getPerformance(app);
