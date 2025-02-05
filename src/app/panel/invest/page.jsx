'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, Check, Loader2 } from 'lucide-react'
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogAction, AlertDialogCancel, AlertDialogFooter } from '@/components/ui/alert-dialog'
import { useAuth } from '@/components/context/auth-context'
import { doc, updateDoc, arrayUnion, addDoc, collection, increment } from "firebase/firestore";
import { db } from "@/functions/firebase";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid"; // Import if using the uuid library
import { useToast } from '@/hooks/use-toast'
import addReferralBonus from '@/functions/add-referral-bonus'

const plans = [
  // Basic Plans
  {
    id: 1,
    name: "Starter Plan",
    type: "Basic",
    price: 100,
    dailyRevenue: 0.17,
    period: 30,
    totalRevenue: 105,
    icon: "savings",
    color: "blue",
  },
  {
    id: 2,
    name: "Basic Growth",
    type: "Basic",
    price: 250,
    dailyRevenue: 0.42,
    period: 30,
    totalRevenue: 262.5,
    icon: "trending_up",
    color: "blue",
  },
  {
    id: 3,
    name: "Basic Plus",
    type: "Basic",
    price: 500,
    dailyRevenue: 0.83,
    period: 30,
    totalRevenue: 525,
    icon: "add_chart",
    color: "blue",
  },
  // Pro Plans
  {
    id: 4,
    name: "Pro Starter",
    type: "Pro",
    price: 1000,
    dailyRevenue: 2.67,
    period: 30,
    totalRevenue: 1080,
    icon: "trending_up",
    color: "indigo",
  },
  {
    id: 5,
    name: "Pro Growth",
    type: "Pro",
    price: 2500,
    dailyRevenue: 6.67,
    period: 30,
    totalRevenue: 2700,
    icon: "show_chart",
    color: "indigo",
  },
  {
    id: 6,
    name: "Pro Plus",
    type: "Pro",
    price: 5000,
    dailyRevenue: 13.33,
    period: 30,
    totalRevenue: 5400,
    icon: "analytics",
    color: "indigo",
  },
  // Premium Plans
  {
    id: 7,
    name: "Elite Plan",
    type: "Premium",
    price: 10000,
    dailyRevenue: 40,
    period: 30,
    totalRevenue: 12000,
    icon: "diamond",
    color: "purple",
  },
  {
    id: 8,
    name: "VIP Plan",
    type: "Premium",
    price: 25000,
    dailyRevenue: 100,
    period: 30,
    totalRevenue: 30000,
    icon: "workspace_premium",
    color: "purple",
  },
]

