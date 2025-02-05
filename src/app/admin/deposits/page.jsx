'use client'

import { useEffect, useState } from 'react';
import { db } from '@/functions/firebase';
import { collection, doc, getDocs, updateDoc, increment, query, where } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertCircle, DollarSign, User } from 'lucide-react';

const AdminDepositPage = () => {
  const [deposits, setDeposits] = useState([]);

  const fetchDeposits = async () => {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, "deposits"), where("status", "==", "pending"))
      );
      const fetchedDeposits = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDeposits(fetchedDeposits);
    } catch (error) {
      console.error("Error fetching deposits:", error);
    }
  };

  const approveDeposit = async (depositId, userUid, amount) => {
    try {
      const depositRef = doc(db, "deposits", depositId);
      await updateDoc(depositRef, { status: "redeemed" });
  
      const userDocRef = doc(db, "users", userUid);
      const transactionRef = doc(collection(userDocRef, "transactions"), depositId);
  
      await updateDoc(transactionRef, { status: "success" });
  
      await updateDoc(userDocRef, {
        balance: increment(amount),
        deposits: increment(amount),
      });
  
      console.log("Deposit approved and processed.");
      fetchDeposits();
    } catch (error) {
      console.error("Error approving deposit:", error);
    }
  };

  const refuseDeposit = async (depositId, userUid) => {
    try {
      const depositRef = doc(db, "deposits", depositId);
      await updateDoc(depositRef, { status: "failed" });

      const userDocRef = doc(db, "users", userUid);
      const transactionRef = doc(collection(userDocRef, "transactions"), depositId);
      await updateDoc(transactionRef, { status: "failed" });

      console.log("Deposit refused and updated to failed.");
      fetchDeposits();
    } catch (error) {
      console.error("Error refusing deposit:", error);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card className="bg-white shadow-lg border-t-4 border-blue-500">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-900">Admin Deposit Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          {deposits.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {deposits.map((deposit) => (
                <Card key={deposit.id} className="bg-white shadow-md border border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-blue-800">Transaction ID: {deposit.id}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center text-blue-700">
                      <DollarSign className="w-5 h-5 mr-2" />
                      Amount: XAF{deposit.amount.toFixed(2)}
                    </div>
                    <div className="flex items-center text-blue-700">
                      {/* <User className="w-5 h-5 mr-2" /> */}
                      methode: {deposit.gateway}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      onClick={() => approveDeposit(deposit.id, deposit.userUid, deposit.amount)}
                      className="bg-green-500 hover:bg-green-600 text-white"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => refuseDeposit(deposit.id, deposit.userUid)}
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
              <AlertCircle className="mx-auto h-10 w-10 text-blue-500" />
              <h3 className="mt-2 text-sm font-semibold text-blue-900">No Pending Deposits</h3>
              <p className="mt-1 text-sm text-blue-700">There are no pending deposits to approve at this time.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDepositPage;

