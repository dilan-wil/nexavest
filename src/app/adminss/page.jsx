'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-react'
import { db } from '@/functions/firebase';
import { collection, doc, getDocs, updateDoc, increment, query, where } from "firebase/firestore";
// In a real application, this would be fetched from your backend
const fetchDashboardData = async () => {
  // Simulating an API call
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        totalDeposits: 1000000,
        totalWithdrawals: 750000,
      })
    }, 1000)
  })
}

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalDeposits: 0,
    totalWithdrawals: 0,
  })
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [totalDeposits, setTotalDeposits] = useState(0);
  const [totalWithdrawals, setTotalWithdrawals] = useState(0);


  const fetchDeposits = async () => {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, "deposits"), where("status", "==", "redeemed"))
      );
      const fetchedDeposits = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDeposits(fetchedDeposits);
    } catch (error) {
      console.error("Error fetching deposits:", error);
    }
  };

  const fetchWithdrawals = async () => {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, "withdrawals"), where("status", "==", "success"))
      );
      const fetchedWithdrawals = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setWithdrawals(fetchedWithdrawals);
    } catch (error) {
      console.error("Error fetching deposits:", error);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
    fetchDeposits();
  }, [])

  useEffect(() => {
    console.log(deposits)
    const td = deposits.reduce((sum, item) => sum + item.amount, 0)
    setTotalDeposits(td-30000)
    const tw = withdrawals.reduce((sum, item) => sum + item.amount, 0)
    setTotalWithdrawals(tw)
  }, [deposits, withdrawals])

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white shadow-lg border-t-4 border-green-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-bold text-green-700">Total Deposits</CardTitle>
            <ArrowDownRight className="h-6 w-6 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 flex items-center">
              {totalDeposits.toLocaleString('en-US', { style: 'currency', currency: 'XAF' })}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-lg border-t-4 border-red-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-bold text-red-700">Total Withdrawals</CardTitle>
            <ArrowUpRight className="h-6 w-6 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600 flex items-center">
              {totalWithdrawals.toLocaleString('en-US', { style: 'currency', currency: 'XAF' })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white shadow-lg border-t-4 border-blue-500">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-blue-800">Net Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-blue-600 flex items-center">
            {(totalDeposits - totalWithdrawals).toLocaleString('en-US', { style: 'currency', currency: 'XAF' })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

