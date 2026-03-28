import { initializeApp } from "firebase/app";
import {
  getFirestore, collection, addDoc, serverTimestamp,
  query, orderBy, limit, getDocs, setDoc, doc, getDoc, updateDoc, increment
} from "firebase/firestore";
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

export async function checkExistingHash(hash) {
  console.log('>>> [CACHE_CHECK] checkExistingHash Initiated for hash:', hash);
  try {
    const docRef = doc(db, "documents", hash);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log('>>> [CACHE_CHECK] HIT! Found existing document, status:', data.status);
      // Return a consistent flat shape from top-level fields (always up-to-date,
      // whether pending or verified with historian corrections)
      return {
        script: data.script,
        era: data.era,
        overallAccuracy: data.overallAccuracy,
        transcript: data.transcript,
        summary: data.summary,
        modernMarathi: data.modernMarathi,
        locations: data.locations || [],
        aiPredictions: data.aiPredictions || [],
        reconstructionNeeded: data.reconstructionNeeded || [],
        _status: data.status,
        _historianEdits: data.historianEdits || null,
        _imageUrl: data.imageUrl || null,
      };
    }
    console.log('>>> [CACHE_CHECK] MISS! Document does not exist in Firebase.');
  } catch (err) {
    console.error(">>> [CACHE_CHECK] Fatal Error:", err.message);
  }
  return null;
}

export async function saveDocument(geminiResult, role, hash, base64Image) {
  console.log('>>> [SAVE_DOC] saveDocument Initiated for hash:', hash);
  try {
    // Upload compressed Base64 image to Firebase Storage
    let imageUrl = null;
    if (base64Image) {
      try {
        const storageRef = ref(storage, `artifacts/${hash}.jpg`);
        await uploadString(storageRef, base64Image, 'base64');
        imageUrl = await getDownloadURL(storageRef);
        console.log("Storage upload success:", imageUrl);
      } catch (storageErr) {
        console.warn('>>> [SAVE_DOC] Storage upload failed, proceeding without image:', storageErr.message);
        imageUrl = null;
      }
    }

    await setDoc(doc(db, "documents", hash), {
      view_count: 1,
      status: 'pending',
      priority_score: 80,
      ai_output: geminiResult,
      historian_output: null,
      timestamp: serverTimestamp(),
      imageUrl: imageUrl,
      overallAccuracy: geminiResult.overallAccuracy || null,
      script: geminiResult.script || null,
      era: geminiResult.era || null,
      transcript: geminiResult.transcript || "",
      summary: geminiResult.summary || "",
      modernMarathi: geminiResult.modernMarathi || "",
      locations: geminiResult.locations || [],
      aiPredictions: geminiResult.aiPredictions || [],
      reconstructionNeeded: geminiResult.reconstructionNeeded || []
    });
    console.log('>>> [SAVE_DOC] SUCCESS: Wrote to Firestore successfully.');
  } catch (err) {
    console.error(">>> [SAVE_DOC ERROR] Firestore Rejected the Save! Error Details:", err.code, err.message);
  }
}

export async function getRecentDocuments(max = 20) {
  try {
    const q = query(collection(db, "documents"), orderBy("timestamp", "desc"), limit(max));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error("Fetch failed:", err);
    return [];
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