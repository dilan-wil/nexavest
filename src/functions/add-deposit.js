import { db } from "./firebase"; // Adjust the import to match your Firebase setup
import { doc, getDoc, setDoc, collection } from "firebase/firestore";

// interface AddDepositInput {
//   userUid: string;
//   amount: string;
//   transactionId: string;
//   gateway: string;
//   userINFO: any;
//   setUserINFO: any;
//   setTransac: any;
// }

export async function addDeposit({
  userUid,
  amount,
  transactionId,
  gateway,
}) {
  try {
    const newAmount = parseInt(amount);

    // Check if the deposit already exists in the "deposits" collection
    const depositRef = doc(db, "deposits", transactionId);
    const depositSnapshot = await getDoc(depositRef);

    if (depositSnapshot.exists()) {
      console.error("Deposit already exists with this transaction ID.");
      throw new Error("This deposit request has already been processed.");
    }

    // Add deposit to the "deposits" collection with "pending" status
    const depositData = {
      userUid,
      transactionId,
      amount: newAmount,
      gateway,
      status: "pending", // Mark as pending for admin approval
      date: new Date().toISOString(),
    };

    await setDoc(depositRef, depositData);

    // Create a pending transaction in the user's "transactions" sub-collection using transactionId as document ID
    const userDocRef = doc(db, "users", userUid);
    const transactionData = {
      description: `Deposit via ${gateway}`,
      transactionId,
      type: "Deposit",
      amount: newAmount,
      charge: 0,
      status: "pending", // Initially pending
      method: gateway,
      icon: "payments",
      iconBg: "bg-green-100",
      date: new Date().toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }),
    };

    await setDoc(doc(collection(userDocRef, "transactions"), transactionId), transactionData);

    console.log("Deposit and pending transaction added.");
    return true;
  } catch (error) {
    console.error("Error adding deposit:", error);
    throw error;
  }
}
