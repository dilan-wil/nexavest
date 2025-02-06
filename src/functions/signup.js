import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { auth, db } from "./firebase";
import { addDoc, collection ,doc, setDoc, serverTimestamp } from "firebase/firestore";
// interface FormData {
//   email: string;
//   password: string;
//   first_name: string;
//   last_name: string;
//   username: string;
//   country: string;
//   telephone: string,
//   referralCode: string 
//   invite?: string 
// }

export async function signup(formData) {
  const { email, password, name, referralCode, phone } = formData;
  try {
    // Sign up the user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    const user = userCredential.user;

    // Send email verification
    await sendEmailVerification(user);
    await updateProfile(user, {displayName: name})
    // Create a document for the user in Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      phone,
      name,
      referredBy: referralCode || null,
      referralEarnings: 0,
      balance: 500,
      show: false,
      createdAt: serverTimestamp(),
    });

    if(referralCode){
      await setDoc(doc(db, "users", referralCode, "referrals", user.uid), {
        uid: user.uid,
        name: name,
        status: "active"
      });
    }
    
    console.log("User signed up and data saved .");
    return true;
  } catch (error) {
    console.error("Signup error:", error.message);

    // Provide meaningful error message for the UI
    if (error.code === "auth/email-already-in-use") {
      throw new Error("C'est email a déjà un compte, veuillez vous connecter.");
    } else if (error.code === "auth/weak-password") {
      throw new Error("Le mot de passe doit avoir au moins 6 lettres.");
    } else {
      throw new Error("Une erreur est survenue, veuillez réessayer.");
    }
    return false
  }
}