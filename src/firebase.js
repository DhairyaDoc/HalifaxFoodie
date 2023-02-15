import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDVXmyvTxlsrX2UwT8pk8WRfMhRmixXpuw",
    authDomain: "serverlessproject-21.firebaseapp.com",
    projectId: "serverlessproject-21",
    storageBucket: "serverlessproject-21.appspot.com",
    messagingSenderId: "868913007078",
    appId: "1:868913007078:web:6349eb85e49bc240482e27",
    measurementId: "G-PTNG48SQM2",
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db ;