"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp } from "lucide-react";
import DepositWithdrawButtons from "@/components/DepositWithdrawal";
import { useAuth } from "@/components/context/auth-context";
import { Skeleton } from "@/components/ui/skeleton"; // Import the Skeleton component
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogAction, AlertDialogCancel, AlertDialogFooter } from '@/components/ui/alert-dialog'
import { Label } from "@/components/ui/label"
import { doc, updateDoc, arrayUnion, addDoc, collection, increment } from "firebase/firestore";
import { db } from "@/functions/firebase";
import { v4 as uuidv4 } from "uuid"; // Import if using the uuid library
import { useToast } from '@/hooks/use-toast'
import addReferralBonus from '@/functions/add-referral-bonus'
import Link from "next/link";

const plans = [
  {
    id: 1,
    name: "Starter Plan",
    type: "Basic",
    price: 2500,
    dailyRevenue: 300,
    period: 30,
    totalRevenue: 105,
    icon: "savings",
    color: "blue",
  },
  {
    id: 2,
    name: "Basic Growth",
    type: "Basic",
    price: 5000,
    dailyRevenue: 600,
    period: 30,
    totalRevenue: 262.5,
    icon: "trending_up",
    color: "blue",
  },
  {
    id: 3,
    name: "Basic Plus",
    type: "Basic",
    price: 10000,
    dailyRevenue: 1200,
    period: 30,
    totalRevenue: 525,
    icon: "add_chart",
    color: "blue",
  },
  {
    id: 4,
    name: "Pro Starter",
    type: "Pro",
    price: 20000,
    dailyRevenue: 2400,
    period: 30,
    totalRevenue: 1080,
    icon: "trending_up",
    color: "indigo",
  },
  {
    id: 5,
    name: "Pro Growth",
    type: "Pro",
    price: 50000,
    dailyRevenue: 6000,
    period: 30,
    totalRevenue: 2700,
    icon: "show_chart",
    color: "indigo",
  },
  {
    id: 6,
    name: "Pro Plus",
    type: "Pro",
    price: 100000,
    dailyRevenue: 12000,
    period: 30,
    totalRevenue: 5400,
    icon: "analytics",
    color: "indigo",
  },
  {
    id: 7,
    name: "Elite Plan",
    type: "Premium",
    price: 250000,
    dailyRevenue: 24000,
    period: 30,
    totalRevenue: 24000,
    icon: "diamond",
    color: "purple",
  },
  {
    id: 8,
    name: "VIP Plan",
    type: "Premium",
    price: 500000,
    dailyRevenue: 60000,
    period: 30,
    totalRevenue: 600,
    icon: "workspace_premium",
    color: "purple",
  },
  {
    id: 9,
    name: "VVIP Plan",
    type: "Premium",
    price: 1000000,
    dailyRevenue: 120000,
    period: 30,
    totalRevenue: 30000,
    icon: "workspace_premium",
    color: "purple",
  },
]


export default function Home() {
  const [loading, setLoading] = useState(false)
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const { userInfo, setUserInfo, setTransactions, transactions } = useAuth();
  const router = useRouter()
  const now = new Date();
  const { toast } = useToast()

  useEffect(() => {
    console.log(userInfo);
  }, [userInfo]);


  // Render skeleton while userInfo is null
  if (!userInfo) {
    return (
      <div className="p-4 space-y-4 pb-20">
        <h1 className="text-2xl font-bold text-blue-800">Panel</h1>
            <Skeleton className="w-24 h-5" />
            <Skeleton className="h-4 w-4" />
         
            <Skeleton className="w-32 h-6 mb-2" />
            <Skeleton className="w-20 h-4" />
         
      </div>
    );
  }

  return (
      <div className="w-full max-w-[1200px] mx-auto p-4 md:p-6 rounded-xl">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">Bienvenue chez NexaVest</h1>
          {/* <p className="text-lg text-gray-600">Your gateway to smart cryptocurrency investments</p> */}
        </header>
  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
            <h2 className="text-xl font-semibold mb-4 text-black">Portfolio</h2>
            <p className="text-3xl font-bold mb-2">XAF{userInfo?.balance ?? 0}</p>
            <p className="text-sm text-gray-500">Solde</p>
            {/* <div className="mt-4 flex items-center">
              <span className="text-green-500 font-semibold">+5.23%</span>
              <span className="text-gray-500 ml-2">Past 24h</span>
            </div> */}
          </Card>
        <DepositWithdrawButtons />

  
          <Card className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
            <h2 className="text-xl font-semibold mb-4 text-black">Investissement en Cours</h2>
            <p className="text-3xl font-bold mb-2">{userInfo?.plans?.length ?? 0}</p>
            <p className="text-sm text-gray-500">Plans Actifs</p>
            <Link href="/panel/invest" className="mt-4 inline-block text-blue-500 hover:underline">
              Voir les détails
            </Link>
          </Card>
  
          <Card className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all">
            <h2 className="text-xl font-semibold mb-4 text-black">Programme d'affiliation</h2>
            <p className="text-3xl font-bold mb-2">XAF{userInfo?.referralEarnings ?? 0}</p>
            <p className="text-sm text-gray-500">Gagnés en parrainant</p>
            <Link href="/panel/referral" className="mt-4 inline-block text-blue-500 hover:underline">
              Invitez vos amis
            </Link>
          </Card>
        </div>
  
  
        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-4 text-black">Transactions Récentes</h2>
          <Card className="bg-white overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.map((transaction, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{transaction.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {transaction.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          transaction.status === "success"
                            ? "bg-green-100 text-green-800"
                            : transaction.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </section>
  
        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-6 text-black">Plans Investissement</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`bg-gradient-to-br from-${plan.color}-100 to-white p-6 rounded-xl border border-${plan.color}-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1`}
              >
                <div className="flex justify-between items-center mb-6">
                  <span className={`material-symbols-outlined text-${plan.color}-600 text-3xl`}>{plan.icon}</span>
                  <span
                    className={`bg-${plan.color}-200 text-${plan.color}-800 px-3 py-1 rounded-full text-sm font-medium`}
                  >
                    {plan.type}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-800">{plan.name}</h3>
                <p className="text-gray-600 mb-4">Investment: XAF{plan.price}</p>
                <div className="text-3xl font-bold mb-6 text-gray-800">
                  ${plan.dailyRevenue.toFixed(2)}
                  <span className="text-sm text-gray-500 font-normal">/day</span>
                </div>
                <p className="text-gray-600 mb-2">Période: {plan.period} days</p>
                <p className="text-gray-600 mb-4">Revenus Totale: XAF{plan.dailyRevenue * plan.period}</p>
                <Button
                  onclick={() => router.push("/panel/investir")}
                  className={`w-full bg-${plan.color}-600 hover:bg-${plan.color}-700 text-white py-3 rounded-xl font-medium transform hover:scale-105 transition-all duration-300`}
                >
                  Investir
                </Button>
              </Card>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/panel/invest" passHref>
              <Button variant="outline" size="lg">
                Voir tout les plans
              </Button>
            </Link>
          </div>
        </section>
      </div>
    )
}
