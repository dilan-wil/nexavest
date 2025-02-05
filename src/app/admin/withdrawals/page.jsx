"use client";

import { useState, useEffect } from "react";
import { db } from "@/functions/firebase"; // Import your Firebase instance
import { updateDoc, doc, collection, getDocs, increment } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertCircle, User, DollarSign } from "lucide-react";

const WithdrawalPage = () => {
  const [withdrawals, setWithdrawals] = useState([]);

  useEffect(() => {
    // Fetch withdrawals from Firestore
    const fetchWithdrawals = async () => {
      try {
        const withdrawalsCollectionRef = collection(db, "withdrawals");
        const snapshot = await getDocs(withdrawalsCollectionRef);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setWithdrawals(data);
      } catch (error) {
        console.error("Error fetching withdrawals:", error);
      }
    };

    fetchWithdrawals();
  }, []);

  const handleUpdateStatus = async (withdrawal) => {
    try {
      // Update withdrawal status to 'success' in Firestore
      const withdrawalRef = doc(db, "withdrawals", withdrawal.id);
      await updateDoc(withdrawalRef, { status: "success" });

      // Update the corresponding transaction status in the user's subcollection
      const transactionRef = doc(db, "users", withdrawal.userId, "transactions", withdrawal.id);
      await updateDoc(transactionRef, { status: "success" });

      // Update the local state
      setWithdrawals((prevWithdrawals) =>
        prevWithdrawals.map((item) =>
          item.id === withdrawal.id ? { ...item, status: "success" } : item
        )
      );
    } catch (error) {
      console.error("Error updating withdrawal status:", error);
    }
  };

  const handleRefuseStatus = async (withdrawal) => {
    try {
      // Update withdrawal status to 'failed' in Firestore
      const withdrawalRef = doc(db, "withdrawals", withdrawal.id);
      const userRef = doc(db, "users", withdrawal.userId);
      await updateDoc(withdrawalRef, { status: "failed" });
      await updateDoc(userRef, {balance: increment(withdrawal.amount)})
      // Update the corresponding transaction status in the user's subcollection
      const transactionRef = doc(db, "users", withdrawal.userId, "transactions", withdrawal.id);
      await updateDoc(transactionRef, { status: "failed" });

      // Update the local state
      setWithdrawals((prevWithdrawals) =>
        prevWithdrawals.map((item) =>
          item.id === withdrawal.id ? { ...item, status: "failed" } : item
        )
      );
    } catch (error) {
      console.error("Error refusing withdrawal status:", error);
    }
  };

  const pendingWithdrawals = withdrawals.filter((w) => w.status === "pending");

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card className="bg-white shadow-lg border-t-4 border-green-500">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-green-900">Admin Withdrawal Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          {pendingWithdrawals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingWithdrawals.map((withdrawal) => (
                <Card key={withdrawal.id} className="bg-white shadow-md border border-green-200">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-green-800">
                      Withdrawal ID: {withdrawal.id}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center text-green-700">
                      <DollarSign className="w-5 h-5 mr-2" />
                      Amount: XAF{withdrawal.amount.toFixed(2)}
                    </div>
                    <div className="flex items-center text-green-700">
                      <User className="w-5 h-5 mr-2" />
                      User ID: {withdrawal.userId}
                    </div>
                    <div className="text-green-700">Gateway: {withdrawal.gateway}</div>
                    <div className="text-green-700">Nom: {withdrawal.nom}</div>
                    <div className="text-green-700">Numero: {withdrawal.numero}</div>
                    <div className="text-green-700">Charge: XAF{withdrawal.charge.toFixed(2)}</div>
                    <div className="text-green-700">
                      Total à envoyer: XAF{withdrawal.a_envoyer.toFixed(2)}
                    </div>
                    <div className="text-green-700">Date: {withdrawal.date}</div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      onClick={() => handleUpdateStatus(withdrawal)}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark as Success
                    </Button>
                    <Button
                      onClick={() => handleRefuseStatus(withdrawal)}
                      variant="destructive"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Refuse
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <AlertCircle className="mx-auto h-10 w-10 text-green-500" />
              <h3 className="mt-2 text-sm font-semibold text-green-900">No Pending Withdrawals</h3>
              <p className="mt-1 text-sm text-green-700">
                There are no pending withdrawals to process at this time.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WithdrawalPage;
