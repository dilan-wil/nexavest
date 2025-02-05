import { doc, deleteDoc } from "firebase/firestore";
import { db, auth } from "./firebase"; // Adjust the path to your Firebase configuration file
import { signOut } from "firebase/auth";

export async function deleteFirestoreDocument(collectionName, docId) {
  try {
    await signOut(auth)
    const docRef = doc(db, collectionName, docId);
    await deleteDoc(docRef);
    console.log(`Document with ID ${docId} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting document:", error);
    throw new Error("Failed to delete document");
  }
}
