import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/functions/firebase";

const addReferralBonus = async (level1ReferrerCode, depositAmount) => {
  try {
    if (level1ReferrerCode) {
      // Fetch level 1 referrer details
      const level1ReferrerRef = await getDoc(doc(db, "users", level1ReferrerCode));
      if (level1ReferrerRef.exists()) {
        // Update level 1 referrer's referral earnings with 30% of the deposit
        await updateDoc(doc(db, "users", level1ReferrerCode), {
          referralEarnings: increment(depositAmount * 0.15),
          balance: increment(depositAmount * 0.15),
        });

        // Fetch level 2 referrer's code from level 1 referrer
        const level2ReferrerCode = level1ReferrerRef.data().referredBy;
        if (level2ReferrerCode) {
          const level2ReferrerRef = await getDoc(doc(db, "users", level2ReferrerCode));
          if (level2ReferrerRef.exists()) {
            // Update level 2 referrer's referral earnings with 3% of the deposit
            await updateDoc(doc(db, "users", level2ReferrerCode), {
              referralEarnings: increment(depositAmount * 0.06),
              balance: increment(depositAmount * 0.06),
        });

            // Fetch level 3 referrer's code from level 2 referrer
            const level3ReferrerCode = level2ReferrerRef.data().referredBy;
            if (level3ReferrerCode) {
              const level3ReferrerRef = await getDoc(doc(db, "users", level3ReferrerCode));
              if (level3ReferrerRef.exists()) {
                // Update level 3 referrer's referral earnings with 1% of the deposit
                await updateDoc(doc(db, "users", level3ReferrerCode), {
                  referralEarnings: increment(depositAmount * 0.03),
                  balance: increment(depositAmount * 0.03),
                });
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("Error adding referral bonus: ", error);
  }
};

export default addReferralBonus;
