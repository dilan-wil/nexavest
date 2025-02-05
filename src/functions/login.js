import { auth } from "./firebase"
import { signInWithEmailAndPassword } from "firebase/auth"

// interface FormData {
//   email: string;
//   password: string;
// }

export async function login(formData) {
    console.log(formData)
    const {email, password} = formData
    if (!email || !password) {
      throw new Error("Email and password must be provided.");
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("logged in")
      return true
      // Navigate to the home page
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        console.error("Pas d'utilisateur avec ces infos");
      } else if (error.code === "auth/wrong-password") {
        console.error("Mot de passe incorrect");
      } else if (error.code === "auth/invalid-email") {
        console.error("Email incorrect");
      } else {
        console.error("Error:", error.message);
      }
    }
}