export default function Investments() {
  const [showMyInvestments, setShowMyInvestments] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [userPLans, setUserPlans] = useState([]);
  const { userInfo, setUserInfo, setTransactions } = useAuth();
  const router = useRouter()
  const now = new Date();
  const { toast } = useToast()
  const [showActivePlans, setShowActivePlans] = useState(false)

  useEffect(() => {
    console.log(userInfo)
    if(userInfo?.plans){
      setUserPlans(userInfo?.plans)
    } else {
      setUserPlans([])
    }
  }, [userInfo])

  const handleBuyClick = (plan) => {
    setSelectedPlan(plan);
    setDialogOpen(true);
  };

  const confirmPurchase = async () => {
    console.log(selectedPlan)
    setLoading(true)
    if (!userInfo?.uid || !selectedPlan) return;

    if (userInfo.balance < selectedPlan.prix) {
      toast({
        variant: "destructive",
        title: "Solde Insuffisant.",
        description: "Veuillez Rechargez votre compte pour payer ce plan.",
      })
      router.push("/d/deposit");
      return;
    }

    try {
      const userDocRef = doc(db, "users", userInfo.uid);
      const newBalance = userInfo.balance - selectedPlan.prix;

      const newPlan = {
        id: selectedPlan.id,
        instanceId: uuidv4(),
        name: selectedPlan.name,
        prix: selectedPlan.prix,
        daily: selectedPlan.daily,
        purchaseDate: new Date().toISOString(),
        times: 40,
        lastClicked: now.toISOString(),
        image: selectedPlan.image
      };

      await updateDoc(userDocRef, {
        balance: newBalance,
        plans: arrayUnion(newPlan),
      });

      const transactionsCollectionRef = collection(userDocRef, "transactions");
      const newTransaction = {
        description: `Achat du plan ${selectedPlan.name}`,
        transactionId: selectedPlan.name,
        type: "Achat",
        amount: -selectedPlan.prix,
        charge: 0,
        status: "success",
        method: "system",
        date: new Date().toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }),
      }

      await addDoc(transactionsCollectionRef, newTransaction);

      setUserInfo({ ...userInfo, balance: newBalance, plans: [...(userInfo?.plans || []), newPlan], });
      // Update transactions by appending the new transaction
      setTransactions((prevTransactions) => [...prevTransactions, newTransaction]);

      if (!userInfo.plans) {
        await addReferralBonus(userInfo.referredBy, selectedPlan.prix)
      }

      toast({
        variant: "success",
        title: "Achat Réussi.",
        description: "Votre plan a été ajouté. Rendez-vous dans la section taches pour éfféctuer vos taches.",
      })
    } catch (error) {
      console.error("Error purchasing plan: ", error);

      toast({
        variant: "destructive",
        title: "Erreur.",
        description: "Recommencer s'ils vous plait.",
      })
    } finally {
      setLoading(false)
      setDialogOpen(false);
    }
  };

  const handleTaskClick = async (plan) => {
    if (loading) return;
  
    const now = new Date();
    const lastClicked = plan.lastClicked ? new Date(plan.lastClicked) : null;
    const purchaseDate = plan.purchaseDate ? new Date(plan.purchaseDate) : null;
  
    // Check if the task is being accessed on the same day as the purchase
    if (purchaseDate && now.toDateString() === purchaseDate.toDateString()) {
      toast({
        variant: "destructive",
        title: "Première tâche indisponible.",
        description: "Votre première tâche sera disponible demain à 00h.",
      });
      return;
    }
  
    // Check if the task was already clicked today
    if (lastClicked && now.toDateString() === lastClicked.toDateString()) {
      toast({
        variant: "destructive",
        title: "Déjà effectué aujourd'hui.",
        description: "Vous avez déjà effectué cette tâche aujourd'hui. Revenez demain pour recommencer.",
      });
      return;
    }
  
    // Prevent further clicks if times are exhausted
    if (plan.times <= 0) {
      toast({
        variant: "destructive",
        title: "Plus de tâches.",
        description: "Vous avez épuisé le nombre de tâches pour ce plan.",
      });
      return;
    }
  
    setLoading(true);
  
    try {
      const userDocRef = doc(db, "users", userInfo?.uid);
  
      // Filter and calculate earnings only for plans available today
      const availablePlans = userInfo?.plans.filter((p) => {
        const planPurchaseDate = p.purchaseDate ? new Date(p.purchaseDate) : null;
  
        // A plan is available if it was purchased before today
        return planPurchaseDate && now > planPurchaseDate && p.times > 0;
      });
  
      const totalDailyEarnings = availablePlans.reduce(
        (sum, p) => sum + (p.id === plan.id ? p.daily : 0),
        0
      );
  
      const updatedPlans = userInfo?.plans.map((p) =>
        p.id === plan.id
          ? {
              ...p,
              times: p.times - 1,
              lastClicked: now.toISOString(),
            }
          : p
      );
  
      const newBalance = userInfo?.balance + totalDailyEarnings;
  
      // Update Firestore with new plans data and balance
      await updateDoc(userDocRef, {
        plans: updatedPlans,
        balance: newBalance,
        earned: increment(totalDailyEarnings),
      });
  
      const transactionsCollectionRef = collection(userDocRef, "transactions");
      const newTransaction = {
        description: `Gain du plan ${plan.name}`,
        transactionId: plan.name,
        type: "Tâches",
        amount: totalDailyEarnings,
        charge: 0,
        status: "success",
        method: "system",
        date: new Date().toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" }),
      };
  
      await addDoc(transactionsCollectionRef, newTransaction);
  
      // Update local state
      setUserInfo({
        ...userInfo,
        plans: updatedPlans,
        balance: newBalance,
      });
      // Update transactions by appending the new transaction
      setTransactions((prevTransactions) => [...prevTransactions, newTransaction]);
  
      toast({
        variant: "success",
        title: "Tâches effectuées avec succès.",
        description: "Vous avez effectué votre tâche. Vos gains ont été crédités.",
      });
    } catch (error) {
      console.error("Error completing task:", error);
      alert("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };  
  
  

  // const handleInvest = (planId) => {
  //   console.log('Invested in plan:', planId)
  //   setActivePlans([...activePlans, planId])
  // }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Investment Plans</h1>

      <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6 overflow-hidden mb-8">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-gray-50 p-1 rounded-xl">
            <button
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                !showActivePlans ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setShowActivePlans(false)}
            >
              All Plans
            </button>
            <button
              className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 ${
                showActivePlans ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setShowActivePlans(true)}
            >
              Active Plans
            </button>
          </div>
        </div>
      </div>

      {!showActivePlans ? (
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {plans.map((plan) => (
            <article
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
              <p className="text-gray-600 mb-4">Investment: ${plan.price}</p>
              <div className="text-3xl font-bold mb-6 text-gray-800">
                ${plan.dailyRevenue.toFixed(2)}
                <span className="text-sm text-gray-500 font-normal">/day</span>
              </div>
              <p className="text-gray-600 mb-2">Period: {plan.period} days</p>
              <p className="text-gray-600 mb-4">Total Revenue: ${plan.totalRevenue}</p>
              <button
                className={`w-full bg-${plan.color}-600 hover:bg-${plan.color}-700 text-white py-3 rounded-xl font-medium transform hover:scale-105 transition-all duration-300`}
              >
                Invest Now
              </button>
            </article>
          ))}
        </section>
      ) : (
        <section>
          <h2 className="text-2xl font-bold mb-6">Active Investments</h2>
          <div className="space-y-4">
            {activePlans.map((plan) => (
              <article
                key={plan.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg p-6 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <span className={`material-symbols-outlined text-${plan.color}-500 text-2xl`}>{plan.icon}</span>
                    <div>
                      <h4 className="font-semibold">{plan.name}</h4>
                      <p className="text-gray-500">Invested: ${plan.invested.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-500">+${plan.returns.toLocaleString()}</p>
                    <p className="text-gray-500">Returns</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}