import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDKqdwYxisYqHbWdPB8DjVSi23-jtf-zlQ",
  authDomain: "lipisutra.firebaseapp.com",
  projectId: "lipisutra",
  storageBucket: "lipisutra.firebasestorage.app",
  messagingSenderId: "658199217197",
  appId: "1:658199217197:web:191bd71b1392bee9c224a4"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export async function saveDocument(data, role) {
  try {
    return await addDoc(collection(db, "documents"), {
      ...data,
      savedByRole: role,
      timestamp: serverTimestamp()
    });
  } catch (err) {
    console.log("Firestore save failed:", err.message);
  }
}

export async function saveCorrection(correction) {
  try {
    return await addDoc(collection(db, "corrections"), {
      ...correction,
      savedByRole: "historian",
      timestamp: serverTimestamp()
    });
  } catch (err) {
    console.log("Correction save failed:", err.message);
  }
}